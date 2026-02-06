import { compounds, elements } from '../../data/chemicals.js';
import { compoundInventory } from '../CompoundInventory.js';
import { ReactionSystem } from '../ReactionSystem.js';

export class Stage2 extends Phaser.Scene {

    constructor() {
        super('Stage2');
        this.reactionSystem = new ReactionSystem();
        this.currentHintImage = null;
        this.currentHintText = null;
    }

    preload() {
        this.load.image('beaker', 'assets/beaker.png');
        this.load.image('previousstagebutton', 'assets/previousstagebutton.png');
        this.load.image('combineMachine', 'assets/combine_machine.png');
        this.load.image('electricbutton', 'assets/ui/electricbutton.png');
        this.load.image('btn_electric_pressed', 'assets/ui/btn_electric_pressed.png');
        this.load.image('btn_initialheat', 'assets/ui/btn_initialheat.png');
        this.load.image('btn_initialheat_pressed', 'assets/ui/btn_initialheat_pressed.png');
        this.load.image('btn_highheat', 'assets/ui/btn_highheat.png');
        this.load.image('btn_highheat_pressed', 'assets/ui/btn_highheat_pressed.png');
        this.load.image('btn_combine', 'assets/btn_combine.png');
        this.load.image('btn_combine_pressed', 'assets/btn_combine_pressed.png');
        this.load.image('btn_clear', 'assets/btn_clear.png');
        this.load.image('btn_clear_pressed', 'assets/btn_clear_pressed.png');
        this.load.image('electricbutton', 'assets/electricbutton.png');
        this.load.image('btn_electric_pressed', 'assets/btn_electric_pressed.png');
        this.load.image('btn_initialheat', 'assets/btn_initialheat.png');
        this.load.image('btn_initialheat_pressed', 'assets/btn_initialheat_pressed.png');
        this.load.image('btn_highheat', 'assets/btn_highheat.png');
        this.load.image('btn_highheat_pressed', 'assets/btn_highheat_pressed.png');

        // Load hint speech bubbles (all files from assets/speech/hint/)
        this.load.image('cao2', 'assets/speech/hint/cao2.png?v=999');
        this.load.image('mgo2flame', 'assets/speech/hint/mgo2flame.png?v=999');
        this.load.image('mgcl2', 'assets/speech/hint/mgcl2.png?v=999');
        this.load.image('water', 'assets/speech/hint/water.png');
        // Load compound images and hints dynamically from chemicals.js
        if (typeof compounds !== 'undefined') {
            compounds.forEach(compound => {
                // FORCE SKIP NaCl here so we can load it manually below with explicit path
                if (compound.textureKey === 'sodiumChloride') return;

                // Ensure we don't overwrite if manually loaded, but for hints we want the chemicals.js version
                // Actually Stage 2 relies on specific keys.
                // safer to load hint with _hint suffix like Start.js
                if (compound.hint) {
                    this.load.image(compound.textureKey + '_hint', compound.hint);
                }
            });
        }

        // Force override for NaCl Hint - Use cache buster to ensure update
        this.load.image('sodiumChloride_hint', 'assets/speech/hint/nacl.png?v=999');

        // Manual loads for specific reaction hints not in compounds list (if any)
        this.load.image('h2oelectric', 'assets/speech/hint/h2oelectric.png');
        this.load.image('ch4o2_hint', 'assets/speech/hint/ch4o2.png?v=999'); // Force load
        this.load.image('copperSulfate_hint', 'assets/speech/hint/copperSulfate.png'); // Renamed to avoid collision
        this.load.image('fecuso4', 'assets/speech/hint/fecuso4.png');
        this.load.image('silverNitrate', 'assets/speech/hint/silverNitrate.png');
        this.load.image('sodiumHydroxide', 'assets/speech/hint/sodiumHydroxide.png');
        this.load.image('znhcl', 'assets/speech/hint/znhcl.png');
        this.load.image('mghcl', 'assets/speech/hint/mghcl.png');
        this.load.image('zncuso4', 'assets/speech/hint/zncuso4.png');
        this.load.image('mgcuso4', 'assets/speech/hint/mgcuso4.png');
        this.load.image('agno3nacl', 'assets/speech/hint/agno3nacl.png');
        this.load.image('agno3hcl', 'assets/speech/hint/agno3hcl.png');
        this.load.image('hclnaoh', 'assets/speech/hint/hclnaoh.png');
    }

