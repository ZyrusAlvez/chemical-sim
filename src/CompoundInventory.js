// Global compound inventory that persists between stages
class CompoundInventory {
    constructor() {
        this.createdCompounds = new Set();
    }

    addCompound(compoundName) {
        this.createdCompounds.add(compoundName);
    }

    hasCompound(compoundName) {
        return this.createdCompounds.has(compoundName);
    }

    getCreatedCompounds() {
        return Array.from(this.createdCompounds);
    }

    clear() {
        this.createdCompounds.clear();
    }
}

// Create global instance
export const compoundInventory = new CompoundInventory();