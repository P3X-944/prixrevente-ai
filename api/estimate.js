// Vercel Serverless Function: Create Price Estimation
const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    // Initialize Supabase
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    // Verify user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return res.status(401).json({ error: 'Token invalide' });
    }

    const { platform, category, condition, brand, description, images } = req.body;

    // Validate required fields
    if (!platform || !category || !condition) {
      return res.status(400).json({ error: 'Données manquantes' });
    }

    // Check subscription status
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (!subscription) {
      return res.status(403).json({ error: 'Abonnement requis' });
    }

    // Check estimation limit based on plan
    const { data: estimations, error: countError } = await supabase
      .from('estimations')
      .select('id')
      .eq('user_id', user.id)
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

    // Calculate estimated price using AI logic
    const estimatedPrice = calculatePrice({ platform, category, condition, brand });

    // Save estimation
    const { data: newEstimation, error: insertError } = await supabase
      .from('estimations')
      .insert({
        user_id: user.id,
        platform,
        category,
        condition,
        brand,
        description,
        estimated_price: estimatedPrice,
        image_urls: images || []
      })
      .select()
      .single();

    if (insertError) throw insertError;

    res.status(200).json({
      estimation: newEstimation,
      remainingEstimations: maxEstimations - currentCount - 1
    });
  } catch (error) {
    console.error('Error creating estimation:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

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
