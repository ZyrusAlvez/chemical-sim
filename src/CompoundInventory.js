// Global compound inventory that persists between stages
class CompoundInventory {
    constructor() {
        this.MAX_SLOTS = 25;
        // Gases are allowed to have duplicates
        this.duplicateAllowed = ['Hydrogen Gas', 'Oxygen Gas', 'Chlorine Gas'];

        // Load from localStorage if available, otherwise sync with global/empty
        this.load();
    }

    // Load state from localStorage or initialize from global
    load() {
        const saved = localStorage.getItem('chemicalSimProgress');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                window.gameProgress = { ...window.gameProgress, ...parsed };
            } catch (e) {
                console.error('Failed to load save:', e);
            }
        }
    }

    // Save state to localStorage
    save() {
        localStorage.setItem('chemicalSimProgress', JSON.stringify(window.gameProgress));
    }

    addCompound(compoundName) {
        // Check capacity
        if (this.getCreatedCompounds().length >= this.MAX_SLOTS) {
            alert('Shelf is full! Use the Clear Shelf button to make room for more experiments.');
            return false;
        }

        // Block duplicates for non-gas compounds
        if (!this.duplicateAllowed.includes(compoundName) && this.hasCompound(compoundName)) {
            return false;
        }

        window.gameProgress.unlockedRecipes.push(compoundName);
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

    getUniqueNonGasCount() {
        // Count unique compound names, excluding gas duplicates
        const unique = new Set(window.gameProgress.unlockedRecipes.filter(
            name => !this.duplicateAllowed.includes(name)
        ));
        return unique.size;
    }

    clear() {
        window.gameProgress.unlockedRecipes = [];
        this.save();
    }

    // Milestone Getters/Setters
    get isMasterUnlocked() { return window.gameProgress.milestones.master; }
    set isMasterUnlocked(val) { window.gameProgress.milestones.master = val; this.save(); }

    get hasShownBronze() { return window.gameProgress.milestones.bronze; }
    set hasShownBronze(val) { window.gameProgress.milestones.bronze = val; this.save(); }

    get hasShownSilver() { return window.gameProgress.milestones.silver; }
    set hasShownSilver(val) { window.gameProgress.milestones.silver = val; this.save(); }
}

// Create global instance
export const compoundInventory = new CompoundInventory();