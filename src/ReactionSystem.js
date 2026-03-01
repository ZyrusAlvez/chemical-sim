import { elements, compounds } from '../data/chemicals.js';

export class ReactionSystem {
    constructor() {
        this.reactions = [];
        this.loaded = false;
    }

    // Load reactions from JSON file
    async loadReactions() {
        if (this.loaded) return;

        try {
            const response = await fetch('../data/reactions.json');
            this.reactions = await response.json();
            this.loaded = true;
        } catch (error) {
            console.error('Failed to load reactions:', error);
            this.reactions = [];
        }
    }

    // Find matching reaction based on reactant keys and active energy
    findReaction(reactantKeys, activeEnergy) {
        // Normalize reactant keys to symbols
        const inputSymbols = this.getSymbolsFromKeys(reactantKeys);


        const matchingReactions = [];

        for (const reaction of this.reactions) {
            const reactionSymbols = reaction.reactants.map(r => this.normalizeSymbol(r)).sort();
            const inputSymbolsSorted = [...inputSymbols].sort();

            // Check if arrays match
            if (this.arraysEqual(reactionSymbols, inputSymbolsSorted)) {
                matchingReactions.push(reaction);
            }
        }

        if (matchingReactions.length === 0) {

            return null;
        }

        // Sort matches by energy priority:
        // 1. Exact Energy Match (Requires Energy === Active Energy)
        // 2. Passive Match (Requires None, Active is whatever)
        // 3. Mismatch (Will fail validation later, but returning allows message)

        matchingReactions.sort((a, b) => {
            const reqA = this.getRequiredEnergy(a);
            const reqB = this.getRequiredEnergy(b);

            const aMatches = reqA === activeEnergy;
            const bMatches = reqB === activeEnergy;

            if (aMatches && !bMatches) return -1;
            if (!aMatches && bMatches) return 1;
            return 0;
        });


        return matchingReactions[0];
    }

    // Atomic Interceptor: Check if the user is trying to use atoms where molecules are required
    checkAtomicInterception(reactantKeys) {
        const inputSymbols = this.getSymbolsFromKeys(reactantKeys);
        const counts = {};
        inputSymbols.forEach(s => counts[s] = (counts[s] || 0) + 1);

        // Check for Oxygen Atoms -> O2 requirement
        if (counts['O'] >= 2 && !counts['O2']) {
            // User has 2+ Oxygen atoms but no Oxygen Gas.
            // They might be trying Mg + O + O instead of Mg + O2.
            return {
                type: 'hint',
                hintKey: 'mgo2flame', // Or generic O2 hint if available
                message: 'Form Oxygen Gas (O2) first! Combine 2 Oxygen atoms.'
            };
        }

        // Check for Chlorine Atoms -> Cl2 requirement
        if (counts['Cl'] >= 2 && !counts['Cl2']) {
            return {
                type: 'hint',
                hintKey: 'mgcl2', // Or generic Cl2 hint
                message: 'Form Chlorine Gas (Cl2) first! Combine 2 Chlorine atoms.'
            };
        }

        return null;
    }

    // Convert texture keys to chemical symbols
    getSymbolsFromKeys(keys) {
        const symbols = [];

        for (const key of keys) {
            // Check elements
            const element = elements.find(e => e.textureKey === key);
            if (element) {
                symbols.push(this.normalizeSymbol(element.symbol));
                continue;
            }

            // Check compounds
            const compound = compounds.find(c => c.textureKey === key);
            if (compound) {
                // STRICT MOLECULAR LOGIC:
                // Do NOT split gases (O2, Cl2) into atoms. They are distinct reactants.
                symbols.push(this.normalizeSymbol(compound.symbol));
            }
        }

        return symbols;
    }

    // Normalize chemical symbols (handle subscripts)
    normalizeSymbol(symbol) {
        // Convert O₂ to O2, H₂ to H2, etc.
        return symbol
            .replace(/₀/g, '0')
            .replace(/₁/g, '1')
            .replace(/₂/g, '2')
            .replace(/₃/g, '3')
            .replace(/₄/g, '4');
    }

    // Check if two arrays are equal
    arraysEqual(arr1, arr2) {
        if (arr1.length !== arr2.length) return false;
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) return false;
        }
        return true;
    }

    // Check if energy requirement is met
    validateEnergy(reaction, activeEnergy) {
        if (!reaction.energy_source) return true; // No energy required

        // Map energy source to button types (Active Energy is snake_case)
        const energyMap = {
            'Initial Heat': 'initial_heat',
            'initial_heat': 'initial_heat', // Support raw key
            'Electricity High': 'electricity',
            'Electricity High (Molten)': 'electricity',
            'High Heat': 'high_heat',
            'high_heat': 'high_heat'
        };

        const requiredEnergy = energyMap[reaction.energy_source];

        // STRICT ENERGY CHECK: Must be exact match
        return activeEnergy === requiredEnergy;
    }

    // Get required energy type for a reaction
    getRequiredEnergy(reaction) {
        if (!reaction || !reaction.energy_source) return null;

        const energyMap = {
            'Initial Heat': 'initial_heat',
            'Electricity High': 'electricity',
            'Electricity High (Molten)': 'electricity',
            'High Heat': 'high_heat'
        };

        return energyMap[reaction.energy_source];
    }

    // Get product objects for a reaction
    getProducts(reaction) {
        if (!reaction) return [];

        const products = [];

        for (const productSymbol of reaction.products) {
            const normalized = this.normalizeSymbol(productSymbol);

            // Check if it's an element
            const element = elements.find(e => this.normalizeSymbol(e.symbol) === normalized);
            if (element) {
                products.push(element);
                continue;
            }

            // Check if it's a compound
            const compound = compounds.find(c => this.normalizeSymbol(c.symbol) === normalized);
            if (compound) {
                products.push(compound);
            }
        }

        return products;
    }
}

