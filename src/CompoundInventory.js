// Global compound inventory — volatile session memory (resets on refresh)
class CompoundInventory {
    constructor() {
        this.MAX_SLOTS = 25;
        this.duplicateAllowed = ['Hydrogen Gas', 'Oxygen Gas', 'Chlorine Gas'];
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
    }

    // Milestone Getters/Setters
    get hasShownBronze() { return window.gameProgress.milestones.bronze; }
    set hasShownBronze(val) { window.gameProgress.milestones.bronze = val; }

    get hasShownSilver() { return window.gameProgress.milestones.silver; }
    set hasShownSilver(val) { window.gameProgress.milestones.silver = val; }

    get isMasterUnlocked() { return window.gameProgress.milestones.master; }
    set isMasterUnlocked(val) { window.gameProgress.milestones.master = val; }
}

// Create global instance
export const compoundInventory = new CompoundInventory();