import { compounds, elements } from '../../data/chemicals.js';
import { compoundInventory } from '../CompoundInventory.js';
// ReactionSystem not strictly needed here if we hardcode recipes, but good for future.
// We use fallback recipes in createCheatSheet anyway.

export class Start extends Phaser.Scene {

    constructor() {
        super('Start');
    }

    preload() {
        this.load.image('background', 'assets/background.png');
        this.load.image('shelf', 'assets/shelf.png');
        this.load.image('combineMachine', 'assets/combine_machine.png');
        this.load.image('btn_combine', 'assets/ui/btn_combine.png');
        this.load.image('btn_combine_pressed', 'assets/ui/btn_combine_pressed.png');
        this.load.image('btn_clear', 'assets/ui/btn_clear.png');
        this.load.image('btn_clear_pressed', 'assets/ui/btn_clear_pressed.png');
        this.load.image('default', 'assets/scientist/default.png');
        this.load.image('excited', 'assets/scientist/excited.png');
        this.load.image('hint', 'assets/scientist/hint.png');
        this.load.image('shock', 'assets/scientist/shock.png');
        this.load.image('congrats_bg', 'assets/congrats_bg.png');
        this.load.image('newCompoundText', 'assets/newCompoundText.png');
        this.load.image('already_formulated', 'assets/speech/already_formulated.png');
        this.load.image('wrong_formula', 'assets/speech/wrong_formula.png');
        this.load.image('beaker', 'assets/beaker.png');
        this.load.image('nextstagebutton', 'assets/nextstagebutton.png');

        // Load Elements
        elements.forEach(element => {
            this.load.image(element.textureKey, element.imagePath);
        });

        // Load Compounds & Hints
        compounds.forEach(compound => {
            this.load.image(compound.textureKey, compound.imagePath);
            this.load.image(compound.textureKey + '_hint', compound.hint);
        });
    }

    create() {
        console.log("✅ START SCENE - FULLY REPAIRED ✅");

        this.add.image(928, 522, 'background').setDisplaySize(1856, 1044);
        this.shelf = this.add.image(-200, 1200, 'shelf').setOrigin(0, 1).setScale(1).setDepth(1);

        // Machine & Buttons
        const machine = this.add.image(615, 1385, 'combineMachine').setOrigin(0, 1).setScale(1).setName('combineMachine');
        this.combineBtn = this.add.image(1008, 1015, 'btn_combine').setOrigin(0, 1).setScale(0.35).setInteractive({ cursor: 'pointer' });
        this.combineBtnPressed = this.add.image(1008, 1015, 'btn_combine_pressed').setOrigin(0, 1).setScale(0.35).setVisible(false);
        this.clearBtn = this.add.image(1016, 1080, 'btn_clear').setOrigin(0, 1).setScale(0.3).setInteractive({ cursor: 'pointer' });
        this.clearBtnPressed = this.add.image(1016, 1080, 'btn_clear_pressed').setOrigin(0, 1).setScale(0.3).setVisible(false);

        // Anim
        this.tweens.add({
            targets: [machine, this.combineBtn, this.combineBtnPressed, this.clearBtn, this.clearBtnPressed],
            y: '-=100',
            duration: 400,
            ease: 'Power2'
        });

        this.buttonPressed = false;
        this.clearButtonPressed = false;

        // Inventory Data
        this.compoundSlots = [{ x: 415, y: 660 }, { x: 515, y: 660 }, { x: 115, y: 790 }, { x: 215, y: 790 }, { x: 315, y: 790 }, { x: 415, y: 790 }, { x: 515, y: 790 }];
        this.nextSlotIndex = 0;
        this.createdCompounds = [];
        this.wrongAttempts = 0;
        this.elementsInZone = [];

        // Load Compounds
        this.loadExistingCompounds();

        // Setup Scene Components
        this.setupElements();
        this.setupDropZone();
        this.setupDragAndDrop();
        this.setupCombineLogic();
        this.setupButtons(); // Vertical Toolbar

        // Bubbles & Next Stage
        this.createBubbles();
        this.setupNextStageButton();

        this.scientist = this.add.image(1400, 1000, 'default').setOrigin(0, 1).setScale(0.5);
    }

    setupNextStageButton() {
        this.nextStageBtn = this.add.image(1500, 950, 'nextstagebutton').setOrigin(1, 1).setScale(0.2).setInteractive({ cursor: 'pointer' });
        this.nextStageBtn.on('pointerdown', () => {
            this.tweens.add({
                targets: this.nextStageBtn, scaleX: 0.18, scaleY: 0.18, duration: 100, yoyo: true,
                onComplete: () => this.transitionToStage2()
            });
        });
    }

