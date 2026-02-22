// Global compound inventory — sessionStorage persistence (survives stage switch, wipes on tab close)
class CompoundInventory {
    constructor() {
        this.MAX_SLOTS = 25;
        this.duplicateAllowed = ['Hydrogen Gas', 'Oxygen Gas', 'Chlorine Gas', 'Silver Chloride'];
        this.load();
    }

    load() {
        const saved = window.sessionStorage.getItem('chemSimProgress');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                window.gameProgress = { ...window.gameProgress, ...parsed };
                if (!Array.isArray(window.gameProgress.discoveredRecipes)) {
                    window.gameProgress.discoveredRecipes = [];
                }
                if (!Array.isArray(window.gameProgress.unlockedRecipes)) {
                    window.gameProgress.unlockedRecipes = [];
                }
                if (!window.gameProgress.milestones) {
                    window.gameProgress.milestones = { bronze: false, silver: false, master: false };
                }
            } catch (e) {
                // Silent fail
            }
        }
    }

    save() {
        window.sessionStorage.setItem('chemSimProgress', JSON.stringify(window.gameProgress));
    }

    // Add compound to SHELF (visual display)
    addCompound(compoundName) {
        if (this.getCreatedCompounds().length >= this.MAX_SLOTS) {
            return false;
        }
        if (!this.duplicateAllowed.includes(compoundName) && this.hasCompound(compoundName)) {
            return false;
        }
        window.gameProgress.unlockedRecipes.push(compoundName);
        this.save();
        return true;
    }

    // Track a unique discovery by reaction equation (survives Clear Shelf)
    addDiscovery(equationKey) {
        if (!window.gameProgress.discoveredRecipes.includes(equationKey)) {
            window.gameProgress.discoveredRecipes.push(equationKey);
            this.save();
        }
    }

    hasCompound(compoundName) {
        return window.gameProgress.unlockedRecipes.includes(compoundName);
    }

    hasDiscovery(key) {
        return window.gameProgress.discoveredRecipes.includes(key);
    }

    getCreatedCompounds() {
        return [...window.gameProgress.unlockedRecipes];
    }

    getTotalCount() {
        return window.gameProgress.unlockedRecipes.length;
    }

    // Count unique non-gas shelf items
    getUniqueNonGasCount() {
        const unique = new Set(window.gameProgress.unlockedRecipes.filter(
            name => !this.duplicateAllowed.includes(name)
        ));
        return unique.size;
    }

    // Count unique discoveries (permanent within session, survives Clear Shelf)
    // Each reaction equation is a unique discovery
    getDiscoveryCount() {
        return window.gameProgress.discoveredRecipes.length;
    }

    // Clear SHELF only — does NOT erase discovery progress
    clearShelf() {
        window.gameProgress.unlockedRecipes = [];
        this.save();
    }

    // Milestone Getters/Setters
    get hasShownBronze() { return window.gameProgress.milestones.bronze; }
    set hasShownBronze(val) { window.gameProgress.milestones.bronze = val; this.save(); }

    get hasShownSilver() { return window.gameProgress.milestones.silver; }
    set hasShownSilver(val) { window.gameProgress.milestones.silver = val; this.save(); }

    get isMasterUnlocked() { return window.gameProgress.milestones.master; }
    set isMasterUnlocked(val) { window.gameProgress.milestones.master = val; this.save(); }

    // FULL RESET — wipes ALL progress for a "New Game" experience
    resetAll() {
        window.gameProgress = {
            unlockedRecipes: [],
            discoveredRecipes: [],
            milestones: { bronze: false, silver: false, master: false }
        };

        // Clear all chemSim-related sessionStorage keys
        const keysToRemove = [];
        for (let i = 0; i < window.sessionStorage.length; i++) {
            const key = window.sessionStorage.key(i);
            if (key && key.startsWith('chemSim')) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => window.sessionStorage.removeItem(key));

        // Remove any active achievement popups from the DOM
        const badge = document.querySelector('.achievement-badge');
        if (badge) badge.remove();
        const finale = document.querySelector('.grand-finale-overlay');
        if (finale) finale.remove();

        this.save();
    }
}

// Create global instance
export const compoundInventory = new CompoundInventory();