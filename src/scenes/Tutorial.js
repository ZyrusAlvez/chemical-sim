
export class Tutorial extends Phaser.Scene {
    constructor() {
        super('Tutorial');
        this.currentSlide = 0;
        this.slides = [
            {
                title: "Hi, Scientist!",
                text: "Welcome to the Lab!\nLet's learn how to discover new elements.",
                icon: "excited"
            },
            {
                title: "1. The Basics",
                text: "Drag elements from the shelves on the left.\nDrop them into the big beaker in the middle.",
                icon: "default"
            },
            {
                title: "2. Mixing",
                text: "Click the COMBINE button to mix them!\nIf the recipe is correct, you get a NEW element!",
                icon: "combineMachine"
            },
            {
                title: "3. Energy",
                text: "Some reactions need energy!\nUse Heat or Electricity buttons for complex synthesis.",
                icon: "hint"
            },
            {
                title: "4. Recipes",
                text: "Stuck? Click the RECIPES button.\nIt shows you a list of valid combinations to try!",
                icon: "hint"
            },
            {
                title: "5. The Journal",
                text: "Check your 📜Journal to see your history.\nIt records every successful experiment you make.",
                icon: "hint"
            },
            {
                title: "Ready?",
                text: "That's it! You are ready to experiment.\nGo safely and have fun!",
                icon: "excited"
            }
        ];
    }

    preload() {
        // Load UI assets for the tutorial visuals
        this.load.image('btn_initialheat', 'assets/ui/btn_initialheat.png');
        this.load.image('btn_highheat', 'assets/ui/btn_highheat.png');
        this.load.image('electricbutton', 'assets/ui/electricbutton.png');
    }

    init(data) {
        this.fromScene = data ? data.from : null;
    }

