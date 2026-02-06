export class ChemicalElement {
  constructor(name, symbol, state, imagePath, textureKey, energySource = "") {
    this.name = name;
    this.symbol = symbol;
    this.state = state;
    this.imagePath = imagePath;
    this.textureKey = textureKey;
    this.energySource = energySource;
  }
}

export class Compound {
  constructor(name, symbol, state, category, energySource, metalReactivity, scale, property, imagePath, textureKey, hint) {
    this.name = name;
    this.symbol = symbol;
    this.state = state;
    this.category = category;
    this.energySource = energySource;
    this.metalReactivity = metalReactivity;
    this.scale = scale;
    this.property = property;
    this.imagePath = imagePath;
    this.textureKey = textureKey;
    this.hint = hint;
  }
}

const magnesium = new ChemicalElement("Magnesium", "Mg", "solid", "assets/elements/magnesium.png", "magnesium", "initial_heat");
const sodium = new ChemicalElement("Sodium", "Na", "solid", "assets/elements/sodium.png", "sodium");
const iron = new ChemicalElement("Iron", "Fe", "solid", "assets/elements/iron.png", "iron");
const carbon = new ChemicalElement("Carbon", "C", "solid", "assets/elements/carbon.png", "carbon");
const oxygen = new ChemicalElement("Oxygen", "O", "gas", "assets/elements/oxygen.png", "oxygen");
const hydrogen = new ChemicalElement("Hydrogen", "H", "gas", "assets/elements/hydrogen.png", "hydrogen");
const chlorine = new ChemicalElement("Chlorine", "Cl", "gas", "assets/elements/chlorine.png", "chlorine");
const zinc = new ChemicalElement("Zinc", "Zn", "solid", "assets/elements/zinc.png", "zinc");
const calcium = new ChemicalElement("Calcium", "Ca", "solid", "assets/elements/calcium.png", "calcium");
const silver = new ChemicalElement("Silver", "Ag", "solid", "assets/elements/silver.png", "silver");
const nitrogen = new ChemicalElement("Nitrogen", "N", "gas", "assets/elements/nitrogen.png", "nitrogen");
const copper = new ChemicalElement("Copper", "Cu", "solid", "assets/elements/copper.png", "copper");
const sulfur = new ChemicalElement("Sulfur", "S", "solid", "assets/elements/sulfur.png", "sulfur");

const water = new Compound("Water", "H2O", "liquid", "solvent", "electricity (high)", "", 0.1, new Map([[hydrogen, 2], [oxygen, 1]]), "assets/compound/water.png", "water", "assets/speech/hint/water.png");
const hydrochloricAcid = new Compound("Hydrochloric Acid", "HCl", "liquid", "acid", "", "", 0.08, new Map([[hydrogen, 1], [chlorine, 1]]), "assets/compound/hydrochloricAcid.png", "hydrochloricAcid", "assets/speech/hint/hydrochloricAcid.png");
const sodiumHydroxide = new Compound("Sodium Hydroxide", "NaOH", "liquid", "base", "", "", 0.09, new Map([[sodium, 1], [oxygen, 1], [hydrogen, 1]]), "assets/compound/sodiumHydroxide.png", "sodiumHydroxide", "assets/speech/hint/sodiumHydroxide.png");
const silverNitrate = new Compound("Silver Nitrate", "AgNO3", "liquid", "salt solution", "", "", 0.09, new Map([[silver, 1], [nitrogen, 1], [oxygen, 3]]), "assets/compound/silverNitrate.png", "silverNitrate", "assets/speech/hint/silverNitrate.png");
const sodiumChloride = new Compound("Sodium Chloride", "NaCl", "solid", "salt solution", "", "", 0.18, new Map([[sodium, 1], [chlorine, 1]]), "assets/compound/sodiumChloride.png", "sodiumChloride", "assets/speech/hint/nacl.png");
const copperSulfate = new Compound("Copper (II) Sulfate", "CuSO4", "liquid", "salt solution", "", "", 0.08, new Map([[copper, 1], [sulfur, 1], [oxygen, 4]]), "assets/compound/copperSulfate.png", "copperSulfate", "assets/speech/hint/copperSulfate.png");
const methane = new Compound("Methane", "CH4", "gas", "fuel", "", "", 0.1, new Map([[carbon, 1], [hydrogen, 4]]), "assets/compound/methane.png", "methane", "assets/speech/hint/methane.png");
const calciumCarbonate = new Compound("Calcium Carbonate", "CaCO3", "solid", "carbonate", "heat (high)", "", 0.08, new Map([[calcium, 1], [carbon, 1], [oxygen, 3]]), "assets/compound/calciumCarbonate.png", "calciumCarbonate", "assets/speech/hint/calciumCarbonate.png");


