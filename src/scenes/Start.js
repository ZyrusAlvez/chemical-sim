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
        });
        
        this.input.on('drop', (pointer, gameObject, dropZone) => {
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
            
            if (foundCompound) {
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
        
        this.add.image(1400, 1000, 'default').setOrigin(0, 1).setScale(0.9);
    }

    addCompoundToInventory(compound) {
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
        
        if (compound.name === 'Methane') {
            compoundImg.setDepth(0); // Behind shelf
        } else {
            compoundImg.setDepth(2); // In front of shelf
        }
        
        compoundImg.originalX = x;
        compoundImg.originalY = y;
        this.input.setDraggable(compoundImg);
        
        this.createdCompounds.push(compoundImg);
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
