import { compounds, elements } from '../../data/chemicals.js';

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

        // Load element images from chemicals.js
        elements.forEach(element => {
            this.load.image(element.textureKey, element.imagePath);
        });

        // Load compound images from chemicals.js
        compounds.forEach(compound => {
            this.load.image(compound.textureKey, compound.imagePath);
        });
    }

    create() {
        this.add.image(928, 522, 'background').setDisplaySize(1856, 1044);
        this.shelf = this.add.image(-200, 1200, 'shelf').setOrigin(0, 1).setScale(1).setDepth(1);
        this.add.image(380, 1050, 'combineMachine').setOrigin(0, 1).setScale(1);
        this.combineBtn = this.add.image(1008, 879, 'btn_combine').setOrigin(0, 1).setScale(0.35).setInteractive({ cursor: 'pointer' });
        this.combineBtnPressed = this.add.image(1008, 879, 'btn_combine_pressed').setOrigin(0, 1).setScale(0.35).setVisible(false);
        this.clearBtn = this.add.image(1016, 957, 'btn_clear').setOrigin(0, 1).setScale(0.3).setInteractive({ cursor: 'pointer' });
        this.clearBtnPressed = this.add.image(1016, 957, 'btn_clear_pressed').setOrigin(0, 1).setScale(0.3).setVisible(false);
        this.buttonPressed = false;
        this.clearButtonPressed = false;

        // Available positions for new compounds in inventory
        this.compoundSlots = [{x: 415, y: 660}, {x: 515, y: 660}, {x: 115, y: 790}, {x: 215, y: 790}, {x: 315, y: 790}, {x: 415, y: 790}, {x: 515, y: 790}];
        this.nextSlotIndex = 0;
        this.createdCompounds = [];
        this.createdCompoundNames = new Set(); // Track created compound names

        const elements = [
            {name: 'hydrogen', x: 70, y: 430, scale: 0.3, originX: 0, originY: 1},
            {name: 'carbon', x: 170, y: 430, scale: 0.3, originX: 0, originY: 1},
            {name: 'nitrogen', x: 270, y: 430, scale: 0.3, originX: 0, originY: 1},
            {name: 'oxygen', x: 370, y: 430, scale: 0.3, originX: 0, originY: 1},
            {name: 'sodium', x: 470, y: 430, scale: 0.3, originX: 0, originY: 1},
            {name: 'magnesium', x: 70, y: 567, scale: 0.3, originX: 0, originY: 1},
            {name: 'sulfur', x: 170, y: 567, scale: 0.3, originX: 0, originY: 1},
            {name: 'chlorine', x: 270, y: 567, scale: 0.3, originX: 0, originY: 1},
            {name: 'calcium', x: 370, y: 567, scale: 0.3, originX: 0, originY: 1},
            {name: 'iron', x: 470, y: 567, scale: 0.3, originX: 0, originY: 1},
            {name: 'copper', x: 70, y: 702, scale: 0.3, originX: 0, originY: 1},
            {name: 'zinc', x: 170, y: 702, scale: 0.3, originX: 0, originY: 1},
            {name: 'silver', x: 270, y: 702, scale: 0.3, originX: 0, originY: 1},
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
            // Only allow elements (not compounds) to be dropped
            if (!gameObject.isElement) return;
            
            // Create a copy for the drop zone
            const copy = this.add.image(gameObject.x, gameObject.y, gameObject.texture.key).setOrigin(0, 1).setScale(0.3);
            this.elementsInZone.push(copy);
            copy.inDropZone = true;
            
            // Return original to inventory
            this.tweens.add({
                targets: gameObject,
                x: gameObject.originalX,
                y: gameObject.originalY,
                duration: 300,
                ease: 'Power2'
            });
            
            // Print all chemicals in drop zone
            const chemicalsInZone = this.elementsInZone.map(element => element.texture.key);
            console.log('Chemicals in drop zone:', chemicalsInZone);
            
            // Scale down and start floating animation on copy
            this.tweens.add({
                targets: copy,
                scaleX: 0.15,
                scaleY: 0.15,
                duration: 300,
                ease: 'Power2'
            });
            
            // Add floating animation to copy
            copy.floatTween = this.tweens.add({
                targets: copy,
                y: copy.y - 20,
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
            
            if (foundCompound && !this.createdCompoundNames.has(foundCompound.name)) {
                console.log(`Created compound: ${foundCompound.name} (${foundCompound.symbol})`);
                this.addCompoundToInventory(foundCompound);
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
    }

    addCompoundToInventory(compound) {
        // Add to created compounds set
        this.createdCompoundNames.add(compound.name);
        
        // Show congratulations screen first
        this.showCongratsScreen(compound);
        
        let x, y, scale;
        
        if (compound.name === 'Methane') {
            // Custom position and scale for methane - adjust these values as needed
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
        
        // Add text label below compound
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
            compoundImg.setDepth(0); // Behind shelf
            compoundText.setDepth(0); // Behind shelf
        } else {
            compoundImg.setDepth(2); // In front of shelf
            compoundText.setDepth(2); // In front of shelf
        }
        
        compoundImg.originalX = x;
        compoundImg.originalY = y;
        compoundImg.isElement = false;
        compoundImg.labelText = compoundText; // Store reference to text
        this.input.setDraggable(compoundImg);
        
        this.createdCompounds.push(compoundImg);
    }

    showCongratsScreen(compound) {
        // Change scientist to excited
        this.scientist.setTexture('excited');
        
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
            this.clearDropZone();
        });
        
        // Allow click to dismiss early
        congratsBg.setInteractive().on('pointerdown', () => {
            congratsBg.destroy();
            newCompoundText.destroy();
            congratsCompound.destroy();
            congratsText.destroy();
            this.scientist.setTexture('default'); // Change back to default
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

    update() {

    }
    
}
