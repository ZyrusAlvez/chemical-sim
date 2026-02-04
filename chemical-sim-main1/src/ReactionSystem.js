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

    // Find matching reaction based on reactant keys
    findReaction(reactantKeys) {
        // Normalize reactant keys to symbols
        const inputSymbols = this.getSymbolsFromKeys(reactantKeys);

        console.log('Looking for reaction with inputs:', inputSymbols);

        for (const reaction of this.reactions) {
            const reactionSymbols = reaction.reactants.map(r => this.normalizeSymbol(r)).sort();
            const inputSymbolsSorted = [...inputSymbols].sort(); // Create copy before sorting

            console.log('Comparing:', inputSymbolsSorted, 'with reaction:', reactionSymbols);

            // Check if arrays match
            if (this.arraysEqual(reactionSymbols, inputSymbolsSorted)) {
                console.log('Match found:', reaction.equation);
                return reaction;
            }
        }

        console.log('No reaction found for:', inputSymbols);
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

        // Map energy source to button types
        const energyMap = {
            'Initial Heat': 'initial_heat',
            'Electricity High': 'electricity',
            'Electricity High (Molten)': 'electricity',
            'High Heat': 'high_heat'
        };

        const requiredEnergy = energyMap[reaction.energy_source];
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

