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
        this.load.image('default', 'assets/scientist/default.png');
        this.load.image('excited', 'assets/scientist/excited.png');
        this.load.image('hint', 'assets/scientist/hint.png');
        this.load.image('shock', 'assets/scientist/shock.png');

        this.load.image('hydrogen', 'assets/elements/hydrogen.png');    // 1
        this.load.image('carbon', 'assets/elements/carbon.png');        // 6
        this.load.image('nitrogen', 'assets/elements/nitrogen.png');    // 7
        this.load.image('oxygen', 'assets/elements/oxygen.png');        // 8
        this.load.image('sodium', 'assets/elements/sodium.png');        // 11
        this.load.image('magnesium', 'assets/elements/magnesium.png');  // 12
        this.load.image('sulfur', 'assets/elements/sulfur.png');        // 16
        this.load.image('chlorine', 'assets/elements/chlorine.png');    // 17
        this.load.image('calcium', 'assets/elements/calcium.png');      // 20
        this.load.image('iron', 'assets/elements/iron.png');            // 26
        this.load.image('copper', 'assets/elements/copper.png');        // 29
        this.load.image('zinc', 'assets/elements/zinc.png');            // 30
        this.load.image('silver', 'assets/elements/silver.png');        // 47
    }

    create() {
        this.add.image(928, 522, 'background').setDisplaySize(1856, 1044);
        this.add.image(-200, 1200, 'shelf').setOrigin(0, 1).setScale(1);
        this.add.image(380, 1050, 'combineMachine').setOrigin(0, 1).setScale(1);
        this.combineBtn = this.add.image(840, 968, 'btn_combine').setOrigin(0, 1).setScale(0.35).setInteractive({ cursor: 'pointer' });
        this.combineBtnPressed = this.add.image(840, 968, 'btn_combine_pressed').setOrigin(0, 1).setScale(0.35).setVisible(false);

        // Create all draggable elements
        const elements = [
            {name: 'hydrogen', x: 70, y: 430},
            {name: 'carbon', x: 170, y: 430},
            {name: 'nitrogen', x: 270, y: 430},
            {name: 'oxygen', x: 370, y: 430},
            {name: 'sodium', x: 470, y: 430},
            {name: 'magnesium', x: 70, y: 567},
            {name: 'sulfur', x: 170, y: 567},
            {name: 'chlorine', x: 270, y: 567},
            {name: 'calcium', x: 370, y: 567},
            {name: 'iron', x: 470, y: 567},
            {name: 'copper', x: 70, y: 702},
            {name: 'zinc', x: 170, y: 702},
            {name: 'silver', x: 270, y: 702}
        ];
        
        elements.forEach(element => {
            const img = this.add.image(element.x, element.y, element.name).setOrigin(0, 1).setScale(0.3).setInteractive();
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
            this.combineBtn.setVisible(false);
            this.combineBtnPressed.setVisible(true);
        });
        
        this.combineBtn.on('pointerup', () => {
            this.combineBtn.setVisible(true);
            this.combineBtnPressed.setVisible(false);
        });
        
        this.combineBtn.on('pointerout', () => {
            this.combineBtn.setVisible(true);
            this.combineBtnPressed.setVisible(false);
        });
        
        this.add.image(1000, 1000, 'default').setOrigin(0, 1).setScale(1.7);
    }

    update() {

    }
    
}