    create() {
        // VERIFICATION: If you see this alert, the NEW code is loaded!
        console.log("ðŸš€ STAGE2 NEW VERSION LOADED - DEPTH 5000 ACTIVE ðŸš€");

        // Load reactions data
        this.reactionSystem.loadReactions();

        this.add.image(928, 522, 'background').setDisplaySize(1856, 1044);
        this.shelf = this.add.image(-200, 1200, 'shelf').setOrigin(0, 1).setScale(1).setDepth(1);

        this.add.image(525, 1390, 'beaker').setOrigin(0, 1).setScale(1).setName('beaker');

        this.combineBtn = this.add.image(1008, 1015, 'btn_combine').setOrigin(0, 1).setScale(0.35).setInteractive({ cursor: 'pointer' });
        this.combineBtnPressed = this.add.image(1008, 1015, 'btn_combine_pressed').setOrigin(0, 1).setScale(0.35).setVisible(false);
        this.clearBtn = this.add.image(1016, 1080, 'btn_clear').setOrigin(0, 1).setScale(0.3).setInteractive({ cursor: 'pointer' });
        this.clearBtnPressed = this.add.image(1016, 1080, 'btn_clear_pressed').setOrigin(0, 1).setScale(0.3).setVisible(false);

        this.electricBtn = this.add.image(1068, 940, 'electricbutton').setOrigin(0, 1).setScale(0.08).setInteractive({ cursor: 'pointer' });
        this.electricBtnPressed = this.add.image(1068, 940, 'btn_electric_pressed').setOrigin(0, 1).setScale(0.08).setVisible(false);

        this.initialHeatBtn = this.add.image(950, 940, 'btn_initialheat').setOrigin(0, 1).setScale(0.08).setInteractive({ cursor: 'pointer' });
        this.initialHeatBtnPressed = this.add.image(950, 940, 'btn_initialheat_pressed').setOrigin(0, 1).setScale(0.08).setVisible(false);

        this.highHeatBtn = this.add.image(1008, 940, 'btn_highheat').setOrigin(0, 1).setScale(0.08).setInteractive({ cursor: 'pointer' });
        this.highHeatBtnPressed = this.add.image(1008, 940, 'btn_highheat_pressed').setOrigin(0, 1).setScale(0.08).setVisible(false);

        const beaker = this.children.getByName('beaker');
        this.tweens.add({
            targets: [beaker, this.combineBtn, this.combineBtnPressed, this.clearBtn, this.clearBtnPressed, this.electricBtn, this.electricBtnPressed, this.initialHeatBtn, this.initialHeatBtnPressed, this.highHeatBtn, this.highHeatBtnPressed],
            y: '-=100',
            duration: 400,
            ease: 'Power2'
        });

        this.scientist = this.add.image(1400, 1000, 'default').setOrigin(0, 1).setScale(0.5);

        this.buttonPressed = false;
        this.clearButtonPressed = false;
        this.electricButtonPressed = false;
        this.initialHeatButtonPressed = false;
        this.highHeatButtonPressed = false;
        this.activeEnergySource = null;
        this.activeEnergySource = null;

        // Generate Compound Slots - RESTORED ORIGINAL LAYOUT + NEW ROW
        // Row 1: 2 items (Right side)
        // Row 2: 5 items (Full width)
        // Row 3: 5 items (New request)
        this.compoundSlots = [
            { x: 415, y: 660 }, { x: 515, y: 660 }, // Original Row 1
            { x: 115, y: 790 }, { x: 215, y: 790 }, { x: 315, y: 790 }, { x: 415, y: 790 }, { x: 515, y: 790 }, // Original Row 2
            { x: 115, y: 910 }, { x: 215, y: 910 }, { x: 315, y: 910 }, { x: 415, y: 910 }, { x: 515, y: 910 }  // New Row 3
        ];

        this.inventoryPage = 0;
        this.itemsPerPage = this.compoundSlots.length;

        this.nextSlotIndex = 0;
        this.createdCompounds = [];
        this.wrongAttempts = 0;

        // Pagination Buttons - Positioned around the grid
        this.pageLeftBtn = this.add.text(50, 850, 'â—€', {
            fontSize: '48px', fill: '#ffffff'
        }).setOrigin(0.5).setInteractive({ cursor: 'pointer' }).setVisible(false);

        this.pageRightBtn = this.add.text(600, 850, 'â–¶', {
            fontSize: '48px', fill: '#ffffff'
        }).setOrigin(0.5).setInteractive({ cursor: 'pointer' }).setVisible(false);

        this.pageLeftBtn.on('pointerdown', () => {
            if (this.inventoryPage > 0) {
                this.inventoryPage--;
                this.renderInventory();
            }
        });

        this.pageRightBtn.on('pointerdown', () => {
            const total = compoundInventory.getCreatedCompounds().length;
            if ((this.inventoryPage + 1) * this.itemsPerPage < total) {
                this.inventoryPage++;
                this.renderInventory();
            }
        });

        // Load existing compounds using pagination render
        this.renderInventory();

        const elementPositions = [
            { name: 'hydrogen', x: 70, y: 430, scale: 0.3, originX: 0, originY: 1 },
            { name: 'carbon', x: 170, y: 430, scale: 0.3, originX: 0, originY: 1 },
            { name: 'nitrogen', x: 270, y: 430, scale: 0.3, originX: 0, originY: 1 },
            { name: 'oxygen', x: 370, y: 430, scale: 0.3, originX: 0, originY: 1 },
            { name: 'sodium', x: 470, y: 430, scale: 0.3, originX: 0, originY: 1 },
            { name: 'magnesium', x: 70, y: 567, scale: 0.3, originX: 0, originY: 1 },
            { name: 'sulfur', x: 170, y: 567, scale: 0.3, originX: 0, originY: 1 },
            { name: 'chlorine', x: 270, y: 567, scale: 0.3, originX: 0, originY: 1 },
            { name: 'calcium', x: 370, y: 567, scale: 0.3, originX: 0, originY: 1 },
            { name: 'iron', x: 470, y: 567, scale: 0.3, originX: 0, originY: 1 },
            { name: 'copper', x: 70, y: 702, scale: 0.3, originX: 0, originY: 1 },
            { name: 'zinc', x: 170, y: 702, scale: 0.3, originX: 0, originY: 1 },
            { name: 'silver', x: 270, y: 702, scale: 0.3, originX: 0, originY: 1 },
        ];

        elementPositions.forEach(element => {
            const img = this.add.image(element.x, element.y, element.name).setOrigin(element.originX, element.originY).setScale(element.scale).setInteractive().setDepth(2);
            img.originalX = element.x;
            img.originalY = element.y;
            img.isElement = true;
            this.input.setDraggable(img);
        });

        // Increased drop zone size for better usability
        this.dropZone = this.add.zone(1070, 685, 300, 250).setRectangleDropZone(300, 250);
        this.elementsInZone = [];

        this.setupDragAndDrop();
        this.setupButtons();
        this.createBubbles();

        this.prevStageBtn = this.add.image(1500, 950, 'previousstagebutton').setOrigin(1, 1).setScale(0.2).setInteractive({ cursor: 'pointer' });

        this.prevStageBtn.on('pointerdown', () => {
            this.tweens.add({
                targets: this.prevStageBtn,
                scaleX: 0.18,
                scaleY: 0.18,
                duration: 100,
                yoyo: true,
                onComplete: () => this.scene.start('Start')
            });
        });

        // =========================================
        // RIGHT SIDE TOOLBAR (Vertical Stack)
        // =========================================
        // =========================================
        // RIGHT SIDE TOOLBAR (Vertical Stack)
        // =========================================
        const toolX = 1880; // Right margin anchor
        const toolGap = 85; // Vertical spacing
        let currentToolY = 50;

        const buttonStyle = {
            fontSize: '22px',
            fill: '#ffffff',
            fontFamily: 'Verdana',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3,
            padding: { x: 30, y: 15 }, // Extra spacing as requested
            shadow: { offsetX: 2, offsetY: 2, color: '#000000', blur: 4, stroke: true, fill: true }
        };

        // 1. JOURNAL (Top)
        // Load history from localStorage or create new array
        const savedHistory = localStorage.getItem('chemicalSimHistory');
        this.history = savedHistory ? JSON.parse(savedHistory) : [];
        this.historyPanelOpen = false;

        this.historyBtn = this.add.text(toolX, currentToolY, '📜 JOURNAL', {
            ...buttonStyle,
            backgroundColor: '#2980b9'
        })
            .setOrigin(1, 0)
            .setInteractive({ cursor: 'pointer' })
            .setDepth(100);

        // Journal Hover Logic
        this.historyBtn.on('pointerover', () => {
            this.historyBtn.setScale(1.05);
            this.historyBtn.setShadow(0, 0, '#2980b9', 20, true, true);
        });
        this.historyBtn.on('pointerout', () => {
            this.historyBtn.setScale(1);
            this.historyBtn.setShadow(2, 2, '#000000', 4, true, true);
        });
        this.historyBtn.on('pointerdown', () => this.toggleHistory());

        currentToolY += toolGap;

        // 2. TUTORIAL (Middle)
        const tutorialBtn = this.add.text(toolX, currentToolY, '📖 TUTORIAL', {
            ...buttonStyle,
            backgroundColor: '#8e44ad'
        })
            .setOrigin(1, 0)
            .setInteractive({ cursor: 'pointer' })
            .setDepth(100);

        tutorialBtn.on('pointerover', () => {
            tutorialBtn.setScale(1.05);
            tutorialBtn.setShadow(0, 0, '#8e44ad', 20, true, true);
        });
        tutorialBtn.on('pointerout', () => {
            tutorialBtn.setScale(1);
            tutorialBtn.setShadow(2, 2, '#000000', 4, true, true);
        });
        tutorialBtn.on('pointerdown', () => this.scene.start('Tutorial', { from: 'Stage2' }));

        currentToolY += toolGap;

        // 3. RECIPES / ? (Bottom)
        const helpBtn = this.add.text(toolX, currentToolY, '⚡ RECIPES', {
            ...buttonStyle,
            backgroundColor: '#27ae60'
        })
            .setOrigin(1, 0)
            .setInteractive({ cursor: 'pointer' })
            .setDepth(100);

        helpBtn.on('pointerover', () => {
            helpBtn.setScale(1.05);
            helpBtn.setShadow(0, 0, '#27ae60', 20, true, true);
        });
        helpBtn.on('pointerout', () => {
            helpBtn.setScale(1);
            helpBtn.setShadow(2, 2, '#000000', 4, true, true);
        });
        helpBtn.on('pointerdown', () => this.toggleCheatSheet());

        // Create the Cheat Sheet Container
        this.createCheatSheet();
    }

