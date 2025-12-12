// PrixReventeAI - Gestion d'authentification et comptes
// Conforme RGPD avec Google Sign-In

// Configuration Google OAuth (à remplacer par vos vraies clés)
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';

// Structure utilisateur
class User {
    constructor(data) {
        this.id = data.id || null;
        this.email = data.email;
        this.name = data.name;
        this.photoURL = data.photoURL || null;
        this.plan = data.plan || 'FREE'; // FREE, PRO, PREMIUM
        this.quotaUsed = data.quotaUsed || 0;
        this.quotaLimit = this.getQuotaLimit();
        this.createdAt = data.createdAt || new Date().toISOString();
        this.acceptedTerms = data.acceptedTerms || false;
        this.acceptedRGPD = data.acceptedRGPD || false;
    }

    getQuotaLimit() {
        const limits = { FREE: 5, PRO: 100, PREMIUM: -1 }; // -1 = illimité
        return limits[this.plan] || 5;
    }

    canMakeEstimation() {
        if (this.plan === 'PREMIUM') return true;
        return this.quotaUsed < this.quotaLimit;
    }

    getRemainingQuota() {
        if (this.plan === 'PREMIUM') return '∞';
        return Math.max(0, this.quotaLimit - this.quotaUsed);
    }
}

// Gestion de l'état d'authentification
let currentUser = null;

// Initialiser Google Sign-In
function initGoogleAuth() {
    // Charger le script Google Sign-In
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
        google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleSignIn
        });
    };
}

// Gérer la connexion Google
function handleGoogleSignIn(response) {
    // Décoder le JWT token
    const userData = parseJwt(response.credential);
    
    // Créer ou charger l'utilisateur
    const user = {
        id: userData.sub,
        email: userData.email,
        name: userData.name,
        photoURL: userData.picture
    };

    // Vérifier si l'utilisateur existe déjà
    const existingUser = localStorage.getItem(`user_${user.id}`);
    
    if (existingUser) {
        currentUser = new User(JSON.parse(existingUser));
    } else {
        // Nouveau utilisateur - afficher le consentement RGPD
        showRGPDConsent(user);
        return;
    }

    onAuthSuccess();
}

// Parser JWT token
function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

// Afficher le consentement RGPD pour les nouveaux utilisateurs
function showRGPDConsent(userData) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-8 max-w-2xl m-4 max-h-screen overflow-y-auto">
            <h2 class="text-2xl font-bold mb-4">🔒 Protection de vos données</h2>
            <p class="mb-4">Bienvenue <strong>${userData.name}</strong> !</p>
            
            <div class="bg-blue-50 p-4 rounded mb-4">
                <h3 class="font-bold mb-2">📋 Données collectées (RGPD)</h3>
                <ul class="text-sm space-y-1">
                    <li>✓ Nom et email (pour votre compte)</li>
                    <li>✓ Historique d'estimations (stocké localement)</li>
                    <li>✓ Utilisation du quota (pour la facturation)</li>
                </ul>
            </div>

            <div class="bg-green-50 p-4 rounded mb-4">
                <h3 class="font-bold mb-2">🛡️ Vos droits RGPD</h3>
                <ul class="text-sm space-y-1">
                    <li>✓ Droit d'accès à vos données</li>
                    <li>✓ Droit de rectification et suppression</li>
                    <li>✓ Droit à la portabilité des données</li>
                    <li>✓ Droit d'opposition au traitement</li>
                </ul>
            </div>

            <div class="mb-4">
                <label class="flex items-start gap-2 cursor-pointer">
                    <input type="checkbox" id="acceptTerms" class="mt-1">
                    <span class="text-sm">J'accepte les <a href="#" class="text-blue-600 underline">Conditions Générales d'Utilisation</a></span>
                </label>
            </div>

            <div class="mb-6">
                <label class="flex items-start gap-2 cursor-pointer">
                    <input type="checkbox" id="acceptRGPD" class="mt-1">
                    <span class="text-sm">J'accepte la <a href="#" class="text-blue-600 underline">Politique de Confidentialité</a> et le traitement de mes données conformément au RGPD</span>
                </label>
            </div>

            <div class="flex gap-3">
                <button onclick="cancelSignup()" class="flex-1 bg-gray-200 px-4 py-2 rounded">Annuler</button>
                <button onclick="confirmSignup()" id="confirmBtn" disabled class="flex-1 bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50">Créer mon compte</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Stocker temporairement les données
    window.tempUserData = userData;

    // Activer le bouton uniquement si les deux cases sont cochées
    const acceptTerms = modal.querySelector('#acceptTerms');
    const acceptRGPD = modal.querySelector('#acceptRGPD');
    const confirmBtn = modal.querySelector('#confirmBtn');

    [acceptTerms, acceptRGPD].forEach(cb => {
        cb.addEventListener('change', () => {
            confirmBtn.disabled = !(acceptTerms.checked && acceptRGPD.checked);
        });
    });
}

