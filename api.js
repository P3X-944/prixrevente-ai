// API Router for PrixReventeAI
const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Helper function to verify authentication
const requireAuth = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Non authentifié' });
  }

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    return res.status(401).json({ error: 'Token invalide' });
  }

  req.user = user;
  next();
};

// Route: Login (handled by Supabase Auth in frontend)
// This is just for reference - actual auth happens client-side

// Route: Get user subscription info
router.get('/subscription', requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('status', 'active')
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    res.json({
      subscription: data || null,
      hasActiveSubscription: !!data
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'abonnement' });
  }
});

// Route: Create price estimation
router.post('/estimate', requireAuth, async (req, res) => {
  try {
    const { platform, category, condition, brand, description, images } = req.body;

    // Check subscription status
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('status', 'active')
      .single();

    if (!subscription) {
      return res.status(403).json({ error: 'Abonnement requis' });
    }

    // Check estimation limit
    const { data: estimations, error: countError } = await supabase
      .from('estimations')
      .select('id')
      .eq('user_id', req.user.id)
      .gte('created_at', new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString());

    if (countError) throw countError;

    const currentCount = estimations?.length || 0;
    const maxEstimations = subscription.plan === 'starter' ? 10 : 
                          subscription.plan === 'pro' ? 100 : Infinity;

    if (currentCount >= maxEstimations) {
      return res.status(429).json({ 
        error: 'Limite d\'estimations atteinte pour ce mois',
        currentCount,
        maxEstimations
      });
    }

    // AI estimation logic (simplified - would call actual AI service)
    const estimatedPrice = calculatePrice({ platform, category, condition, brand });

    // Save estimation
    const { data: newEstimation, error: insertError } = await supabase
      .from('estimations')
      .insert({
        user_id: req.user.id,
        platform,
        category,
        condition,
        brand,
        description,
        estimated_price: estimatedPrice,
        image_urls: images
      })
      .select()
      .single();

    if (insertError) throw insertError;

    res.json({
      estimation: newEstimation,
      remainingEstimations: maxEstimations - currentCount - 1
    });
  } catch (error) {
    console.error('Error creating estimation:', error);
    res.status(500).json({ error: 'Erreur lors de la création de l\'estimation' });
  }
});

// Route: Get user's estimation history
router.get('/estimations', requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('estimations')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ estimations: data });
  } catch (error) {
    console.error('Error fetching estimations:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des estimations' });
  }
});

// Helper function to calculate price (simplified AI logic)
function calculatePrice({ platform, category, condition, brand }) {
  // Base prices by category
  const basePrices = {
    'vetements': 20,
    'chaussures': 30,
    'accessoires': 15,
    'beaute': 25,
    'maison': 40,
    'electronique': 100
  };

  let price = basePrices[category] || 20;

  // Condition multiplier
  const conditionMultipliers = {
    'neuf': 1.0,
    'tres_bon': 0.8,
    'bon': 0.6,
    'satisfaisant': 0.4,
    'usage': 0.3
  };

  price *= conditionMultipliers[condition] || 0.6;

  // Platform adjustment
  if (platform === 'vinted') {
    price *= 0.9; // Vinted typically lower prices
  }

  // Brand premium (simplified)
  if (brand && brand.toLowerCase().match(/nike|adidas|zara|h&m|apple|samsung/)) {
    price *= 1.3;
  }

  return Math.round(price * 100) / 100;
}

module.exports = router;
