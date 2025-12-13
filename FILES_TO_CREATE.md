# 🗂️ Fichiers à créer pour PrixReventeAI

## 🎯 Structure du projet multi-pages

### 📚 Pages HTML séparées:
1. **index.html** - Page d'accueil (landing) ✅ Déjà créé
2. **login.html** - Connexion/Inscription ✅ Déjà créé
3. **dashboard.html** - Tableau de bord utilisateur ⏳ À créer
4. **estimation.html** - Page estimation produit ⏳ À créer
5. **historique.html** - Historique des estimations ⏳ À créer  
6. **pricing.html** - Page abonnements (FREE/PRO/PREMIUM) ⏳ À créer

### 🛠️ Fichiers JavaScript:
1. **auth.js** - Authentification Google Sign-In ✅ Déjà créé
2. **app.js** - Fonctions principales ✅ Déjà créé
3. **navigation.js** - Gestion navigation multi-pages ⏳ À créer
4. **theme.js** - Gestion thème dark/light ⏳ À créer
5. **i18n.js** - Gestion traductions (FR/EN/ES/DE) ⏳ À créer

---

## ⚙️ Modifications à faire:

### Dans index.html:
- ✅ Footer déplacé hors du `<main>`
- ✅ 3ème offre PREMIUM ajoutée
- ❌ Remplacer liens onclick par vrais liens href vers pages

### Dans pricing (offres):
- ❌ **Enlever**: API Access, Intégration Zapier
- ✅ **Garder**: Scraping Vinted/Leboncoin uniquement
- ✅ FREE: 5 estimations/mois
- ✅ PRO: 100 estimations/mois  
- ✅ PREMIUM: Illimité + Support prioritaire

---

## 📝 Contenus corrects pour PREMIUM:

```
PREMIUM - 49€/mois
- ✅ Estimations illimitées ∞
- ✅ Scraping avancé multi-plateformes (Vinted, Leboncoin, eBay)
- ✅ Analyse IA avancée des tendances de prix
- ✅ Support prioritaire 24/7
- ✅ Historique complet sans limite
- ✅ Export multi-formats (PDF, CSV)
- ✅ Notifications prix en temps réel
- ✅ Statistiques avancées
```

**RETIRER**:
- ❌ API Access  
- ❌ Intégration Zapier
- ❌ Webhooks

---

## 🚀 Plan d'action:

### Étape 1: Créer fichier `theme.js`
Gestion complète du thème dark/light persistant

### Étape 2: Créer fichier `i18n.js`  
Traductions FR/EN/ES/DE avec détection automatique

### Étape 3: Créer `dashboard.html`
Tableau de bord avec stats réelles (non aléatoires)

### Étape 4: Créer `estimation.html`
Page estimation avec upload photo et analyse

### Étape 5: Créer `historique.html`
Historique avec filtres et tri

### Étape 6: Créer `pricing.html`
3 offres avec contenus corrects (sans API)

### Étape 7: Mettre à jour `index.html`
Remplacer onclick par href vers vraies pages

---

## 🔗 Navigation entre pages:

Au lieu de `onclick="showDashboard()"`, utiliser:
```html
<a href="dashboard.html">Dashboard</a>
<a href="estimation.html">Estimation</a>
<a href="historique.html">Historique</a>
<a href="pricing.html">Abonnement</a>
```

---

## 🎯 Priorités:

1. ⭐ **URGENT**: Créer `theme.js` et `i18n.js` (fonctionnalités actuellement non fonctionnelles)
2. 🔴 **IMPORTANT**: Créer les 4 pages manquantes
3. 🟡 **NICE TO HAVE**: Améliorer le design et les animations

---

**Statut actuel**: 2/6 pages créées, 2/5 fichiers JS créés
**Prochaine étape**: Créer theme.js et i18n.js