    setupElements() {
        const elementsList = [
            { name: 'hydrogen', x: 70, y: 430, scale: 0.3 },
            { name: 'carbon', x: 170, y: 430, scale: 0.3 },
            { name: 'nitrogen', x: 270, y: 430, scale: 0.3 },
            { name: 'oxygen', x: 370, y: 430, scale: 0.3 },
            { name: 'sodium', x: 470, y: 430, scale: 0.3 },
            { name: 'magnesium', x: 70, y: 567, scale: 0.3 },
            { name: 'sulfur', x: 170, y: 567, scale: 0.3 },
            { name: 'chlorine', x: 270, y: 567, scale: 0.3 },
            { name: 'calcium', x: 370, y: 567, scale: 0.3 },
            { name: 'iron', x: 470, y: 567, scale: 0.3 },
            { name: 'copper', x: 70, y: 702, scale: 0.3 },
            { name: 'zinc', x: 170, y: 702, scale: 0.3 },
            { name: 'silver', x: 270, y: 702, scale: 0.3 },
        ];

        elementsList.forEach(el => {
            const img = this.add.image(el.x, el.y, el.name)
                .setOrigin(0, 1)
                .setScale(el.scale)
                .setInteractive()
                .setDepth(2);
            img.originalX = el.x;
            img.originalY = el.y;
            img.isElement = true;
            this.input.setDraggable(img);
        });
    }

    setupDropZone() {
        this.dropZoneGraphics = this.add.graphics();
        this.dropZoneGraphics.fillStyle(0xff0000, 0.3);
        // this.dropZoneGraphics.fillRect(1070 - 150, 685 - 125, 300, 250); // Debug Visual
        this.dropZone = this.add.zone(1070, 685, 300, 250).setRectangleDropZone(300, 250);
    }