// New product compounds (using existing images as placeholders)
const magnesiumOxide = new Compound("Magnesium Oxide", "MgO", "solid", "oxide", "", "", 0.1, new Map([[magnesium, 1], [oxygen, 1]]), "assets/compound/sodiumChloride.png", "mgo", "assets/speech/hint/mgo2flame.png");
const magnesiumOxideCombust = new Compound("Magnesium Oxide", "MgO_c", "solid", "oxide", "", "", 0.1, new Map([[magnesium, 1], [oxygen, 1]]), "assets/compound/sodiumChloride.png", "mgo_c", "assets/speech/hint/mgo2flame.png");
const ironOxide = new Compound("Iron Oxide", "Fe2O3", "solid", "oxide", "", "", 0.1, new Map([[iron, 2], [oxygen, 3]]), "assets/compound/sodiumChloride.png", "fe2o3", "assets/speech/hint/sodiumChloride.png");
const magnesiumChloride = new Compound("Magnesium Chloride", "MgCl2", "solid", "salt", "", "", 0.1, new Map([[magnesium, 1], [chlorine, 2]]), "assets/compound/sodiumChloride.png", "mgcl2", "assets/speech/hint/mgcl2.png");
const calciumOxide = new Compound("Calcium Oxide", "CaO", "solid", "oxide", "", "", 0.1, new Map([[calcium, 1], [oxygen, 1]]), "assets/compound/calciumCarbonate.png", "cao", "assets/speech/hint/cao2.png");
const carbonDioxide = new Compound("Carbon Dioxide", "CO2", "gas", "gas", "", "", 0.1, new Map([[carbon, 1], [oxygen, 2]]), "assets/compound/methane.png", "co2", "assets/speech/hint/methane.png");
const zincChloride = new Compound("Zinc Chloride", "ZnCl2", "solid", "salt", "", "", 0.1, new Map([[zinc, 1], [chlorine, 2]]), "assets/compound/sodiumChloride.png", "zncl2", "assets/speech/hint/sodiumChloride.png");
const ironSulfate = new Compound("Iron Sulfate", "FeSO4", "liquid", "salt solution", "", "", 0.08, new Map([[iron, 1], [sulfur, 1], [oxygen, 4]]), "assets/compound/copperSulfate.png", "feso4", "assets/speech/hint/copperSulfate.png");
const zincSulfate = new Compound("Zinc Sulfate", "ZnSO4", "liquid", "salt solution", "", "", 0.08, new Map([[zinc, 1], [sulfur, 1], [oxygen, 4]]), "assets/compound/copperSulfate.png", "znso4", "assets/speech/hint/copperSulfate.png");
const silverChloride = new Compound("Silver Chloride", "AgCl", "solid", "precipitate", "", "", 0.1, new Map([[silver, 1], [chlorine, 1]]), "assets/compound/sodiumChloride.png", "agcl", "assets/speech/hint/sodiumChloride.png");
const sodiumNitrate = new Compound("Sodium Nitrate", "NaNO3", "liquid", "salt solution", "", "", 0.08, new Map([[sodium, 1], [nitrogen, 1], [oxygen, 3]]), "assets/compound/silverNitrate.png", "nano3", "assets/speech/hint/silverNitrate.png");
const nitricAcid = new Compound("Nitric Acid", "HNO3", "liquid", "acid", "", "", 0.08, new Map([[hydrogen, 1], [nitrogen, 1], [oxygen, 3]]), "assets/compound/hydrochloricAcid.png", "hno3", "assets/speech/hint/hydrochloricAcid.png");

// Molecular gases (products of decomposition)
const hydrogenGas = new Compound("Hydrogen Gas", "H2", "gas", "gas", "", "", 0.05, new Map([[hydrogen, 2]]), "assets/elements/hydrogen.png", "h2", "assets/elements/hydrogen.png");
const oxygenGas = new Compound("Oxygen Gas", "O2", "gas", "gas", "", "", 0.08, new Map([[oxygen, 2]]), "assets/elements/oxygen.png", "o2", "assets/elements/oxygen.png");
const chlorineGas = new Compound("Chlorine Gas", "Cl2", "gas", "gas", "", "", 0.07, new Map([[chlorine, 2]]), "assets/elements/chlorine.png", "cl2", "assets/elements/chlorine.png");



export const elements = [
  magnesium, sodium, iron, carbon, oxygen, hydrogen,
  chlorine, zinc, calcium, silver, nitrogen, copper, sulfur
];

export const compounds = [
  water, hydrochloricAcid, sodiumHydroxide, silverNitrate,
  sodiumChloride, copperSulfate, methane, calciumCarbonate,
  magnesiumOxide, magnesiumOxideCombust, ironOxide, magnesiumChloride, calciumOxide,
  carbonDioxide, zincChloride, ironSulfate, zincSulfate,
  carbonDioxide, zincChloride, ironSulfate, zincSulfate,
  silverChloride, sodiumNitrate, nitricAcid,
  hydrogenGas, oxygenGas, chlorineGas
];

// Test output
console.log("Elements:", elements);
console.log("Compounds:", compounds);