// Gestion du thème dark/light
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme();
        this.updateUI();
    }

    applyTheme() {
        if (this.theme === 'dark') {
            document.documentElement.classList.add('dark');
            document.body.classList.add('bg-gray-900', 'text-white');
        } else {
            document.documentElement.classList.remove('dark');
            document.body.classList.remove('bg-gray-900', 'text-white');
        }
    }

    updateUI() {
        const icon = document.getElementById('themeIcon');
        const text = document.getElementById('themeText');
        
        if (icon && text) {
            if (this.theme === 'dark') {
                icon.textContent = '☀️';
                text.textContent = 'Clair';
            } else {
                icon.textContent = '🌙';
                text.textContent = 'Sombre';
            }
        }
    }

    toggle() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', this.theme);
        this.applyTheme();
        this.updateUI();
    }
}

const themeManager = new ThemeManager();

function toggleTheme() {
    themeManager.toggle();
}

document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
});