    setupButtons() {
        // =========================================
        // RIGHT SIDE TOOLBAR (Vertical Stack)
        // =========================================
        const toolX = 1880;
        const toolGap = 85;
        let currentToolY = 50;

        const buttonStyle = {
            fontSize: '22px', fill: '#ffffff', fontFamily: 'Verdana', fontStyle: 'bold',
            stroke: '#000000', strokeThickness: 3, padding: { x: 30, y: 15 },
            shadow: { offsetX: 2, offsetY: 2, color: '#000000', blur: 4, stroke: true, fill: true }
        };

        // 1. JOURNAL (REMOVED for Stage 1)
        // this.historyBtn = this.add.text(toolX, currentToolY, '📜 JOURNAL', { ...buttonStyle, backgroundColor: '#2980b9' })
        //    .setOrigin(1, 0).setInteractive({ cursor: 'pointer' }).setDepth(100);
        // this.historyBtn.on('pointerdown', () => this.scene.launch('JournalOverlay', { parentScene: 'Start' }));

        // currentToolY += toolGap;

        // 2. TUTORIAL
        const tutorialBtn = this.add.text(toolX, currentToolY, '📖 TUTORIAL', { ...buttonStyle, backgroundColor: '#8e44ad' })
            .setOrigin(1, 0).setInteractive({ cursor: 'pointer' }).setDepth(100);

        tutorialBtn.on('pointerdown', () => this.scene.start('Tutorial', { from: 'Start' }));
        tutorialBtn.on('pointerover', () => { tutorialBtn.setScale(1.05); });
        tutorialBtn.on('pointerout', () => { tutorialBtn.setScale(1); });

        currentToolY += toolGap;

        // 3. RECIPES
        const helpBtn = this.add.text(toolX, currentToolY, '⚡ RECIPES', { ...buttonStyle, backgroundColor: '#27ae60' })
            .setOrigin(1, 0).setInteractive({ cursor: 'pointer' }).setDepth(100);

        helpBtn.on('pointerdown', () => this.toggleCheatSheet());
        helpBtn.on('pointerover', () => { helpBtn.setScale(1.05); });
        helpBtn.on('pointerout', () => { helpBtn.setScale(1); });

        // Create Cheat Sheet
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
            gameObject.setAlpha(0.7);
            gameObject.originalDepth = gameObject.depth;
            gameObject.setDepth(1000);
            if (gameObject.labelText) gameObject.labelText.setAlpha(0.7);
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
            const machineCenterX = 1070;
            const machineCenterY = 685;
            const offsetX = Phaser.Math.Between(-50, 50);
            const offsetY = Phaser.Math.Between(-40, 40);

            const copy = this.add.image(machineCenterX + offsetX, machineCenterY + offsetY, gameObject.texture.key)
                .setOrigin(0.5, 0.5).setScale(0.15);
            this.elementsInZone.push(copy);
            copy.inDropZone = true;

            this.tweens.add({ targets: gameObject, x: gameObject.originalX, y: gameObject.originalY, duration: 300, ease: 'Power2' });

            // Float animation
            copy.floatTween = this.tweens.add({ targets: copy, y: copy.y - 15, duration: 2000, ease: 'Sine.easeInOut', yoyo: true, repeat: -1 });
        });

        this.input.on('dragend', (pointer, gameObject) => {
            gameObject.setAlpha(1);
            if (gameObject.originalDepth) gameObject.setDepth(gameObject.originalDepth);
            if (!gameObject.inDropZone) {
                this.tweens.add({ targets: gameObject, x: gameObject.originalX, y: gameObject.originalY, duration: 300, ease: 'Power2' });
                if (gameObject.labelText) {
                    this.tweens.add({ targets: gameObject.labelText, x: gameObject.originalX, y: gameObject.originalY + 50, duration: 300, ease: 'Power2' });
                }
            }
        });
    }

    setupCombineLogic() {
        this.combineBtn.on('pointerdown', () => {
            if (this.buttonPressed) return;

            this.buttonPressed = true;
            this.combineBtn.setVisible(false);
            this.combineBtnPressed.setVisible(true);
            this.combineBtn.disableInteractive();

            // Check for compound combinations
            const elementsInZone = this.elementsInZone.map(element => element.texture.key);
            const foundCompound = this.checkForCompound(elementsInZone);

            if (foundCompound && !compoundInventory.hasCompound(foundCompound.name)) {
                this.wrongAttempts = 0; // Reset counter on successful creation
                this.addCompoundToInventory(foundCompound);
            } else if (foundCompound && compoundInventory.hasCompound(foundCompound.name)) {
                this.showAlreadyFormulatedMessage();
            } else if (!foundCompound && elementsInZone.length > 0) {
                this.wrongAttempts++;
                if (this.wrongAttempts >= 3) {
                    this.showClosestHint(elementsInZone);
                    this.wrongAttempts = 0; // Reset counter
                } else {
                    this.showWrongFormulaMessage();
                }
            }

            // Clear drop zone after check
            this.time.delayedCall(1000, () => {
                this.clearDropZone();
                this.buttonPressed = false;
                this.combineBtn.setVisible(true);
                this.combineBtnPressed.setVisible(false);
                this.combineBtn.setInteractive();
            });
        });

        this.clearBtn.on('pointerdown', () => {
            this.clearBtn.setVisible(false);
            this.clearBtnPressed.setVisible(true);
            this.clearDropZone();
            this.time.delayedCall(200, () => {
                this.clearBtn.setVisible(true);
                this.clearBtnPressed.setVisible(false);
            });
        });
    }

    checkForCompound(elementsInZone) {
        // Simplified check
        for (const compound of compounds) {
            const recipe = compound.elements;
            if (this.arraysEqual(elementsInZone, recipe)) return compound;
        }
        return null;
    }

    arraysEqual(arr1, arr2) {
        if (!arr1 || !arr2) return false;
        if (arr1.length !== arr2.length) return false;
        const sorted1 = [...arr1].sort();
        const sorted2 = [...arr2].sort();
        return sorted1.every((value, index) => value === sorted2[index]);
    }

    addCompoundToInventory(compound) {
        compoundInventory.addCompound(compound.name);
        this.createdCompounds.push(compound);

        // Show in inventory
        this.displayCompoundInInventory(compound);

        // Show toast
        const popup = this.add.image(928, 522, 'newCompoundText').setDepth(3000);
        popup.setScale(0);

        this.tweens.add({
            targets: popup,
            scale: 1,
            duration: 500,
            ease: 'Back.out',
            yoyo: true,
            hold: 1500
        });

        // Show congrats screen and record history
        this.showCongratsScreen(compound);
        this.recordHistory(compound);
    }

    recordHistory(compound) {
        const historyEntry = {
            reactants: compound.elements,
            products: [compound.name],
            timestamp: new Date().toISOString()
        };
        const history = JSON.parse(localStorage.getItem('chemicalSimHistory')) || [];
        history.push(historyEntry);
        localStorage.setItem('chemicalSimHistory', JSON.stringify(history));
    }

    displayCompoundInInventory(compound) {
        if (this.nextSlotIndex >= this.compoundSlots.length) return;

        const slot = this.compoundSlots[this.nextSlotIndex];
        this.nextSlotIndex++;

        const img = this.add.image(slot.x, slot.y, compound.textureKey).setScale(0.12).setInteractive();
        const label = this.add.text(slot.x, slot.y + 50, compound.name, {
            fontSize: '14px', fill: '#ffffff', fontFamily: 'Verdana'
        }).setOrigin(0.5);

        img.labelText = label;
        this.input.setDraggable(img);
        this.createdCompounds.push(img);
    }

    showClosestHint(elementsInZone) {
        // Disable input
        this.input.enabled = false;
        this.scientist.setTexture('hint');

        // Count elements in drop zone
        const elementCounts = {};
        elementsInZone.forEach(element => {
            elementCounts[element] = (elementCounts[element] || 0) + 1;
        });

        // Find compound with most matching elements that hasn't been created
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

        // Display hint message
        const hintCompound = bestMatch || compounds.find(c => !compoundInventory.hasCompound(c.name));
        if (hintCompound) {
            const hintImg = this.add.image(1200, 300, hintCompound.textureKey + '_hint')
                .setOrigin(0.5).setScale(0.7).setDepth(1001);

            this.time.delayedCall(4000, () => {
                if (hintImg.active) hintImg.destroy();
                this.scientist.setTexture('default');
                this.input.enabled = true;
                this.clearDropZone();
            });
        } else {
            this.scientist.setTexture('default');
            this.input.enabled = true;
            this.clearDropZone();
        }
    }

    showAlreadyFormulatedMessage() {
        this.input.enabled = false;
        this.scientist.setTexture('shock');
        const msg = this.add.image(1000, 600, 'already_formulated').setDepth(3000);
        this.time.delayedCall(4000, () => {
            msg.destroy();
            this.scientist.setTexture('default');
            this.input.enabled = true;
            this.clearDropZone();
        });
    }

    showWrongFormulaMessage() {
        this.input.enabled = false;
        this.scientist.setTexture('shock');
        const msg = this.add.image(1000, 600, 'wrong_formula').setDepth(3000);
        this.time.delayedCall(4000, () => {
            msg.destroy();
            this.scientist.setTexture('default');
            this.input.enabled = true;
            this.clearDropZone();
        });
    }

    showCongratsScreen(compound) {
        this.input.enabled = false;
        this.scientist.setTexture('excited');
        // Pause bubbles
        if (this.bubbleTimer) this.bubbleTimer.paused = true;

        const congratsBg = this.add.image(928, 522, 'congrats_bg').setOrigin(0.5, 0.5).setDisplaySize(2500, 2500).setAlpha(0.5).setDepth(1000);
        this.tweens.add({ targets: congratsBg, rotation: Math.PI * 2, duration: 10000, ease: 'Linear', repeat: -1 });

        const newCompoundText = this.add.image(928, 50, 'newCompoundText').setScale(1.5).setOrigin(0.5).setDepth(1001);
        const congratsCompound = this.add.image(928, 500, compound.textureKey).setScale(0.5).setDepth(1001);
        const congratsText = this.add.text(928, congratsCompound.y + (congratsCompound.displayHeight / 2) + 30, compound.name, {
            fontSize: '48px', fill: '#ffffff', fontFamily: 'Verdana', fontStyle: 'bold', stroke: '#000000', strokeThickness: 6, align: 'center'
        }).setOrigin(0.5).setDepth(1001);

        const cleanup = () => {
            congratsBg.destroy();
            newCompoundText.destroy();
            congratsCompound.destroy();
            congratsText.destroy();
            this.scientist.setTexture('default');
            if (this.bubbleTimer) this.bubbleTimer.paused = false;
            this.input.enabled = true;
            this.clearDropZone();
        };

        this.time.delayedCall(3000, cleanup);
        congratsBg.setInteractive().on('pointerdown', cleanup);
    }

    clearDropZone() {
        this.elementsInZone.forEach(el => {
            if (el.floatTween) el.floatTween.stop();
            el.destroy();
        });
        this.elementsInZone = [];
    }

    loadExistingCompounds() {
        const existingCompounds = compoundInventory.getCreatedCompounds();
        existingCompounds.forEach(compoundName => {
            const compound = compounds.find(c => c.name === compoundName);
            if (compound) this.displayCompoundInInventory(compound);
        });
    }

    createBubbles() {
        this.bubbles = [];
        const testTubeX = 1760;
        const testTubeY = 580;
        for (let i = 0; i < 5; i++) this.createBubble(testTubeX, testTubeY);
        this.bubbleTimer = this.time.addEvent({ delay: 800, callback: () => this.createBubble(testTubeX, testTubeY), loop: true });
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
            alpha: 0, scaleX: 0.3, scaleY: 0.3, duration: Phaser.Math.Between(2000, 3500), ease: 'Power2',
            onComplete: () => {
                const index = this.bubbles.indexOf(bubble);
                if (index > -1) this.bubbles.splice(index, 1);
                bubble.destroy();
            }
        });
    }

    update() { }

    transitionToStage2() {
        this.tweens.add({
            targets: [this.children.getByName('combineMachine'), this.combineBtn, this.combineBtnPressed, this.clearBtn, this.clearBtnPressed],
            y: '+=100', duration: 400, ease: 'Power2',
            onComplete: () => this.scene.start('Stage2')
        });
    }
}