    createCheatSheet() {
        // SENIOR UX REDESIGN: Structured, Left-Aligned, Clean Hierarchy
        this.cheatSheet = this.add.container(928, 522).setVisible(false).setDepth(5000);

        // 1. Background (Dark, Glass-like)
        const bg = this.add.rectangle(0, 0, 1200, 850, 0x121212, 0.98)
            .setStrokeStyle(3, 0x2ecc71); // Clean green border

        // 2. Header Section
        const title = this.add.text(0, -350, '🧪 SYNTHESIS GUIDE', {
            fontSize: '42px',
            fill: '#2ecc71',
            fontFamily: 'Verdana, sans-serif',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const subTitle = this.add.text(0, -300, 'Combine these elements to create compounds:', {
            fontSize: '20px',
            fill: '#aaaaaa',
            fontFamily: 'Verdana, sans-serif'
        }).setOrigin(0.5);

        const closeText = this.add.text(0, 380, '(Click anywhere to close)', {
            fontSize: '18px', fill: '#666666', fontFamily: 'Verdana'
        }).setOrigin(0.5);

        // 3. Structured Data List
        const recipeList = [
            { name: "WATER (H₂O)", ingredients: "Hydrogen + Hydrogen + Oxygen" },
            { name: "SALT (NaCl)", ingredients: "Sodium + Chlorine" },
            { name: "METHANE (CH₄)", ingredients: "Carbon + 4 Hydrogen" },
            { name: "CARBON DIOXIDE (CO₂)", ingredients: "Carbon + 2 Oxygen" },
            { name: "CALCIUM CARBONATE", ingredients: "Calcium + Carbon + 3 Oxygen" },
            { name: "SILVER NITRATE", ingredients: "Silver + Nitrogen + 3 Oxygen" }
        ];

        // 4. Render List items
        const startY = -220;
        const rowHeight = 90; // Fixed height per row
        const textGroup = [];

        recipeList.forEach((item, index) => {
            const yPos = startY + (index * rowHeight);

            // A. Icon / Bullet
            const bullet = this.add.circle(-400, yPos, 6, 0x2ecc71);

            // B. Product Name (Left Aligned, Prominent)
            const nameText = this.add.text(-380, yPos - 15, item.name, {
                fontSize: '26px',
                fill: '#ffffff',
                fontFamily: 'Verdana, sans-serif',
                fontStyle: 'bold'
            }).setOrigin(0, 0.5);

            // C. Ingredients (Left Aligned, Subtle)
            const ingText = this.add.text(-380, yPos + 18, item.ingredients, {
                fontSize: '20px',
                fill: '#bbbbbb', // Light grey for contrast
                fontFamily: 'Verdana, sans-serif'
            }).setOrigin(0, 0.5);

            // D. Separator Line (Subtle)
            const line = this.add.rectangle(0, yPos + 45, 900, 1, 0x333333).setOrigin(0.5);

            textGroup.push(bullet, nameText, ingText, line);
        });

        // 5. Footer Note (Encouraging experimentation)
        const footerNote = this.add.text(0, 320, '* These are just examples. Experiment to discover new reactions!', {
            fontSize: '18px',
            fill: '#888888',
            fontFamily: 'Verdana, sans-serif',
            fontStyle: 'italic'
        }).setOrigin(0.5);

        this.cheatSheet.add([bg, title, subTitle, closeText, footerNote, ...textGroup]);

        // Close Interaction
        bg.setInteractive({ cursor: 'pointer' }).on('pointerdown', () => this.toggleCheatSheet());
    }

    toggleCheatSheet() {
        this.cheatSheet.setVisible(!this.cheatSheet.visible);
    }

    setupDragAndDrop() {
        this.input.on('dragstart', (pointer, gameObject) => {
            gameObject.setDepth(5000); // SUPER TOP PRIORITY
            gameObject.setAlpha(0.7); // Semi-transparent during drag
            if (gameObject.labelText) {
                gameObject.labelText.setAlpha(0.7);
            }
        });

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
            if (gameObject.labelText) {
                gameObject.labelText.x = dragX;
                gameObject.labelText.y = dragY + 50;
            }
        });

        this.input.on('drop', (pointer, gameObject, dropZone) => {
            // Position items within the beaker bounds - Expanded range to fix cramping
            const beakerCenterX = 1070;
            const beakerCenterY = 685;
            // Widen the spread (was -40,40)
            const offsetX = Phaser.Math.Between(-80, 80);
            // Slightly more vertical spread (was -30,30)
            const offsetY = Phaser.Math.Between(-40, 50);

            const copy = this.add.image(beakerCenterX + offsetX, beakerCenterY + offsetY, gameObject.texture.key)
                .setOrigin(0.5, 0.5)
                .setScale(0.12)
                .setData('textureKey', gameObject.texture.key);
            this.elementsInZone.push(copy);
            copy.inDropZone = true;

            this.tweens.add({
                targets: gameObject,
                x: gameObject.originalX,
                y: gameObject.originalY,
                duration: 300,
                ease: 'Power2',
                onComplete: () => {
                    gameObject.setDepth(2); // Reset depth after tween back
                    gameObject.setAlpha(1); // Restore full opacity
                    if (gameObject.labelText) {
                        gameObject.labelText.setAlpha(1);
                    }
                }
            });

            copy.floatTween = this.tweens.add({
                targets: copy,
                y: copy.y - 15,
                duration: 2000,
                ease: 'Sine.easeInOut',
                yoyo: true,
                repeat: -1
            });

            // Check and show hint after element is dropped
            this.checkAndShowHint();
        });

        this.input.on('dragend', (pointer, gameObject) => {
            // If dropped in zone, 'drop' logic handles it. If not, reset here.
            if (!gameObject.inDropZone) {
                this.tweens.add({
                    targets: gameObject,
                    x: gameObject.originalX,
                    y: gameObject.originalY,
                    duration: 300,
                    ease: 'Power2',
                    onComplete: () => {
                        gameObject.setDepth(2); // Reset depth
                        gameObject.setAlpha(1); // Restore full opacity
                        if (gameObject.labelText) {
                            gameObject.labelText.setAlpha(1);
                        }
                    }
                });
                if (gameObject.labelText) {
                    this.tweens.add({
                        targets: gameObject.labelText,
                        x: gameObject.originalX,
                        y: gameObject.originalY + 50,
                        duration: 300,
                        ease: 'Power2'
                    });
                }
            } else {
                // Was dropped successfully, reset flag and depth
                gameObject.inDropZone = false;
                gameObject.setDepth(2);
                gameObject.setAlpha(1); // Restore full opacity
                if (gameObject.labelText) {
                    gameObject.labelText.setAlpha(1);
                }
            }
        });
    }

    setupButtons() {
        this.combineBtn.on('pointerdown', () => {
            if (this.buttonPressed) return;

            this.buttonPressed = true;
            this.combineBtn.setVisible(false);
            this.combineBtnPressed.setVisible(true);
            this.combineBtn.disableInteractive();

            const elementsInZone = this.elementsInZone.map(element => element.texture.key);

            // Find matching reaction
            const reaction = this.reactionSystem.findReaction(elementsInZone, this.activeEnergySource);

            if (!reaction && elementsInZone.length > 0) {
                // No valid reaction found
                this.wrongAttempts++;
                if (this.wrongAttempts >= 3) {
                    this.showClosestHint(elementsInZone);
                    this.wrongAttempts = 0;
                } else {
                    this.showWrongFormulaMessage();
                }
                this.time.delayedCall(2000, () => {
                    this.combineBtn.setVisible(true);
                    this.combineBtnPressed.setVisible(false);
                    this.combineBtn.setInteractive();
                    this.buttonPressed = false;
                });
                return;
            }

            if (reaction) {
                // Check if energy requirement is met
                const requiredEnergy = this.reactionSystem.getRequiredEnergy(reaction);
                if (requiredEnergy && this.activeEnergySource !== requiredEnergy) {
                    this.showEnergyRequiredMessage(requiredEnergy);
                    this.time.delayedCall(2000, () => {
                        this.combineBtn.setVisible(true);
                        this.combineBtnPressed.setVisible(false);
                        this.combineBtn.setInteractive();
                        this.buttonPressed = false;
                    });
                    return;
                }

                // Get products
                const products = this.reactionSystem.getProducts(reaction);

                console.log('Reaction found:', reaction.equation);
                console.log('Products:', products.map(p => p.name));

                // Show reaction result with balanced equation
                this.wrongAttempts = 0;
                this.showReactionResult(reaction);
            }

            this.time.delayedCall(2000, () => {
                this.combineBtn.setVisible(true);
                this.combineBtnPressed.setVisible(false);
                this.combineBtn.setInteractive();
                this.buttonPressed = false;
            });
        });

        this.clearBtn.on('pointerdown', () => {
            if (this.clearButtonPressed) return;

            this.clearButtonPressed = true;
            this.clearBtn.setVisible(false);
            this.clearBtnPressed.setVisible(true);
            this.clearBtn.disableInteractive();

            this.hideAllAnimations();
            this.activeEnergySource = null;

            this.elementsInZone.forEach(element => {
                if (element.floatTween) element.floatTween.destroy();
                element.destroy();
            });
            this.elementsInZone = [];

            this.time.delayedCall(2000, () => {
                this.clearBtn.setVisible(true);
                this.clearBtnPressed.setVisible(false);
                this.clearBtn.setInteractive();
                this.clearButtonPressed = false;
            });
        });

        this.initialHeatBtn.on('pointerdown', () => {
            if (this.initialHeatButtonPressed) return;

            this.initialHeatButtonPressed = true;
            this.initialHeatBtn.setVisible(false);
            this.initialHeatBtnPressed.setVisible(true);
            this.initialHeatBtn.disableInteractive();

            this.hideAllAnimations();
            this.activeEnergySource = 'initial_heat';
            this.showLowHeatEffect();

            this.time.delayedCall(2000, () => {
                this.initialHeatBtn.setVisible(true);
                this.initialHeatBtnPressed.setVisible(false);
                this.initialHeatBtn.setInteractive();
                this.initialHeatButtonPressed = false;
            });
        });

        this.electricBtn.on('pointerdown', () => {
            if (this.electricButtonPressed) return;

            this.electricButtonPressed = true;
            this.electricBtn.setVisible(false);
            this.electricBtnPressed.setVisible(true);
            this.electricBtn.disableInteractive();

            this.hideAllAnimations();
            this.activeEnergySource = 'electricity';
            this.showElectricEffect();

            this.time.delayedCall(2000, () => {
                this.electricBtn.setVisible(true);
                this.electricBtnPressed.setVisible(false);
                this.electricBtn.setInteractive();
                this.electricButtonPressed = false;
            });
        });

        this.highHeatBtn.on('pointerdown', () => {
            if (this.highHeatButtonPressed) return;

            this.highHeatButtonPressed = true;
            this.highHeatBtn.setVisible(false);
            this.highHeatBtnPressed.setVisible(true);
            this.highHeatBtn.disableInteractive();

            this.hideAllAnimations();
            this.activeEnergySource = 'high_heat';
            this.showHighHeatEffect();

            this.time.delayedCall(2000, () => {
                this.highHeatBtn.setVisible(true);
                this.highHeatBtnPressed.setVisible(false);
                this.highHeatBtn.setInteractive();
                this.highHeatButtonPressed = false;
            });
        });
    }

    hideAllAnimations() {
        if (this.heatEffects) {
            this.heatEffects.forEach(effect => effect.destroy());
            this.heatEffects = [];
        }
        if (this.electricEffects) {
            this.electricEffects.forEach(effect => effect.destroy());
            this.electricEffects = [];
        }
    }

