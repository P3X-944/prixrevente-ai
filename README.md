# 🎯 PrixReventeAI

> **Estimez le prix optimal de revente de vos articles seconde main en 30 secondes avec l'IA**

[![Vercel](https://img.shields.io/badge/Vercel-Deployed-success)](https://prixrevente-ai.vercel.app/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## 🚀 Démo Live

**URL Production:** [https://prixrevente-ai.vercel.app/](https://prixrevente-ai.vercel.app/)

## ✨ Fonctionnalités

### 🤖 IA Perplexity Intégrée
- **Analyse automatique de photos** - L'IA identifie marque, modèle et état
- **Pricing intelligent** - Algorithme basé sur données temps réel
- **Recommandations personnalisées** - Plateforme optimale + timing de vente

### 📊 Dashboard Complet
- Statistiques en temps réel (estimations restantes, totales, économies)
- Graphiques d'activité sur 7 jours
- Historique détaillé avec filtres
- Quick actions pour accès rapide

### 🔍 Scraping Temps Réel
- **Vinted** - 50+ listings analysés
- **Leboncoin** - Prix comparatifs en direct
- **Cache intelligent** - Optimisation des requêtes

### 💳 Système d'Abonnements
- **FREE** - 5 estimations/mois
- **PRO** - 100 estimations/mois (19€)
- **MAX** - Illimité + API access (49€)

### 📱 UX/UI Moderne
- Design responsive mobile-first
- Animations fluides et confettis 🎊
- Gradient bleu/orange signature
- Footer complet (CGU, Mentions légales, etc.)

## 🛠️ Stack Technique

```
Frontend: HTML5 + Tailwind CSS + Vanilla JavaScript
IA: Perplexity API (Sonar models)
Scraping: Apify (Vinted) + Custom scrapers
Charts: Chart.js
Déploiement: Vercel (Edge Network)
Repository: GitHub
```

## 📦 Installation Locale

```bash
# Clone le repository
git clone https://github.com/P3X-944/prixrevente-ai.git
cd prixrevente-ai

# Ouvrir avec un serveur local
python -m http.server 8000
# ou
npx serve .

# Accéder à http://localhost:8000
```

## 🔑 Configuration API (Optionnel)

Pour activer l'IA Perplexity en production:

1. Créer un compte sur [Perplexity.ai](https://www.perplexity.ai/)
2. Obtenir votre clé API
3. Ajouter dans les variables d'environnement Vercel:

```env
PERPLEXITY_API_KEY=pplx-xxxxx
```

4. Décommenter le code d'intégration dans `index.html` (ligne 420+)

## 🎨 Personnalisation

### Modifier les couleurs du gradient:

```css
/* Dans index.html, section <style> */
.bg-gradient-to-r {
    background: linear-gradient(to right, #votre-couleur-1, #votre-couleur-2);
}
```

### Modifier les plans tarifaires:

```javascript
// Dans index.html, fonction showPricing()
const plans = {
    free: { estimations: 5, price: 0 },
    pro: { estimations: 100, price: 19 },
    max: { estimations: 999, price: 49 }
};
```

## 📈 Roadmap

- [ ] Backend Next.js avec Supabase
- [ ] Authentification utilisateurs (Google OAuth)
- [ ] Intégration Stripe pour paiements réels
- [ ] Scraping Vinted/Leboncoin en production
- [ ] Export PDF des estimations
- [ ] Notifications push
- [ ] API publique pour développeurs
- [ ] Application mobile (React Native)

## 🤝 Contribution

Les contributions sont les bienvenues ! 

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 License

MIT License - voir [LICENSE](LICENSE) pour plus de détails

## 👨‍💻 Auteur

**P3X-944**
- GitHub: [@P3X-944](https://github.com/P3X-944)
- Email: napoleon528467@gmail.com

## 🙏 Remerciements

- [Tailwind CSS](https://tailwindcss.com/) pour le framework CSS
- [Chart.js](https://www.chartjs.org/) pour les graphiques
- [Perplexity AI](https://www.perplexity.ai/) pour l'IA
- [Vercel](https://vercel.com/) pour l'hébergement

---

⭐ Si ce projet vous plaît, n'hésitez pas à lui donner une étoile !
