import { compounds, elements } from '../../data/chemicals.js';
import { compoundInventory } from '../CompoundInventory.js';

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
        elements.forEach(element => {
            this.load.image(element.textureKey, element.imagePath);
        });

        // Load compound images from chemicals.js
        compounds.forEach(compound => {
            this.load.image(compound.textureKey, compound.imagePath);
            this.load.image(compound.textureKey + '_hint', compound.hint);
        });
    }

    create() {
        console.log("✅ START SCENE - NEW VERSION LOADED ✅");

        this.add.image(928, 522, 'background').setDisplaySize(1856, 1044);
        this.shelf = this.add.image(-200, 1200, 'shelf').setOrigin(0, 1).setScale(1).setDepth(1);

        // Start machine and buttons below screen and animate up
        const machine = this.add.image(615, 1385, 'combineMachine').setOrigin(0, 1).setScale(1).setName('combineMachine');
        this.combineBtn = this.add.image(1008, 1015, 'btn_combine').setOrigin(0, 1).setScale(0.35).setInteractive({ cursor: 'pointer' });
        this.combineBtnPressed = this.add.image(1008, 1015, 'btn_combine_pressed').setOrigin(0, 1).setScale(0.35).setVisible(false);
        this.clearBtn = this.add.image(1016, 1080, 'btn_clear').setOrigin(0, 1).setScale(0.3).setInteractive({ cursor: 'pointer' });
        this.clearBtnPressed = this.add.image(1016, 1080, 'btn_clear_pressed').setOrigin(0, 1).setScale(0.3).setVisible(false);

        // Animate machine and buttons up
        this.tweens.add({
            targets: [machine, this.combineBtn, this.combineBtnPressed, this.clearBtn, this.clearBtnPressed],
            y: '-=100',
            duration: 400,
            ease: 'Power2'
        });
        this.buttonPressed = false;
        this.clearButtonPressed = false;

        // Available positions for new compounds in inventory
        this.compoundSlots = [{ x: 415, y: 660 }, { x: 515, y: 660 }, { x: 115, y: 790 }, { x: 215, y: 790 }, { x: 315, y: 790 }, { x: 415, y: 790 }, { x: 515, y: 790 }];
        this.nextSlotIndex = 0;
        this.createdCompounds = [];
        this.wrongAttempts = 0;

        // Load existing compounds from global inventory
        this.loadExistingCompounds();

        const elements = [
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

        elements.forEach(element => {
            const img = this.add.image(element.x, element.y, element.name).setOrigin(element.originX, element.originY).setScale(element.scale).setInteractive().setDepth(2);
            img.originalX = element.x;
            img.originalY = element.y;
            img.isElement = true;
            this.input.setDraggable(img);
        });

        // Create drop zone (combine machine area)
        this.dropZoneGraphics = this.add.graphics();
        this.dropZoneGraphics.fillStyle(0xff0000, 0.3);
        this.dropZone = this.add.zone(1070, 685, 170, 150).setRectangleDropZone(170, 150);

        this.elementsInZone = [];

        // Drag events
        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
            // Move text label with compound if it exists
            if (gameObject.labelText) {
                gameObject.labelText.x = dragX;
                gameObject.labelText.y = dragY + 50;
            }
        });

        this.input.on('drop', (pointer, gameObject, dropZone) => {
            // Position items within the machine bounds
            const machineCenterX = 1070;
            const machineCenterY = 685;
            const offsetX = Phaser.Math.Between(-50, 50);
            const offsetY = Phaser.Math.Between(-40, 40);

            const copy = this.add.image(machineCenterX + offsetX, machineCenterY + offsetY, gameObject.texture.key)
                .setOrigin(0.5, 0.5)
                .setScale(0.08);
            this.elementsInZone.push(copy);
            copy.inDropZone = true;

            this.tweens.add({
                targets: gameObject,
                x: gameObject.originalX,
                y: gameObject.originalY,
                duration: 300,
                ease: 'Power2'
            });

            copy.floatTween = this.tweens.add({
                targets: copy,
                y: copy.y - 15,
                duration: 2000,
                ease: 'Sine.easeInOut',
                yoyo: true,
                repeat: -1
            });
        });

        this.input.on('dragend', (pointer, gameObject) => {
            if (!gameObject.inDropZone) {
                this.tweens.add({
                    targets: gameObject,
                    x: gameObject.originalX,
                    y: gameObject.originalY,
                    duration: 300,
                    ease: 'Power2'
                });
                // Move text label back with compound if it exists
                if (gameObject.labelText) {
                    this.tweens.add({
                        targets: gameObject.labelText,
                        x: gameObject.originalX,
                        y: gameObject.originalY + 50,
                        duration: 300,
                        ease: 'Power2'
                    });
                }
            }
        });

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

            // Clear all elements in drop zone
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

        this.scientist = this.add.image(1400, 1000, 'default').setOrigin(0, 1).setScale(0.5);

        // Add next stage button in bottom right corner
        this.nextStageBtn = this.add.image(1500, 950, 'nextstagebutton').setOrigin(1, 1).setScale(0.2).setInteractive({ cursor: 'pointer' });

        this.nextStageBtn.on('pointerdown', () => {
            this.tweens.add({
                targets: this.nextStageBtn,
                scaleX: 0.18,
                scaleY: 0.18,
                duration: 100,
                yoyo: true,
                onComplete: () => {
                    this.transitionToStage2();
                }
            });
        });

        // Create green bubbles at the top of the test tube
        this.createBubbles();
    }

    loadExistingCompounds() {
        const existingCompounds = compoundInventory.getCreatedCompounds();

        existingCompounds.forEach(compoundName => {
            const compound = compounds.find(c => c.name === compoundName);
            if (compound) {
                this.displayCompoundInInventory(compound);
            }
        });
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
            fontSize: '16px',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 2,
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

    addCompoundToInventory(compound) {
        compoundInventory.addCompound(compound.name);
        this.showCongratsScreen(compound);
        this.displayCompoundInInventory(compound);
    }

    showClosestHint(elementsInZone) {
        // Disable input
        this.input.enabled = false;

        // Change scientist to hint
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

        // Display hint message for best match or random if no match
        const hintCompound = bestMatch || compounds.find(c => !compoundInventory.hasCompound(c.name));
        const hintImg = this.add.image(1200, 300, hintCompound.textureKey + '_hint')
            .setOrigin(0.5)
            .setScale(0.7)
            .setDepth(1001);

        // Remove after 4 seconds
        this.time.delayedCall(4000, () => {
            hintImg.destroy();
            this.scientist.setTexture('default');
            this.input.enabled = true; // Re-enable input
            this.clearDropZone();
        });
    }

    showWrongFormulaMessage() {
        // Disable input
        this.input.enabled = false;

        // Change scientist to shock
        this.scientist.setTexture('shock');

        // Display wrong formula message
        const wrongFormulaImg = this.add.image(1200, 300, 'wrong_formula')
            .setOrigin(0.5)
            .setScale(0.7)
            .setDepth(1001);

        // Remove after 4 seconds
        this.time.delayedCall(4000, () => {
            wrongFormulaImg.destroy();
            this.scientist.setTexture('default');
            this.input.enabled = true; // Re-enable input
            this.clearDropZone();
        });
    }

    showAlreadyFormulatedMessage() {
        // Disable input
        this.input.enabled = false;

        // Change scientist to shock
        this.scientist.setTexture('shock');

        // Display already formulated message
        const alreadyFormulatedImg = this.add.image(1200, 300, 'already_formulated')
            .setOrigin(0.5)
            .setScale(0.7)
            .setDepth(1001);

        // Remove after 4 seconds
        this.time.delayedCall(4000, () => {
            alreadyFormulatedImg.destroy();
            this.scientist.setTexture('default');
            this.input.enabled = true; // Re-enable input
            this.clearDropZone();
        });
    }

    showCongratsScreen(compound) {
        // Disable input
        this.input.enabled = false;

        // Change scientist to excited
        this.scientist.setTexture('excited');

        // Pause bubble animations
        this.bubbleTimer.paused = true;
        this.bubbles.forEach(bubble => {
            this.tweens.killTweensOf(bubble);
        });

        // Create fullscreen background with 50% opacity
        const congratsBg = this.add.image(928, 522, 'congrats_bg')
            .setOrigin(0.5, 0.5)
            .setDisplaySize(2500, 2500)
            .setAlpha(0.5)
            .setDepth(1000);

        // Add slow rotation animation
        this.tweens.add({
            targets: congratsBg,
            rotation: Math.PI * 2,
            duration: 10000,
            ease: 'Linear',
            repeat: -1
        });

        // Add "New Compound!" image at center top
        const newCompoundText = this.add.image(928, 50, 'newCompoundText')
            .setScale(1.5)
            .setOrigin(0.5)
            .setDepth(1001);

        // Create compound image at center (moved down)
        const congratsCompound = this.add.image(928, 500, compound.textureKey)
            .setScale(0.5)
            .setDepth(1001);

        // Create compound name text below image (accounting for image height)
        const imageHeight = congratsCompound.displayHeight;
        const congratsText = this.add.text(928, congratsCompound.y + (imageHeight / 2) + 30, compound.name, {
            fontSize: '48px',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 4,
            align: 'center'
        }).setOrigin(0.5).setDepth(1001);

        // Auto-hide after 3 seconds
        this.time.delayedCall(3000, () => {
            congratsBg.destroy();
            newCompoundText.destroy();
            congratsCompound.destroy();
            congratsText.destroy();
            this.scientist.setTexture('default'); // Change back to default
            this.bubbleTimer.paused = false; // Resume bubble animations
            this.input.enabled = true; // Re-enable input
            this.clearDropZone();
        });

        // Allow click to dismiss early
        congratsBg.setInteractive().on('pointerdown', () => {
            congratsBg.destroy();
            newCompoundText.destroy();
            congratsCompound.destroy();
            congratsText.destroy();
            this.scientist.setTexture('default'); // Change back to default
            this.bubbleTimer.paused = false; // Resume bubble animations
            this.input.enabled = true; // Re-enable input
            this.clearDropZone();
        });
    }

    clearDropZone() {
        this.elementsInZone.forEach(element => {
            if (element.floatTween) element.floatTween.destroy();
            element.destroy();
        });
        this.elementsInZone = [];
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

        const testTubeX = 1760;
        const testTubeY = 580;

        // Create initial bubbles
        for (let i = 0; i < 5; i++) {
            this.createBubble(testTubeX, testTubeY);
        }

        // Continuously spawn new bubbles
        this.bubbleTimer = this.time.addEvent({
            delay: 800,
            callback: () => this.createBubble(testTubeX, testTubeY),
            loop: true
        });
    }

    createBubble(x, y) {
        // Create bubble using graphics
        const bubble = this.add.graphics();
        const size = Phaser.Math.Between(8, 16);

        bubble.fillStyle(0x00ff44, 0.7); // Green with transparency
        bubble.fillCircle(0, 0, size);
        bubble.lineStyle(2, 0x00aa22, 0.8);
        bubble.strokeCircle(0, 0, size);

        // Random starting position around test tube top
        bubble.x = x + Phaser.Math.Between(-15, 15);
        bubble.y = y + Phaser.Math.Between(-10, 10);

        this.bubbles.push(bubble);

        // Animate bubble floating up and fading
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

    transitionToStage2() {
        const machine = this.children.getByName('combineMachine');
        const combineBtn = this.combineBtn;
        const combineBtnPressed = this.combineBtnPressed;
        const clearBtn = this.clearBtn;
        const clearBtnPressed = this.clearBtnPressed;

        this.tweens.add({
            targets: [machine, combineBtn, combineBtnPressed, clearBtn, clearBtnPressed],
            y: '+=100',
            duration: 400,
            ease: 'Power2',
            onComplete: () => {
                this.scene.start('Stage2');
            }
        });
    }

}