    showLowHeatEffect() {
        this.heatEffects = [];
        const beakerX = 1070;
        const beakerY = 685;

        for (let i = 0; i < 3; i++) {
            const x = beakerX + Phaser.Math.Between(-80, 80);
            const y = beakerY + Phaser.Math.Between(-80, 80);

            const flame = this.add.graphics();
            flame.fillStyle(0xff8844, 0.7);
            flame.fillTriangle(0, 18, -6, 0, 6, 0);
            flame.fillTriangle(-3, 12, -9, -3, 3, -3);
            flame.fillTriangle(3, 12, -3, -3, 9, -3);
            flame.fillCircle(0, 6, 5);
            flame.x = x;
            flame.y = y + 20;

            this.heatEffects.push(flame);

            this.tweens.add({
                targets: flame,
                y: y - 100,
                alpha: 0,
                scaleX: 1.5,
                scaleY: 1.5,
                duration: 3500,
                delay: i * 400,
                repeat: -1,
                ease: 'Power2'
            });
        }
    }

    showHighHeatEffect() {
        this.heatEffects = [];
        const beakerX = 1070;
        const beakerY = 685;

        for (let i = 0; i < 8; i++) {
            const x = beakerX + Phaser.Math.Between(-70, 70);
            const y = beakerY + Phaser.Math.Between(-70, 70);

            const flame = this.add.graphics();
            flame.fillStyle(0xff4444, 0.8);
            flame.fillTriangle(0, 25, -8, 2, 8, 2);
            flame.fillTriangle(-4, 18, -12, -2, 4, -2);
            flame.fillTriangle(4, 18, -4, -2, 12, -2);
            flame.fillTriangle(0, 10, -6, -8, 6, -8);
            flame.fillCircle(0, 8, 7);
            flame.x = x;
            flame.y = y + 10;

            this.heatEffects.push(flame);

            this.tweens.add({
                targets: flame,
                y: y - 120,
                alpha: 0,
                scaleX: 2,
                scaleY: 2,
                duration: 1500,
                delay: i * 150,
                repeat: -1,
                ease: 'Power2'
            });
        }
    }

    showElectricEffect() {
        this.electricEffects = [];
        const beakerX = 1070;
        const beakerY = 685;

        for (let i = 0; i < 6; i++) {
            const x = beakerX + Phaser.Math.Between(-60, 60);
            const y = beakerY + Phaser.Math.Between(-60, 60);

            const lightning = this.add.graphics();
            lightning.lineStyle(3, 0xffff44, 0.9);
            lightning.lineBetween(0, 0, -4, -8);
            lightning.lineBetween(-4, -8, 6, -16);
            lightning.lineBetween(6, -16, 0, -24);
            lightning.lineBetween(0, -24, 8, -32);
            lightning.x = x;
            lightning.y = y + 30;

            this.electricEffects.push(lightning);

            this.tweens.add({
                targets: lightning,
                y: y - 80,
                alpha: 0,
                scaleX: 1.8,
                scaleY: 1.8,
                duration: 1200,
                delay: i * 100,
                repeat: -1,
                ease: 'Power2'
            });
        }
    }

    addCompoundToInventory(compound) {
        compoundInventory.addCompound(compound.name);
        this.showCongratsScreen(compound);
        // Refresh entire inventory to handle pagination/sorting
        this.renderInventory();
    }

    // New method to render full inventory page
    renderInventory() {
        this.clearInventoryUI();

        const allCompounds = compoundInventory.getCreatedCompounds();
        // Sort if needed? No, chronological is fine.

        const start = this.inventoryPage * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        const pageItems = allCompounds.slice(start, end);

        this.nextSlotIndex = 0;

        pageItems.forEach(compoundName => {
            const compound = compounds.find(c => c.name === compoundName);
            if (compound) {
                this.displayCompoundInInventory(compound);
            }
        });

        this.updatePaginationButtons(allCompounds.length);
    }

    clearInventoryUI() {
        this.createdCompounds.forEach(item => {
            if (item.labelText) item.labelText.destroy();
            item.destroy();
        });
        this.createdCompounds = [];
    }

    updatePaginationButtons(totalCount) {
        this.pageLeftBtn.setVisible(this.inventoryPage > 0);
        this.pageRightBtn.setVisible((this.inventoryPage + 1) * this.itemsPerPage < totalCount);
    }

    loadExistingCompounds() {
        // Deprecated, use renderInventory()
        this.renderInventory();
    }

    displayCompoundInInventory(compound) {
        let x, y, scale;

        if (compound.name === 'Methane') {
            x = 620;
            y = 800;
            scale = 0.5;
        } else {
            if (this.nextSlotIndex >= this.compoundSlots.length) return;
            const slot = this.compoundSlots[this.nextSlotIndex];
            x = slot.x;
            y = slot.y;
            scale = compound.scale;
            this.nextSlotIndex++;
        }

        const compoundImg = this.add.image(x, y, compound.textureKey)
            .setOrigin(0.5, 0.5)
            .setScale(scale)
            .setInteractive();

        const words = compound.name.split(' ');
        let displayText = compound.name;
        if (words.length === 2) {
            displayText = words[0] + '\n' + words[1];
        }

        const compoundText = this.add.text(x, y + 50, displayText, {
            fontSize: '18px', // Larger
            fill: '#ffffff',
            fontFamily: 'Verdana', // Strict
            fontStyle: 'bold',     // Bold
            stroke: '#000000',
            strokeThickness: 5,    // Thicker
            align: 'center'
        }).setOrigin(0.5, 0);

        if (compound.name === 'Methane') {
            compoundImg.setDepth(0);
            compoundText.setDepth(0);
        } else {
            compoundImg.setDepth(2);
            compoundText.setDepth(2);
        }

        compoundImg.originalX = x;
        compoundImg.originalY = y;
        compoundImg.isElement = false;
        compoundImg.labelText = compoundText;
        this.input.setDraggable(compoundImg);

        this.createdCompounds.push(compoundImg);
    }

    showClosestHint(elementsInZone) {
        this.input.enabled = false;
        this.scientist.setTexture('hint');

        const elementCounts = {};
        elementsInZone.forEach(element => {
            elementCounts[element] = (elementCounts[element] || 0) + 1;
        });

        let bestMatch = null;
        let bestScore = 0;

        compounds.forEach(compound => {
            if (!compoundInventory.hasCompound(compound.name)) {
                let score = 0;
                for (let [element, count] of compound.property) {
                    const elementName = element.name.toLowerCase();
                    if (elementCounts[elementName]) {
                        score += Math.min(elementCounts[elementName], count);
                    }
                }
                if (score > bestScore) {
                    bestScore = score;
                    bestMatch = compound;
                }
            }
        });

        const hintCompound = bestMatch || compounds.find(c => !compoundInventory.hasCompound(c.name));
        // Position hint near scientist (speech bubble) - leveled with face at Y=380
        const hintImg = this.add.image(1350, 380, hintCompound.textureKey + '_hint')
            .setOrigin(0.5)
            .setScale(0.5)
            .setDepth(1001);

        this.time.delayedCall(4000, () => {
            hintImg.destroy();
            this.scientist.setTexture('default');
            this.input.enabled = true;
            this.clearDropZone();
        });
    }

    showWrongFormulaMessage() {
        this.input.enabled = false;
        this.scientist.setTexture('shock');

        const wrongFormulaImg = this.add.image(1200, 300, 'wrong_formula')
            .setOrigin(0.5)
            .setScale(0.7)
            .setDepth(1001);

        this.time.delayedCall(4000, () => {
            wrongFormulaImg.destroy();
            this.scientist.setTexture('default');
            this.input.enabled = true;
            this.clearDropZone();
        });
    }

    showAlreadyFormulatedMessage() {
        this.input.enabled = false;
        this.scientist.setTexture('shock');

        const alreadyFormulatedImg = this.add.image(1200, 300, 'already_formulated')
            .setOrigin(0.5)
            .setScale(0.7)
            .setDepth(1001);

        this.time.delayedCall(4000, () => {
            alreadyFormulatedImg.destroy();
            this.scientist.setTexture('default');
            this.input.enabled = true;
            this.clearDropZone();
        });
    }

