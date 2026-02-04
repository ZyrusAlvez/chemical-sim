import { compounds, elements } from '../../data/chemicals.js';

export class Stage2 extends Phaser.Scene {

    constructor() {
        super('Stage2');
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
    }

    create() {
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
        this.compoundSlots = [{x: 415, y: 660}, {x: 515, y: 660}, {x: 115, y: 790}, {x: 215, y: 790}, {x: 315, y: 790}, {x: 415, y: 790}, {x: 515, y: 790}];
        this.nextSlotIndex = 0;
        this.createdCompounds = [];
        this.createdCompoundNames = new Set();
        this.wrongAttempts = 0;
        
        const elementPositions = [
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
        
        elementPositions.forEach(element => {
            const img = this.add.image(element.x, element.y, element.name).setOrigin(element.originX, element.originY).setScale(element.scale).setInteractive().setDepth(2);
            img.originalX = element.x;
            img.originalY = element.y;
            img.isElement = true;
            this.input.setDraggable(img);
        });

        this.dropZone = this.add.zone(1070, 685, 170, 150).setRectangleDropZone(170, 150);
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
                onComplete: () => {
                    this.transitionToStart();
                }
            });
        });
    }
    
    setupDragAndDrop() {
        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
            if (gameObject.labelText) {
                gameObject.labelText.x = dragX;
                gameObject.labelText.y = dragY + 50;
            }
        });
        
        this.input.on('drop', (pointer, gameObject, dropZone) => {
            if (!gameObject.isElement) return;
            
            const copy = this.add.image(gameObject.x, gameObject.y, gameObject.texture.key).setOrigin(0, 1).setScale(0.3);
            this.elementsInZone.push(copy);
            copy.inDropZone = true;
            
            this.tweens.add({
                targets: gameObject,
                x: gameObject.originalX,
                y: gameObject.originalY,
                duration: 300,
                ease: 'Power2'
            });
            
            this.tweens.add({
                targets: copy,
                scaleX: 0.15,
                scaleY: 0.15,
                duration: 300,
                ease: 'Power2'
            });
            
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
    }
    
    setupButtons() {
        this.combineBtn.on('pointerdown', () => {
            if (this.buttonPressed) return;
            
            this.buttonPressed = true;
            this.combineBtn.setVisible(false);
            this.combineBtnPressed.setVisible(true);
            this.combineBtn.disableInteractive();
            
            const elementsInZone = this.elementsInZone.map(element => element.texture.key);
            const foundCompound = this.checkForCompound(elementsInZone);
            
            if (foundCompound && !this.createdCompoundNames.has(foundCompound.name)) {
                this.wrongAttempts = 0;
                this.addCompoundToInventory(foundCompound);
            } else if (foundCompound && this.createdCompoundNames.has(foundCompound.name)) {
                this.showAlreadyFormulatedMessage();
            } else if (!foundCompound && elementsInZone.length > 0) {
                this.wrongAttempts++;
                if (this.wrongAttempts >= 3) {
                    this.showClosestHint(elementsInZone);
                    this.wrongAttempts = 0;
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
            
            this.hideAllAnimations();
            
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
        
        for (let i = 0; i < 6; i++) {
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
                duration: 2000,
                delay: i * 200,
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
        this.createdCompoundNames.add(compound.name);
        this.showCongratsScreen(compound);
        
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
            if (!this.createdCompoundNames.has(compound.name)) {
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
        
        const hintCompound = bestMatch || compounds.find(c => !this.createdCompoundNames.has(c.name));
        const hintImg = this.add.image(1200, 300, hintCompound.textureKey + '_hint')
            .setOrigin(0.5)
            .setScale(0.7)
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