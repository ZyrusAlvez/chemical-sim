// Global compound inventory — sessionStorage persistence (survives stage switch, wipes on tab close)
class CompoundInventory {
    constructor() {
        this.MAX_SLOTS = 25;
        this.duplicateAllowed = ['Hydrogen Gas', 'Oxygen Gas', 'Chlorine Gas'];
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

        // Also track in permanent discovery list (session-only)
        if (!window.gameProgress.discoveredRecipes.includes(compoundName)) {
            window.gameProgress.discoveredRecipes.push(compoundName);
        }

        this.save();
        return true;
    }

    hasCompound(compoundName) {
        return window.gameProgress.unlockedRecipes.includes(compoundName);
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

    // Count unique non-gas DISCOVERIES (permanent within session, survives Clear Shelf)
    getDiscoveryCount() {
        const unique = new Set(window.gameProgress.discoveredRecipes.filter(
            name => !this.duplicateAllowed.includes(name)
        ));
        return unique.size;
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
}

// Create global instance
export const compoundInventory = new CompoundInventory();