    showCongratsScreen(compound) {
        this.input.enabled = false;
        this.scientist.setTexture('excited');

        this.bubbleTimer.paused = true;
        this.bubbles.forEach(bubble => {
            this.tweens.killTweensOf(bubble);
        });

        const congratsBg = this.add.image(928, 522, 'congrats_bg')
            .setOrigin(0.5, 0.5)
            .setDisplaySize(2500, 2500)
            .setAlpha(0.5)
            .setDepth(1000);

        this.tweens.add({
            targets: congratsBg,
            rotation: Math.PI * 2,
            duration: 10000,
            ease: 'Linear',
            repeat: -1
        });

        const newCompoundText = this.add.image(928, 50, 'newCompoundText')
            .setScale(1.5)
            .setOrigin(0.5)
            .setDepth(1001);

        const congratsCompound = this.add.image(928, 500, compound.textureKey)
            .setScale(0.5)
            .setDepth(1001);

        const imageHeight = congratsCompound.displayHeight;
        const congratsText = this.add.text(928, congratsCompound.y + (imageHeight / 2) + 30, compound.name, {
            fontSize: '48px',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 4,
            align: 'center'
        }).setOrigin(0.5).setDepth(1001);

        this.time.delayedCall(3000, () => {
            congratsBg.destroy();
            newCompoundText.destroy();
            congratsCompound.destroy();
            congratsText.destroy();
            this.scientist.setTexture('default');
            this.bubbleTimer.paused = false;
            this.input.enabled = true;
            this.clearDropZone();
        });

        congratsBg.setInteractive().on('pointerdown', () => {
            congratsBg.destroy();
            newCompoundText.destroy();
            congratsCompound.destroy();
            congratsText.destroy();
            this.scientist.setTexture('default');
            this.bubbleTimer.paused = false;
            this.input.enabled = true;
            this.clearDropZone();
        });
    }

    clearDropZone() {
        this.elementsInZone.forEach(element => {
            if (element.floatTween) element.floatTween.destroy();
            element.destroy();
        });
        this.elementsInZone = [];
        this.hideHint(); // Hide hint when beaker is cleared
    }

    checkAndShowHint() {
        // Get current elements in beaker
        const elementsInBeaker = this.elementsInZone.map(el => el.getData('textureKey'));

        console.log('=== HINT CHECK ===');
        console.log('Elements in beaker:', elementsInBeaker);
        console.log('Count:', elementsInBeaker.length);
        console.log('Active energy source:', this.activeEnergySource);

        // Only show hints if exactly 1 element/compound is in beaker
        if (elementsInBeaker.length !== 1) {
            this.hideHint();
            return;
        }

        const singleElement = elementsInBeaker[0];
        console.log('Single element:', singleElement);

        // Special Override: Completely suppress hint for Chlorine (Cl)
        // This matches Stage 1 behavior where Cl drag is silent.
        if (singleElement === 'chlorine') {
            this.hideHint();
            return;
        }

        // Find reactions that could use this element
        for (const reaction of this.reactionSystem.reactions) {
            if (!reaction.hint) continue;

            // Check if this element is one of the reactants
            const symbols = this.reactionSystem.getSymbolsFromKeys([singleElement]);
            const normalizedSymbol = symbols[0];

            console.log('Checking reaction:', reaction.equation);
            console.log('Normalized symbol:', normalizedSymbol);
            console.log('Reaction energy source:', reaction.energy_source);

            // Check if this symbol is in the reaction's reactants
            const reactionSymbols = reaction.reactants.map(r => this.reactionSystem.normalizeSymbol(r));
            console.log('Reaction symbols:', reactionSymbols);

            if (reactionSymbols.includes(normalizedSymbol)) {
                // Found a matching reaction

                // Check if this reaction requires energy but energy is NOT applied
                const requiresEnergy = reaction.energy_source !== null && reaction.energy_source !== undefined;
                const energyApplied = this.activeEnergySource !== null;

                console.log('Requires energy:', requiresEnergy);
                console.log('Energy applied:', energyApplied);

                // Show hint only if:
                // 1. Reaction requires energy AND energy is NOT applied yet
                // OR
                // 2. Reaction doesn't require energy (normal synthesis)
                if (requiresEnergy && !energyApplied) {
                    // Show hint for missing energy
                    console.log('MATCH! Showing hint (missing energy):', reaction.hint);
                    this.showHint(singleElement, reaction);
                    return;
                } else if (!requiresEnergy) {
                    // Show hint for normal reactions (missing second reactant)
                    console.log('MATCH! Showing hint (missing reactant):', reaction.hint);
                    this.showHint(singleElement, reaction);
                    return;
                }
            }
        }

        // No hint found, hide any existing hint
        console.log('No hint found for:', singleElement);
        this.hideHint();
    }

    showHint(elementKey, reaction) {
        // Hide existing hint first
        this.hideHint();

        // Map reaction equations to hint image names
        // ONLY include reactions that have actual hint images in assets/speech/hint/
        const hintImageMap = {
            // Based on actual hint image filenames:
            // agno3hcl.png, agno3nacl.png, caco4heat.png, calciumCarbonate.png,
            // cao2.png, ch4o2.png, copperSulfate.png, h2oelectric.png,
            // hclnaoh.png, hydrochloricAcid.png, methane.png, mgcl2.png,
            // mgcuso4.png, mghcl.png, mgo2flame.png, silverNitrate.png,
            // sodiumChloride.png, sodiumHydroxide.png, water.png,
            // zncuso4.png, znhcl.png

            '2Mg + O2 â†’ 2MgO': 'mgo2flame',
            'Mg + Cl2 â†’ MgCl2': 'mgcl2',
            '2Ca + O2 â†’ 2CaO': 'cao2',
            'CH4 + 2O2 â†’ CO2 + 2H2O': 'ch4o2',
            '2H2O â†’ 2H2 + O2': 'h2oelectric',
            'CaCO3 â†’ CaO + CO2': 'caco3heat',
            '2NaCl â†’ 2Na + Cl2': 'sodiumChloride_hint',
            'Zn + 2HCl â†’ ZnCl2 + H2': 'znhcl',
            'Mg + 2HCl â†’ MgCl2 + H2': 'mghcl',
            'Fe + CuSO4 â†’ FeSO4 + Cu': 'fecuso4',
            'Zn + CuSO4 â†’ ZnSO4 + Cu': 'zncuso4',
            'AgNO3 + NaCl â†’ AgCl(s) + NaNO3': 'agno3nacl',
            'AgNO3 + HCl â†’ AgCl(s) + HNO3': 'agno3hcl',
            'HCl + NaOH â†’ NaCl + H2O': 'hclnaoh',
            'CH4 + 2O2 â†’ CO2 + 2H2O': 'ch4o2_hint'
        };

        const hintImageName = hintImageMap[reaction.equation];

        if (!hintImageName) {
            console.log('No hint image for this reaction:', reaction.equation);
            return; // Don't show hint if no image exists
        }

        // Special override: User requested NO hint for Chlorine
        if (reaction.equation.includes('2Na + Cl2')) {
            return;
        }

        // Display hint image near scientist like a speech bubble - leveled with face at Y=380
        this.currentHintImage = this.add.image(1350, 380, hintImageName)
            .setOrigin(0.5)
            .setScale(0.5)  // Slightly larger for speech bubble effect
            .setDepth(1001)
            .setAlpha(0);

        // Fade in animation
        this.tweens.add({
            targets: this.currentHintImage,
            alpha: 1,
            duration: 300
        });

        console.log(`Showing hint for ${elementKey} (${reaction.equation}): ${reaction.hint}`);
    }

    hideHint() {
        if (this.currentHintImage) {
            this.currentHintImage.destroy();
            this.currentHintImage = null;
        }
        if (this.currentHintText) {
            this.currentHintText.destroy();
            this.currentHintText = null;
        }
    }


