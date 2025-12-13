// Gestion des traductions i18n
const translations = {
    fr: {
        nav: {
            dashboard: 'Dashboard',
            estimation: 'Estimation',
            history: 'Historique',
            pricing: 'Abonnement'
        },
        landing: {
            title: 'Prix optimal de revente en 30 secondes',
            subtitle: 'IA Perplexity + Scraping temps réel Vinted & Leboncoin',
            cta: 'Commencer gratuitement'
        },
        footer: {
            product: 'Produit',
            legal: 'Légal',
            contact: 'Contact',
            rights: 'Tous droits réservés'
        }
    },
    en: {
        nav: {
            dashboard: 'Dashboard',
            estimation: 'Estimate',
            history: 'History',
            pricing: 'Pricing'
        },
        landing: {
            title: 'Optimal resale price in 30 seconds',
            subtitle: 'AI Perplexity + Real-time scraping Vinted & Leboncoin',
            cta: 'Start for free'
        },
        footer: {
            product: 'Product',
            legal: 'Legal',
            contact: 'Contact',
            rights: 'All rights reserved'
        }
    },
    es: {
        nav: {
            dashboard: 'Dashboard',
            estimation: 'Estimación',
            history: 'Historial',
            pricing: 'Precios'
        },
        landing: {
            title: 'Precio óptimo de reventa en 30 segundos',
            subtitle: 'IA Perplexity + Scraping en tiempo real Vinted & Leboncoin',
            cta: 'Comenzar gratis'
        },
        footer: {
            product: 'Producto',
            legal: 'Legal',
            contact: 'Contacto',
            rights: 'Todos los derechos reservados'
        }
    },
    de: {
        nav: {
            dashboard: 'Dashboard',
            estimation: 'Schätzung',
            history: 'Verlauf',
            pricing: 'Preise'
        },
        landing: {
            title: 'Optimaler Wiederverkaufspreis in 30 Sekunden',
            subtitle: 'KI Perplexity + Echtzeit-Scraping Vinted & Leboncoin',
            cta: 'Kostenlos starten'
        },
        footer: {
            product: 'Produkt',
            legal: 'Rechtliches',
            contact: 'Kontakt',
            rights: 'Alle Rechte vorbehalten'
        }
    }
};

class I18nManager {
    constructor() {
        this.currentLang = localStorage.getItem('language') || 'fr';
        this.init();
    }

    init() {
        this.updateLanguageSelector();
    }

    changeLanguage(lang) {
        if (!translations[lang]) return;
        
        this.currentLang = lang;
        localStorage.setItem('language', lang);
        this.updateLanguageSelector();
        
        console.log('Langue changée:', lang);
    }

    updateLanguageSelector() {
        const selector = document.getElementById('languageSelector');
        if (selector) {
            selector.value = this.currentLang;
        }
    }

    t(key) {
        const keys = key.split('.');
        let value = translations[this.currentLang];
        
        for (const k of keys) {
            value = value[k];
            if (!value) return key;
        }
        
        return value;
    }
}

const i18n = new I18nManager();

function changeLanguage(lang) {
    i18n.changeLanguage(lang);
}

document.addEventListener('DOMContentLoaded', () => {
    const langSelector = document.getElementById('languageSelector');
    if (langSelector) {
        langSelector.addEventListener('change', (e) => changeLanguage(e.target.value));
    }
});