// Confirmer l'inscription
function confirmSignup() {
    const userData = window.tempUserData;
    currentUser = new User({
        ...userData,
        acceptedTerms: true,
        acceptedRGPD: true
    });

    // Sauvegarder dans localStorage
    localStorage.setItem(`user_${currentUser.id}`, JSON.stringify(currentUser));
    localStorage.setItem('currentUserId', currentUser.id);

    // Fermer la modal
    document.querySelector('.fixed.inset-0').remove();
    delete window.tempUserData;

    onAuthSuccess();
}

// Annuler l'inscription
function cancelSignup() {
    document.querySelector('.fixed.inset-0').remove();
    delete window.tempUserData;
}

// Succès de l'authentification
function onAuthSuccess() {
    // Masquer la page de login
    const loginPage = document.getElementById('login');
    if (loginPage) loginPage.classList.add('hidden');

    // Afficher le dashboard
    showDashboard();
    updateUserUI();
}

// Mettre à jour l'interface utilisateur
function updateUserUI() {
    if (!currentUser) return;

    // Mettre à jour le quota
    const quotaElement = document.getElementById('estimationsLeft');
    if (quotaElement) {
        quotaElement.textContent = currentUser.getRemainingQuota();
    }

    // Mettre à jour le total
    const totalElement = document.getElementById('totalEstimations');
    if (totalElement) {
        totalElement.textContent = currentUser.quotaUsed;
    }

    // Mettre à jour le nom d'utilisateur
    const userNameElements = document.querySelectorAll('.user-name');
    userNameElements.forEach(el => el.textContent = currentUser.name);

    // Mettre à jour la photo
    const userPhotoElements = document.querySelectorAll('.user-photo');
    userPhotoElements.forEach(el => {
        if (currentUser.photoURL) {
            el.src = currentUser.photoURL;
        }
    });
}

// Déconnexion
function logout() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
        localStorage.removeItem('currentUserId');
        currentUser = null;
        showLoginPage();
    }
}

// Afficher la page de connexion
function showLoginPage() {
    hideAll();
    const loginPage = document.getElementById('login');
    if (loginPage) {
        loginPage.classList.remove('hidden');
    }
}

// Incrémenter le quota utilisé
function incrementQuota() {
    if (!currentUser) return false;
    
    if (!currentUser.canMakeEstimation()) {
        showUpgradeModal();
        return false;
    }

    currentUser.quotaUsed++;
    localStorage.setItem(`user_${currentUser.id}`, JSON.stringify(currentUser));
    updateUserUI();
    return true;
}

// Afficher la modal d'upgrade
function showUpgradeModal() {
    alert('Quota épuisé ! Passez à PRO ou PREMIUM pour continuer à utiliser PrixReventeAI.');
    showPricing();
}

// Charger l'utilisateur au démarrage
function loadUser() {
    const userId = localStorage.getItem('currentUserId');
    if (userId) {
        const userData = localStorage.getItem(`user_${userId}`);
        if (userData) {
            currentUser = new User(JSON.parse(userData));
            return true;
        }
    }
    return false;
}

// Initialiser au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    initGoogleAuth();
    
    if (loadUser()) {
        onAuthSuccess();
    } else {
        showLoginPage();
    }
});

// Exporter les fonctions
window.auth = {
    currentUser: () => currentUser,
    logout,
    incrementQuota,
    updateUserUI
};
