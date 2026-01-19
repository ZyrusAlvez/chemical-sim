export class ChemicalElement {
  constructor(name, symbol, state) {
    this.name = name;
    this.symbol = symbol;
    this.state = state;
  }
}

export class Compound {
  constructor(name, symbol, state, category, energySource, metalReactivity, property) {
    this.name = name;
    this.symbol = symbol;
    this.state = state;
    this.category = category;
    this.energySource = energySource;
    this.metalReactivity = metalReactivity;
    this.property = property;
  }
}

const magnesium = new ChemicalElement("Magnesium", "Mg", "solid"); d
const sodium = new ChemicalElement("Sodium", "Na", "solid"); d
const iron = new ChemicalElement("Iron", "Fe", "solid"); d
const carbon = new ChemicalElement("Carbon", "C", "solid"); d
const oxygen = new ChemicalElement("Oxygen", "O", "gas"); d
const hydrogen = new ChemicalElement("Hydrogen", "H", "gas"); d
const chlorine = new ChemicalElement("Chlorine", "Cl", "gas"); d
const zinc = new ChemicalElement("Zinc", "Zn", "solid");
const calcium = new ChemicalElement("Calcium", "Ca", "solid"); d
const silver = new ChemicalElement("Silver", "Ag", "solid");
const nitrogen = new ChemicalElement("Nitrogen", "N", "gas");  d
const copper = new ChemicalElement("Copper", "Cu", "solid");
const sulfur = new ChemicalElement("Sulfur", "S", "solid"); d

const water = new Compound("Water", "H2O", "liquid", "solvent", "electricity (high)", "", new Map([[hydrogen, 2], [oxygen, 1]]));
const hydrochloricAcid = new Compound("Hydrochloric Acid", "HCl", "liquid", "acid", "", "", new Map([[hydrogen, 1], [chlorine, 1]]));
const sodiumHydroxide = new Compound("Sodium Hydroxide", "NaOH", "liquid", "base", "", "", new Map([[sodium, 1], [oxygen, 1], [hydrogen, 1]]));
const silverNitrate = new Compound("Silver Nitrate", "AgNO3", "liquid", "salt solution", "", "", new Map([[silver, 1], [nitrogen, 1], [oxygen, 3]]));
const sodiumChloride = new Compound("Sodium Chloride", "NaCl", "liquid", "salt solution", "", "", new Map([[sodium, 1], [chlorine, 1]]));
const copperSulfate = new Compound("Copper (II) Sulfate", "CuSO4", "liquid", "salt solution", "", "", new Map([[copper, 1], [sulfur, 1], [oxygen, 4]]));
const methane = new Compound("Methane", "CH4", "gas", "fuel", "", "", new Map([[carbon, 1], [hydrogen, 4]]));
const calciumCarbonate = new Compound("Calcium Carbonate", "CaCO3", "solid", "carbonate", "heat (high)", "", new Map([[calcium, 1], [carbon, 1], [oxygen, 3]]));

export const elements = [
  magnesium, sodium, iron, carbon, oxygen, hydrogen,
  chlorine, zinc, calcium, silver, nitrogen, copper, sulfur
];

export const compounds = [
  water, hydrochloricAcid, sodiumHydroxide, silverNitrate,
  sodiumChloride, copperSulfate, methane, calciumCarbonate
];

// Test output
console.log("Elements:", elements);
console.log("Compounds:", compounds);