    playReactionEffect(reaction, callback) {
        this.input.enabled = false;

        const animKey = reaction.animation_key;
        // Use the correct beaker position (where elements float)
        const beakerX = 1760;
        const beakerY = 580;

        console.log('Playing visual effect:', animKey);

        // Different effects based on animation key
        if (animKey === 'bubble' || animKey === 'rapidBubble' || animKey === 'electricityHigh') {
            // Bubble effect
            const bubbleCount = animKey === 'rapidBubble' ? 20 : 10;

            for (let i = 0; i < bubbleCount; i++) {
                this.time.delayedCall(i * 100, () => {
                    const bubble = this.add.circle(
                        beakerX + Phaser.Math.Between(-50, 50),
                        beakerY + Phaser.Math.Between(0, 100),
                        Phaser.Math.Between(5, 15),
                        0xFFFFFF,
                        0.7
                    ).setDepth(100);

                    this.tweens.add({
                        targets: bubble,
                        y: beakerY - 200,
                        alpha: 0,
                        duration: 1500,
                        onComplete: () => bubble.destroy()
                    });
                });
            }

            this.time.delayedCall(2500, callback);

        } else if (animKey === 'initialHeat' || animKey === 'brightFlame' || animKey === 'blueFlame') {
            // Flash/Flame effect
            const isBlue = animKey === 'blueFlame';
            const flameColor = isBlue ? 0x0088FF : 0xFFAA00; // Blue or Orange

            const flash = this.add.rectangle(beakerX, beakerY, 200, 200, 0xFFFFFF, 1)
                .setDepth(100);

            this.tweens.add({
                targets: flash,
                alpha: 0,
                scale: 2,
                duration: 800, // Faster (was 1000)
                onComplete: () => flash.destroy()
            });

            // Add flame particles
            for (let i = 0; i < 15; i++) {
                this.time.delayedCall(i * 50, () => {
                    const flame = this.add.circle(
                        beakerX + Phaser.Math.Between(-30, 30),
                        beakerY + Phaser.Math.Between(-20, 20),
                        Phaser.Math.Between(8, 20),
                        flameColor,
                        0.8
                    ).setDepth(100);

                    this.tweens.add({
                        targets: flame,
                        y: beakerY - 150,
                        alpha: 0,
                        duration: 600, // Faster (was 800)
                        onComplete: () => flame.destroy()
                    });
                });
            }

            this.time.delayedCall(1200, callback); // Faster (was 2000)

        } else if (animKey === 'highHeat') {
            // High heat with gas release

            const heat = this.add.rectangle(beakerX, beakerY, 150, 150, 0xFF4400, 0.6)
                .setDepth(100);

            this.tweens.add({
                targets: heat,
                alpha: 0,
                scale: 1.5,
                duration: 1500,
                onComplete: () => heat.destroy()
            });

            // Gas bubbles
            for (let i = 0; i < 12; i++) {
                this.time.delayedCall(i * 120, () => {
                    const gas = this.add.circle(
                        beakerX + Phaser.Math.Between(-40, 40),
                        beakerY + Phaser.Math.Between(0, 80),
                        Phaser.Math.Between(10, 20),
                        0xCCCCCC,
                        0.5
                    ).setDepth(100);

                    this.tweens.add({
                        targets: gas,
                        y: beakerY - 180,
                        alpha: 0,
                        duration: 1200,
                        onComplete: () => gas.destroy()
                    });
                });
            }

            this.time.delayedCall(2200, callback);

        } else if (animKey === 'solutionFade') {
            // Solution fades Blue -> Clear (e.g. Zn + CuSO4)
            // Create a blue circle representing the solution
            const solution = this.add.circle(beakerX, beakerY, 80, 0x3498db, 0.6)
                .setDepth(100);

            this.tweens.add({
                targets: solution,
                alpha: 0,
                duration: 1000,
                onComplete: () => solution.destroy()
            });

            this.time.delayedCall(1200, callback);

        } else if (animKey === 'precipitate') {
            // Milk-white Precipitate (AgNO3 + NaCl)
            const particles = [];
            for (let i = 0; i < 30; i++) {
                const p = this.add.circle(
                    beakerX + Phaser.Math.Between(-40, 40),
                    beakerY + Phaser.Math.Between(-30, 30),
                    Phaser.Math.Between(3, 8),
                    0xFFFFFF,
                    0.9
                ).setDepth(100);
                particles.push(p);

                this.tweens.add({
                    targets: p,
                    y: beakerY + 50 + Phaser.Math.Between(-10, 10), // Fall down slightly
                    alpha: 0.2, // Fade out partially
                    duration: 1500,
                    ease: 'Quad.easeOut',
                    onComplete: () => p.destroy()
                });
            }
            this.time.delayedCall(1500, callback);

        } else if (animKey === 'cloudyParticles') {
            // White Cloudy Particles (AgNO3 + HCl)
            const particles = [];
            for (let i = 0; i < 25; i++) {
                const cloud = this.add.circle(
                    beakerX + Phaser.Math.Between(-50, 50),
                    beakerY + Phaser.Math.Between(-40, 40),
                    Phaser.Math.Between(10, 20),
                    0xEEEEEE,
                    0.6 // Semi-transparent cloud
                ).setDepth(100);
                particles.push(cloud);

                this.tweens.add({
                    targets: cloud,
                    scale: 1.5,
                    alpha: 0,
                    duration: 1800,
                    ease: 'Sine.easeInOut',
                    onComplete: () => cloud.destroy()
                });
            }
            this.time.delayedCall(1500, callback);

        } else if (animKey === 'colorChange') {
            // Color change effect (e.g. Fe + CuSO4) - Rust/Brown
            const glow = this.add.circle(beakerX, beakerY, 80, 0xD45500, 0.6)
                .setDepth(100);

            this.tweens.add({
                targets: glow,
                scale: 2.5,
                alpha: 0,
                duration: 800, // Fast fade
                onComplete: () => glow.destroy()
            });

            this.time.delayedCall(1000, callback); // Fast callback

        } else {
            // Default effect - simple glow

            const glow = this.add.circle(beakerX, beakerY, 80, 0x00FF00, 0.5)
                .setDepth(100);

            this.tweens.add({
                targets: glow,
                scale: 2,
                alpha: 0,
                duration: 800, // Faster (was 1500)
                onComplete: () => glow.destroy()
            });

            this.time.delayedCall(1000, callback); // Faster (was 1800)
        }
    }