    create() {
        // Notify that the game is ready (Hides Skeleton if this is the first scene)
        window.dispatchEvent(new Event('game-ready'));

        // Hide navigation buttons during Tutorial
        if (window.gameUIManager) {
            window.gameUIManager.hide();
        }

        // =================================================================
        // PREMIUM VISUALS: Cinematic Dark Theme
        // =================================================================

        this.add.rectangle(928, 522, 1856, 1044, 0x011905);
        const vignette = this.add.graphics();
        vignette.fillGradientStyle(0x000000, 0x000000, 0x011905, 0x011905, 0.8, 0.8, 0, 0);
        vignette.fillRect(0, 0, 1856, 1044);

        const titleText = this.add.text(928, 80, 'OPERATIONAL GUIDE', {
            fontSize: '60px',
            fill: '#4ea281',
            fontFamily: 'Verdana, sans-serif',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4,
            letterSpacing: 4
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({
            targets: titleText,
            y: 100,
            alpha: 1,
            duration: 1500,
            ease: 'Expo.easeOut'
        });

        const cardX = 928;
        const cardY = 540;
        const cardWidth = 1100;
        const cardHeight = 650;

        const bgCard = this.add.container(cardX, cardY);
        const cardShape = this.add.rectangle(0, 0, cardWidth, cardHeight, 0x052e16, 0.9);
        cardShape.setStrokeStyle(2, 0x4ea281);
        bgCard.add(cardShape);

        this.createNavigation(cardX, cardY, cardWidth);

        // Typography
        this.slideTitle = this.add.text(0, -180, '', {
            fontSize: '52px',
            fill: '#ffffff',
            fontFamily: 'Verdana, sans-serif',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.slideText = this.add.text(0, 40, '', {
            fontSize: '28px',
            fill: '#cccccc',
            fontFamily: 'Verdana, sans-serif',
            align: 'center',
            wordWrap: { width: 900 },
            lineSpacing: 12
        }).setOrigin(0.5);

        bgCard.add([this.slideTitle, this.slideText]);

        this.showSlide(0);

        const backBtn = this.add.text(60, 60, '⬅ RETURN', {
            fontSize: '18px',
            fill: '#4ea281',
            fontFamily: 'Verdana, sans-serif',
            fontStyle: 'bold',
            backgroundColor: 'rgba(0,0,0,0.5)',
            padding: { x: 20, y: 12 }
        })
            .setOrigin(0)
            .setInteractive({ cursor: 'pointer' })
            .setStroke('#4ea281', 1);

        backBtn.on('pointerover', () => {
            backBtn.setBackgroundColor('#4ea281');
            backBtn.setColor('#000000');
        });
        backBtn.on('pointerout', () => {
            backBtn.setBackgroundColor('rgba(0,0,0,0.5)');
            backBtn.setColor('#4ea281');
        });
        backBtn.on('pointerdown', () => {
            if (window.gameUIManager) window.gameUIManager.show();
            if (this.fromScene) {
                this.scene.start(this.fromScene);
            } else {
                window.location.href = 'index.html';
            }
        });
    }

    createNavigation(x, y, width) {
        const arrowOffset = (width / 2) + 100;

        const createArrow = (offsetX, label, delta) => {
            const arrowBtn = this.add.container(x + offsetX, y);
            const circle = this.add.circle(0, 0, 35, 0x1f401d).setStrokeStyle(1, 0x4ea281);
            const text = this.add.text(0, 0, label, { fontSize: '32px', fill: '#4ea281', fontFamily: 'Arial' }).setOrigin(0.5);
            arrowBtn.add([circle, text]);

            const hitArea = new Phaser.Geom.Circle(0, 0, 40);
            arrowBtn.setInteractive(hitArea, Phaser.Geom.Circle.Contains);

            arrowBtn.on('pointerover', () => {
                circle.setFillStyle(0x4ea281);
                text.setColor('#000000');
                this.tweens.add({ targets: arrowBtn, scale: 1.1, duration: 200, ease: 'Power2' });
            });
            arrowBtn.on('pointerout', () => {
                circle.setFillStyle(0x1f401d);
                text.setColor('#4ea281');
                this.tweens.add({ targets: arrowBtn, scale: 1, duration: 200, ease: 'Power2' });
            });
            arrowBtn.on('pointerdown', () => this.changeSlide(delta));

            return arrowBtn;
        };

        this.leftArrow = createArrow(-arrowOffset, '❮', -1);
        this.rightArrow = createArrow(arrowOffset, '❯', 1);

        // Slide Dots
        this.dots = [];
        const dotSpacing = 25;
        const startX = x - ((this.slides.length - 1) * dotSpacing) / 2;

        for (let i = 0; i < this.slides.length; i++) {
            const dot = this.add.circle(startX + (i * dotSpacing), y + 380, 5, 0x1f401d);
            dot.setStrokeStyle(1, 0x4ea281);
            this.dots.push(dot);
        }
    }

    showSlide(index) {
        if (index < 0 || index >= this.slides.length) return;

        this.currentSlide = index;
        const slide = this.slides[index];

        this.slideTitle.setText(slide.title);
        this.slideText.setText(slide.text);

        // Cinematic Fade-In
        this.slideTitle.setAlpha(0).setY(-200);
        this.slideText.setAlpha(0).setY(60);

        this.tweens.add({
            targets: this.slideTitle,
            y: -180,
            alpha: 1,
            duration: 800,
            ease: 'Expo.easeOut'
        });

        this.tweens.add({
            targets: this.slideText,
            y: 40,
            alpha: 1,
            duration: 800,
            delay: 100,
            ease: 'Expo.easeOut'
        });

        this.leftArrow.setVisible(index > 0);
        this.rightArrow.setVisible(index < this.slides.length - 1);

        // Update Dots
        this.dots.forEach((dot, i) => {
            if (i === index) {
                dot.setFillStyle(0x4ea281);
                dot.setRadius(7);
            } else {
                dot.setFillStyle(0x1f401d);
                dot.setRadius(5);
            }
        });

        // =========================================
        // SPECIAL CONTENT FOR SLIDES
        // =========================================

        // Clear previous special content
        if (this.specialContent) {
            this.specialContent.destroy();
            this.specialContent = null;
        }

        // Slide 3: Energy (Index 3) -> Show Energy Buttons
        if (index === 3) {
            this.specialContent = this.add.container(0, 150);

            // Initial Heat
            const btn1 = this.add.image(-120, 0, 'btn_initialheat').setScale(0.15);
            // High Heat
            const btn2 = this.add.image(0, 0, 'btn_highheat').setScale(0.15);
            // Electric
            const btn3 = this.add.image(120, 0, 'electricbutton').setScale(0.15);

            this.specialContent.add([btn1, btn2, btn3]);

            // Add to the main card container so it moves/fades with it if we animated the container, 
            // but here we are adding it to the scene relative to the card center implicitly? 
            // The method logic above uses `bgCard` but `showSlide` doesn't seem to have reference to `bgCard` easily unless we stored it.
            // Wait, looking at `create`, `bgCard` is a local variable. I need to store `bgCard` as `this.bgCard` to add children to it.
            // OR I can just position them relative to camera center (928, 540) + offset.

            this.specialContent.setPosition(928, 540 + 180); // Center of screen + down a bit more (was 120)
        }

        // "Start Playing" Button on Last Slide
        if (this.startPlayBtn) this.startPlayBtn.destroy();

        if (index === this.slides.length - 1) {
            this.startPlayBtn = this.add.text(this.cameras.main.centerX, 540 + 200, 'START', {
                fontSize: '24px',
                fill: '#ffffff',
                backgroundColor: '#4ea281',
                padding: { x: 50, y: 15 },
                fontFamily: 'Verdana, sans-serif',
                fontStyle: 'bold',
                shadow: { blur: 15, color: '#4ea281', fill: true }
            })
                .setOrigin(0.5)
                .setInteractive({ cursor: 'pointer' });

            this.tweens.add({
                targets: this.startPlayBtn,
                scale: 1.02,
                duration: 1500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });

            this.startPlayBtn.on('pointerdown', () => {
                if (window.gameUIManager) window.gameUIManager.show();
                // Show Skeleton Loader (only if needed/slow)
                if (window.showSkeleton) window.showSkeleton();
                this.scene.start('Start');
            });
        }
    }

    changeSlide(delta) {
        const newIndex = this.currentSlide + delta;
        this.showSlide(newIndex);
    }
}
