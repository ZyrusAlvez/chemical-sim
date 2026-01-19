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

        // Create draggable elements
        this.hydrogen = this.add.image(70, 430, 'hydrogen').setOrigin(0, 1).setScale(0.3).setInteractive();
        this.hydrogen.originalX = 70;
        this.hydrogen.originalY = 430;
        this.input.setDraggable(this.hydrogen);
        
        this.carbon = this.add.image(170, 430, 'carbon').setOrigin(0, 1).setScale(0.3).setInteractive();
        this.carbon.originalX = 170;
        this.carbon.originalY = 430;
        this.input.setDraggable(this.carbon);

        // Create drop zone (combine machine area)
        this.dropZoneGraphics = this.add.graphics();
        this.dropZoneGraphics.fillStyle(0xff0000, 0.3);
        this.dropZoneGraphics.fillRect(970, 600, 200, 180);
        this.dropZone = this.add.zone(1070, 690, 200, 180).setRectangleDropZone(200, 180);
        
        this.elementsInZone = [];
        
        // Drag events
        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });
        
        this.input.on('drop', (pointer, gameObject, dropZone) => {
            this.elementsInZone.push(gameObject);
            gameObject.inDropZone = true;
            
            // Scale down and start floating animation
            this.tweens.add({
                targets: gameObject,
                scaleX: 0.15,
                scaleY: 0.15,
                duration: 300,
                ease: 'Power2'
            });
            
            // Add floating animation
            gameObject.floatTween = this.tweens.add({
                targets: gameObject,
                y: gameObject.y - 20,
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
        this.add.image(270, 430, 'nitrogen').setOrigin(0, 1).setScale(0.3);
        this.add.image(370, 430, 'oxygen').setOrigin(0, 1).setScale(0.3);
        this.add.image(470, 430, 'sodium').setOrigin(0, 1).setScale(0.3);
        this.add.image(70, 567, 'magnesium').setOrigin(0, 1).setScale(0.3);
        this.add.image(170, 567, 'sulfur').setOrigin(0, 1).setScale(0.3);
        this.add.image(270, 567, 'chlorine').setOrigin(0, 1).setScale(0.3);
        this.add.image(370, 567, 'calcium').setOrigin(0, 1).setScale(0.3);
        this.add.image(470, 567, 'iron').setOrigin(0, 1).setScale(0.3);
        this.add.image(70, 702, 'copper').setOrigin(0, 1).setScale(0.3);
        this.add.image(170, 702, 'zinc').setOrigin(0, 1).setScale(0.3);
        this.add.image(270, 702, 'silver').setOrigin(0, 1).setScale(0.3);



        
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