    showReactionResult(reaction) {
        this.hideHint();

        // 1. Add to history for ALL reaction types
        this.addToHistory(reaction);

        // 2. Unlock Products on Shelf
        reaction.products.forEach(productSymbol => {
            const compound = compounds.find(c => c.symbol === productSymbol);
            if (compound) {
                if (['H2', 'O2', 'Cl2'].includes(compound.symbol)) return;

                if (!compoundInventory.hasCompound(compound.name)) {
                    compoundInventory.addCompound(compound.name);
                    this.displayCompoundInInventory(compound);
                }
            }
        });

        // 3. Handle SYNTHESIS - Show full celebration screen (like Stage 1)
        if (reaction.type === 'synthesis') {
            // Find the first compound that was created
            const newCompound = reaction.products
                .map(symbol => compounds.find(c => c.symbol === symbol))
                .find(c => c && !['H2', 'O2', 'Cl2'].includes(c.symbol));

            if (newCompound) {
                // Show full celebration screen and clear beaker
                this.showCongratsScreen(newCompound);
            }
            return;
        }

        // 4. Handle NON-SYNTHESIS (Decomposition, etc) - Show Reaction Analysis Screen

        // Clear beaker immediately after reaction
        this.elementsInZone.forEach(element => {
            if (element.floatTween) element.floatTween.destroy();
            element.destroy();
        });
        this.elementsInZone = [];

        // Pause bubbles during analysis screen
        if (this.bubbleTimer) {
            this.bubbleTimer.paused = true;
        }

        // Background (Readable Slate)
        const resultBg = this.add.rectangle(928, 522, 3000, 3000, 0x1a2530, 0.95)
            .setOrigin(0.5)
            .setDepth(1000)
            .setInteractive();

        // Title
        const titleText = this.add.text(928, 200, 'Reaction Analysis', {
            fontSize: '48px',
            fill: '#ffffff',
            fontStyle: 'bold',
            stroke: '#2c3e50',
            strokeThickness: 6
        }).setOrigin(0.5).setDepth(1001);

        // Type
        const typeText = this.add.text(928, 280, `Type: ${reaction.type.toUpperCase()}`, {
            fontSize: '34px',
            fill: '#3498db',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5).setDepth(1001);

        // Balanced Equation
        const equationText = this.add.text(928, 380, reaction.equation, {
            fontSize: '44px',
            fill: '#ecf0f1',
            fontFamily: 'Verdana, sans-serif',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4,
            backgroundColor: '#2c3e50',
            padding: { x: 30, y: 20 }
        }).setOrigin(0.5).setDepth(1001);


        // Products
        const productsStr = reaction.products.map(p => p.replace(/_c$/, '')).join(' + ');
        const productsText = this.add.text(928, 500, `Products: ${productsStr}`, {
            fontSize: '38px',
            fill: '#2ecc71',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5).setDepth(1001);

        // Play VFX at products position
        let vfxTimer = null;
        if (reaction.product_effect) {
            this.playProductEffect(reaction.product_effect, 928, 500);
            // Loop the effect every 2 seconds while screen is open
            vfxTimer = this.time.addEvent({
                delay: 2000,
                callback: () => {
                    if (resultBg.active) {
                        this.playProductEffect(reaction.product_effect, 928, 500);
                    }
                },
                loop: true
            });
        }

        // Energy (if applicable)
        let energyText = null;
        if (reaction.energy_source) {
            energyText = this.add.text(928, 600, `âš¡ Energy Required: ${reaction.energy_source}`, {
                fontSize: '28px',
                fill: '#e67e22',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 3
            }).setOrigin(0.5).setDepth(1001);
        }

        // Continue
        const continueText = this.add.text(928, 720, 'Click anywhere to continue', {
            fontSize: '26px',
            fill: '#95a5a6',
            fontStyle: 'italic',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5).setDepth(1001);

        this.tweens.add({
            targets: continueText, alpha: 0.5, duration: 800, yoyo: true, repeat: -1
        });

        // Dismiss
        const dismissDisplay = () => {
            if (resultBg.active) {
                resultBg.destroy();
                titleText.destroy();
                typeText.destroy();
                equationText.destroy();
                productsText.destroy();
                if (energyText) energyText.destroy();
                continueText.destroy();

                // Stop VFX timer
                if (vfxTimer) {
                    vfxTimer.remove();
                }

                // Resume bubbles after dismissing
                if (this.bubbleTimer) {
                    this.bubbleTimer.paused = false;
                }
            }
        };

        resultBg.on('pointerdown', dismissDisplay);
        this.time.delayedCall(10000, dismissDisplay);
    }


    getRequiredEnergySource(elementsInZone) {
        // Check if any element requires energy
        for (const elementKey of elementsInZone) {
            const element = elements.find(e => e.textureKey === elementKey);
            if (element && element.energySource) {
                return element.energySource;
            }

            // Check if it's a compound that requires energy
            const compound = compounds.find(c => c.textureKey === elementKey);
            if (compound && compound.energySource) {
                // Map compound energy source to our button types
                if (compound.energySource.includes('electricity')) {
                    return 'electricity';
                } else if (compound.energySource.includes('heat (high)')) {
                    return 'high_heat';
                }
            }
        }

        return null; // No energy required
    }

    showEnergyRequiredMessage(requiredEnergy) {
        this.input.enabled = false;
        this.scientist.setTexture('shock');

        let energyName = '';
        if (requiredEnergy === 'initial_heat') {
            energyName = 'Initial Heat';
        } else if (requiredEnergy === 'electricity') {
            energyName = 'Electricity';
        } else if (requiredEnergy === 'high_heat') {
            energyName = 'High Heat';
        }

        const messageText = this.add.text(1200, 300, `This reaction requires:\n${energyName}`, {
            fontSize: '32px',
            fill: '#FFFF00',
            stroke: '#000000',
            strokeThickness: 4,
            align: 'center',
            backgroundColor: '#000000',
            padding: { x: 20, y: 20 }
        }).setOrigin(0.5).setDepth(1001);

        this.time.delayedCall(4000, () => {
            messageText.destroy();
            this.scientist.setTexture('default');
            this.input.enabled = true;
        });
    }

    checkForCompound(elementsInZone) {
        const elementCounts = {};
        elementsInZone.forEach(element => {
            elementCounts[element] = (elementCounts[element] || 0) + 1;
        });

        return compounds.find(compound => {
            const requiredElements = {};
            for (let [element, count] of compound.property) {
                requiredElements[element.name.toLowerCase()] = count;
            }

            return Object.keys(requiredElements).length === Object.keys(elementCounts).length &&
                Object.keys(requiredElements).every(element =>
                    elementCounts[element] === requiredElements[element]
                );
        });
    }

    createBubbles() {
        this.bubbles = [];
        const beakerX = 1760;
        const beakerY = 580;

        for (let i = 0; i < 5; i++) {
            this.createBubble(beakerX, beakerY);
        }

        this.bubbleTimer = this.time.addEvent({
            delay: 800,
            callback: () => this.createBubble(beakerX, beakerY),
            loop: true
        });
    }

    createBubble(x, y) {
        const bubble = this.add.graphics();
        const size = Phaser.Math.Between(8, 16);

        bubble.fillStyle(0x00ff44, 0.7);
        bubble.fillCircle(0, 0, size);
        bubble.lineStyle(2, 0x00aa22, 0.8);
        bubble.strokeCircle(0, 0, size);

        bubble.x = x + Phaser.Math.Between(-15, 15);
        bubble.y = y + Phaser.Math.Between(-10, 10);

        this.bubbles.push(bubble);

        this.tweens.add({
            targets: bubble,
            y: bubble.y - Phaser.Math.Between(100, 200),
            x: bubble.x + Phaser.Math.Between(-30, 30),
            alpha: 0,
            scaleX: 0.3,
            scaleY: 0.3,
            duration: Phaser.Math.Between(2000, 3500),
            ease: 'Power2',
            onComplete: () => {
                const index = this.bubbles.indexOf(bubble);
                if (index > -1) this.bubbles.splice(index, 1);
                bubble.destroy();
            }
        });
    }

    update() {
    }

    addToHistory(reaction) {
        // Prevent duplicates
        if (this.history.find(r => r.equation === reaction.equation)) return;

        this.history.push(reaction);
        // Save to localStorage for persistence
        localStorage.setItem('chemicalSimHistory', JSON.stringify(this.history));
        console.log('Added to history:', reaction.equation);
    }

    toggleHistory() {
        if (this.historyPanelOpen) {
            if (this.historyDragHandler) {
                this.input.off('pointermove', this.historyDragHandler);
                this.input.off('pointerup', this.historyUpHandler);
                this.historyDragHandler = null;
                this.historyUpHandler = null;
            }
            if (this.historyContainer) this.historyContainer.destroy();
            this.historyPanelOpen = false;
            return;
        }

        this.historyPanelOpen = true;

        const x = 928;
        const y = 522;
        this.historyContainer = this.add.container(0, 0).setDepth(2000);

        // Background (Readable Slate)
        const bg = this.add.rectangle(x, y, 900, 700, 0x2c3e50, 0.95)
            .setStrokeStyle(4, 0x34495e);
        this.historyContainer.add(bg);

        // Title
        const title = this.add.text(x, y - 300, '\uD83D\uDCDC Reaction Journal', {
            fontSize: '42px',
            fill: '#ffffff',
            fontFamily: 'Verdana',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);
        this.historyContainer.add(title);

        // Close Button (top-right)
        const topCloseBtn = this.add.text(x + 400, y - 300, '\u2716', {
            fontSize: '52px',
            fill: '#ff6666',
            fontFamily: 'Arial',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5).setInteractive({ cursor: 'pointer' });

        topCloseBtn.on('pointerover', () => {
            topCloseBtn.setScale(1.2);
        });

        topCloseBtn.on('pointerout', () => {
            topCloseBtn.setScale(1);
        });

        topCloseBtn.on('pointerdown', () => {
            this.toggleHistory();
        });

        this.historyContainer.add(topCloseBtn);

        // Create scrollable content container with masking
        this.journalScrollOffset = 0;
        const maxVisibleHeight = 500;
        this.journalContent = this.add.container(0, 0);

        // Create a mask to clip content
        const maskShape = this.make.graphics();
        maskShape.fillStyle(0xffffff);
        maskShape.fillRect(x - 430, y - 260, 860, 540);
        const mask = maskShape.createGeometryMask();
        this.journalContent.setMask(mask);

        this.historyContainer.add(this.journalContent);

        let currentY = y - 240;

        if (this.history.length === 0) {
            const emptyText = this.add.text(x, y, 'No discoveries yet.', { fontSize: '24px', fill: '#95a5a6' }).setOrigin(0.5);
            this.journalContent.add(emptyText);
        } else {
            // Group by type
            const groups = {};
            this.history.forEach(r => {
                const rawType = r.type || 'Other';
                const type = rawType.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

                if (!groups[type]) groups[type] = [];
                groups[type].push(r);
            });

            Object.keys(groups).forEach(type => {
                const header = this.add.text(x, currentY, `=== ${type} ===`, {
                    fontSize: '30px',
                    fill: '#3498db',
                    fontStyle: 'bold',
                    stroke: '#000000',
                    strokeThickness: 3
                }).setOrigin(0.5);
                this.journalContent.add(header);
                currentY += 40;

                groups[type].forEach(r => {
                    const equationText = this.add.text(x, currentY, `${r.equation}`, {
                        fontSize: '22px',
                        fill: '#ecf0f1',
                        fontStyle: 'bold',
                        stroke: '#000000',
                        strokeThickness: 3
                    }).setOrigin(0.5);
                    this.journalContent.add(equationText);

                    currentY += 35;

                    const productStr = r.products.map(p => p.replace(/_c$/, '')).join(' + ');
                    const productText = this.add.text(x, currentY, productStr, {
                        fontSize: '34px',
                        fill: '#2ecc71',
                        fontStyle: 'bold',
                        stroke: '#000000',
                        strokeThickness: 4
                    }).setOrigin(0.5);
                    this.journalContent.add(productText);

                    currentY += 60;
                });
                currentY += 20;
            });

            // Add scrollbar if content is too long
            const totalHeight = currentY - (y - 240);
            this.journalTotalHeight = totalHeight;
            this.journalMaxHeight = maxVisibleHeight;

            if (totalHeight > maxVisibleHeight) {
                // Scrollbar track
                const scrollbarX = x + 410;
                const scrollbarTrack = this.add.rectangle(scrollbarX, y, 8, 500, 0x34495e, 0.5)
                    .setOrigin(0.5);
                this.historyContainer.add(scrollbarTrack);

                // Scrollbar thumb
                const thumbHeight = Math.max(40, (maxVisibleHeight / totalHeight) * 500);
                this.scrollbarThumb = this.add.rectangle(scrollbarX, y - 250 + (thumbHeight / 2), 8, thumbHeight, 0x3498db, 0.9)
                    .setOrigin(0.5)
                    .setInteractive({ cursor: 'grab' });

                // Kinetic Scrolling Logic
                this.isDraggingJournal = false;
                this.journalDragStartY = 0;
                this.journalStartOffset = 0;

                bg.setInteractive({ cursor: 'grab' });

                bg.on('pointerdown', (pointer) => {
                    this.isDraggingJournal = true;
                    this.journalDragStartY = pointer.y;
                    this.journalStartOffset = this.journalScrollOffset;
                    bg.setCursor('grabbing');
                });

                this.historyUpHandler = () => {
                    this.isDraggingJournal = false;
                    if (bg && bg.scene) bg.setCursor('grab');
                };
                this.input.on('pointerup', this.historyUpHandler);

                this.historyDragHandler = (pointer) => {
                    if (!this.isDraggingJournal) return;
                    const deltaY = this.journalDragStartY - pointer.y;
                    const targetOffset = this.journalStartOffset + deltaY;
                    const maxOffset = Math.max(0, totalHeight - maxVisibleHeight);
                    this.journalScrollOffset = Phaser.Math.Clamp(targetOffset, 0, maxOffset);
                    this.journalContent.y = -this.journalScrollOffset;
                    const scrollRatio = this.journalScrollOffset / maxOffset;
                    if (!isNaN(scrollRatio)) {
                        const trackTop = y - 250;
                        const availableTrack = 500 - thumbHeight;
                        this.scrollbarThumb.y = trackTop + (thumbHeight / 2) + (scrollRatio * availableTrack);
                        this.scrollbarThumb.x = 1338;
                    }
                };
                this.input.on('pointermove', this.historyDragHandler);

                this.historyContainer.add(this.scrollbarThumb);

                // Enable scrolling on background
                bg.setInteractive();
                bg.on('wheel', (pointer, deltaX, deltaY) => {
                    this.journalScrollOffset += deltaY * 0.3;
                    this.journalScrollOffset = Phaser.Math.Clamp(
                        this.journalScrollOffset,
                        0,
                        Math.max(0, totalHeight - maxVisibleHeight)
                    );
                    this.journalContent.y = -this.journalScrollOffset;

                    // Update scrollbar thumb position
                    const scrollRatio = this.journalScrollOffset / (totalHeight - maxVisibleHeight);
                    const thumbRange = 500 - thumbHeight;
                    const thumbY = y - 250 + (thumbHeight / 2) + (scrollRatio * thumbRange);
                    this.scrollbarThumb.y = thumbY;
                });
            }
        }

        // Bottom buttons
        const buttonY = y + 310;

        // Clear History Button (bottom-center)
        const clearBtn = this.add.text(x, buttonY, '\uD83D\uDDD1\uFE0F Clear History', {
            fontSize: '20px',
            fill: '#ff6666',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2,
            padding: { x: 10, y: 6 }
        }).setOrigin(0.5).setInteractive({ cursor: 'pointer' });

        clearBtn.on('pointerover', () => {
            clearBtn.setScale(1.05);
            clearBtn.setFill('#ff6666');
        });

        clearBtn.on('pointerout', () => {
            clearBtn.setScale(1);
            clearBtn.setFill('#ff4444');
        });

        clearBtn.on('pointerdown', () => {
            localStorage.removeItem('chemicalSimHistory');
            this.history = [];

            if (this.historyContainer) this.historyContainer.destroy();
            this.historyPanelOpen = false;
            this.toggleHistory();
        });

        this.historyContainer.add(clearBtn);
    }

    playProductEffect(effectType, x, y) {


        if (effectType === 'bubbles' || effectType === 'constant_bubbles' || effectType === 'rapid_bubbles') {
            // Create bubbles rising
            for (let i = 0; i < 20; i++) {
                this.time.delayedCall(i * 100, () => {
                    const bubble = this.add.circle(x + Phaser.Math.Between(-50, 50), y + Phaser.Math.Between(0, 50), Phaser.Math.Between(5, 12), 0x88ccff, 0.6)
                        .setDepth(1002);

                    this.tweens.add({
                        targets: bubble,
                        y: y - 150,
                        alpha: 0,
                        duration: 2000,
                        onComplete: () => bubble.destroy()
                    });
                });
            }
        } else if (effectType === 'fizz') {
            // Quick small bubbles
            for (let i = 0; i < 30; i++) {
                const bubble = this.add.circle(x + Phaser.Math.Between(-30, 30), y + Phaser.Math.Between(-10, 10), Phaser.Math.Between(2, 6), 0xffffff, 0.8)
                    .setDepth(1002);

                this.tweens.add({
                    targets: bubble,
                    y: y - 100 + Phaser.Math.Between(-20, 20),
                    x: x + Phaser.Math.Between(-50, 50),
                    alpha: 0,
                    duration: 1000,
                    onComplete: () => bubble.destroy()
                });
            }
        } else if (effectType === 'metal_glow' || effectType === 'glow') {
            const glow = this.add.circle(x, y, 60, 0xffff00, 0.4).setDepth(1002);
            this.tweens.add({
                targets: glow,
                scale: 2.5,
                alpha: 0,
                duration: 1000,
                repeat: 0,
                yoyo: false,
                onComplete: () => glow.destroy()
            });
        } else if (effectType === 'smoke') {
            for (let i = 0; i < 15; i++) {
                this.time.delayedCall(i * 150, () => {
                    const smoke = this.add.circle(x, y - 20, Phaser.Math.Between(10, 25), 0x555555, 0.4).setDepth(1002);
                    this.tweens.add({
                        targets: smoke,
                        y: y - 200,
                        x: x + Phaser.Math.Between(-30, 30),
                        scale: 2,
                        alpha: 0,
                        duration: 2500,
                        onComplete: () => smoke.destroy()
                    });
                });
            }
        } else if (effectType === 'rust_glow') {
            const glow = this.add.circle(x, y, 60, 0xD45500, 0.6).setDepth(1002);
            this.tweens.add({
                targets: glow,
                scale: 2.5,
                alpha: 0,
                duration: 1000,
                onComplete: () => glow.destroy()
            });
        } else if (effectType === 'solution_fade') {
            const solution = this.add.circle(x, y, 60, 0x3498db, 0.6).setDepth(1002);
            this.tweens.add({
                targets: solution,
                alpha: 0,
                duration: 1000,
                onComplete: () => solution.destroy()
            });
        } else if (effectType === 'precipitate_milk') {
            for (let i = 0; i < 20; i++) {
                const p = this.add.circle(
                    x + Phaser.Math.Between(-30, 30),
                    y + Phaser.Math.Between(-20, 20),
                    Phaser.Math.Between(3, 8),
                    0xFFFFFF,
                    0.9
                ).setDepth(1002);

                this.tweens.add({
                    targets: p,
                    y: y + 40 + Phaser.Math.Between(-10, 10),
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quad.easeOut',
                    onComplete: () => p.destroy()
                });
            }

        } else if (effectType === 'cloudy_white') {
            for (let i = 0; i < 15; i++) {
                const cloud = this.add.circle(
                    x + Phaser.Math.Between(-40, 40),
                    y + Phaser.Math.Between(-30, 30),
                    Phaser.Math.Between(10, 18),
                    0xEEEEEE,
                    0.5
                ).setDepth(1002);

                this.tweens.add({
                    targets: cloud,
                    scale: 1.5,
                    alpha: 0,
                    duration: 1800,
                    ease: 'Sine.easeInOut',
                    onComplete: () => cloud.destroy()
                });
            }
        } else if (effectType === 'bright_flame' || effectType === 'blue_flame') {
            const isBlue = effectType === 'blue_flame';
            const color = isBlue ? 0x0088FF : 0xFFAA00;

            // Flash
            const flash = this.add.circle(x, y, 80, color, 0.6).setDepth(1002);
            this.tweens.add({
                targets: flash,
                scale: 3,
                alpha: 0,
                duration: 500,
                onComplete: () => flash.destroy()
            });

            // Flame particles
            for (let i = 0; i < 12; i++) {
                this.time.delayedCall(i * 30, () => {
                    const p = this.add.circle(
                        x + Phaser.Math.Between(-25, 25),
                        y + Phaser.Math.Between(-15, 15),
                        Phaser.Math.Between(6, 14),
                        color,
                        0.9
                    ).setDepth(1002);

                    this.tweens.add({
                        targets: p,
                        y: y - 140,
                        alpha: 0,
                        duration: 700,
                        ease: 'Quad.easeOut',
                        onComplete: () => p.destroy()
                    });
                });
            }
        }
    }

    transitionToStart() {
        const beaker = this.children.getByName('beaker');

        this.tweens.add({
            targets: [beaker, this.combineBtn, this.combineBtnPressed, this.clearBtn, this.clearBtnPressed, this.electricBtn, this.electricBtnPressed, this.initialHeatBtn, this.initialHeatBtnPressed, this.highHeatBtn, this.highHeatBtnPressed],
            y: '+=100',
            duration: 400,
            ease: 'Power2',
            onComplete: () => {
                this.scene.start('Start');
            }
        });
    }
}
