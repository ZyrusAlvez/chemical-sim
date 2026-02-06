
export class Tutorial extends Phaser.Scene {
    constructor() {
        super('Tutorial');
        this.currentSlide = 0;
        this.slides = [
            {
                title: "Hi Scientist! 🧪",
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
                text: "Click the 'COMBINE' button to mix them!\nIf the recipe is correct, you get a NEW element! ✨",
                icon: "combineMachine"
            },
            {
                title: "3. Energy",
                text: "Some reactions need energy!\nUse [Heat] or [Electricity] buttons for complex synthesis.",
                icon: "hint"
            },
            {
                title: "4. Recipes",
                text: "Stuck? Click the 'RECIPES' button.\nIt shows you a list of valid combinations to try!",
                icon: "hint"
            },
            {
                title: "5. The Journal",
                text: "Check your Journal 📜 to see your history.\nIt records every successful experiment you make.",
                icon: "hint"
            },
            {
                title: "Ready?",
                text: "That's it! You are ready to experiment.\nGo safely and have fun! 🚀",
                icon: "excited"
            }
        ];
    }

    preload() {
        // Assets are already loaded by HomePage/Start, but safety check or reuse
        // We rely on assets loaded in Preloader or HomePage if they persist, 
        // but typically Scenes should ensure their own assets availability if strictly isolated.
        // However, since we come from HomePage, commonly shared assets might be available.
        // To be safe, we use keys that are definitely loaded in HomePage or Start if we know flow.
        // HomePage preloads? Start preloads?
        // Let's assume common assets (background, scientist) are available or we reuse text.
    }

    init(data) {
        this.fromScene = data ? data.from : null;
    }

    create() {
        // =================================================================
        // PREMIUM VISUALS: Breaking Bad / Dark Chem Theme
        // =================================================================

        // 1. Background: Deep Lab Dark (Matching Homepage Body)
        // Using a radial gradient simulation via texture or multiple rects would be best, 
        // but for Phaser code simplicity, a solid dark base with an overlay works.
        this.add.rectangle(928, 522, 1856, 1044, 0x011905);
        // Add a subtle vignette/gradient effect
        const vignette = this.add.graphics();
        vignette.fillGradientStyle(0x000000, 0x000000, 0x011905, 0x011905, 0.8, 0.8, 0, 0);
        vignette.fillRect(0, 0, 1856, 1044);

        // 2. Title: "HOW TO COOK" vibe (Breaking Bad style?) or just clean "TUTORIAL"
        // Using the custom font 'BreakingBad' if loaded, falling back to Impact/Bold
        const titleText = this.add.text(928, 80, 'Lab Procedure', {
            fontSize: '72px',
            fill: '#4ea281', // The "Breaking Bad Green" from index.html
            fontFamily: 'BreakingBad, SFPro-Bold, Arial',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5).setAlpha(0);

        // Title Animation (Fade + Slide Down)
        this.tweens.add({
            targets: titleText,
            y: 120,
            alpha: 1,
            duration: 1200,
            ease: 'Power3.easeOut'
        });

        // 3. The "Element Card" Container (The Slide Area)
        // Modeled after the Periodic Table elements in the CSS intro
        const cardX = 928;
        const cardY = 540;
        const cardWidth = 1100;
        const cardHeight = 650;

        const bgCard = this.add.container(cardX, cardY);

        // Glassmorphism Card Background
        const cardShape = this.add.rectangle(0, 0, cardWidth, cardHeight, 0x052e16, 0.85); // Dark Green tint
        cardShape.setStrokeStyle(4, 0x4ea281); // Bright Green Border

        // Inner "Element" details (decorative corners)
        const atomicNumber = this.add.text(-cardWidth / 2 + 20, -cardHeight / 2 + 20, '56', {
            fontSize: '32px', fill: '#4ea281', fontFamily: 'SFPro-Bold'
        }).setOrigin(0);

        const atomicMass = this.add.text(cardWidth / 2 - 20, -cardHeight / 2 + 20, '137.33', {
            fontSize: '24px', fill: '#2ecc71', fontFamily: 'SFPro-Regular'
        }).setOrigin(1, 0);

        bgCard.add([cardShape, atomicNumber, atomicMass]);

        // Navigation (Left/Right)
        this.createNavigation(cardX, cardY, cardWidth);

        // Slide Content - Typography Improvements
        this.slideTitle = this.add.text(0, -180, '', {
            fontSize: '64px',
            fill: '#ffffff',
            fontFamily: 'SFPro-Bold, Arial',
            stroke: '#000000',
            strokeThickness: 2,
            shadow: { offsetX: 0, offsetY: 4, color: '#4ea281', blur: 10, fill: true, stroke: true }
        }).setOrigin(0.5);

        this.slideText = this.add.text(0, 40, '', {
            fontSize: '32px',
            fill: '#e0e0e0',
            fontFamily: 'SFPro-Regular, Arial',
            align: 'center',
            wordWrap: { width: 900 },
            lineSpacing: 15
        }).setOrigin(0.5);

        // Icon/Graphic placeholder (Central visual)
        // We can add a 'Beaker' or 'Atom' sprite here if available, changing per slide.
        // For now, text layout is prioritized.

        bgCard.add([this.slideTitle, this.slideText]);

        // Start Slide Logic
        this.showSlide(0);

        // Back Button - Styled as a "Exit Lab" button
        // Positioned Top Left or Bottom Left? User liked "nicely inside".
        // Let's float it top-left of screen for "Menu" feel.
        const backBtn = this.add.text(60, 60, '⬅ EXIT LAB', {
            fontSize: '24px',
            fill: '#4ea281',
            fontFamily: 'SFPro-Bold, Arial',
            backgroundColor: 'rgba(0,0,0,0.5)',
            padding: { x: 15, y: 10 }
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
            if (this.fromScene) {
                this.scene.start(this.fromScene);
            } else {
                window.location.href = 'index.html';
            }
        });
    }

    createNavigation(x, y, width) {
        const arrowOffset = (width / 2) + 100;

        // Visual style for arrows: Circle with chevron
        const createArrow = (offsetX, label, delta) => {
            const arrowBtn = this.add.container(x + offsetX, y);

            // Circle bg
            const circle = this.add.circle(0, 0, 40, 0x1f401d).setStrokeStyle(2, 0x4ea281);
            const text = this.add.text(0, 0, label, { fontSize: '40px', fill: '#4ea281', fontFamily: 'Arial' }).setOrigin(0.5);

            arrowBtn.add([circle, text]);

            // Interaction
            const hitArea = new Phaser.Geom.Circle(0, 0, 40);
            arrowBtn.setInteractive(hitArea, Phaser.Geom.Circle.Contains);

            arrowBtn.on('pointerover', () => {
                circle.setFillStyle(0x4ea281);
                text.setColor('#000000');
                this.tweens.add({ targets: arrowBtn, scale: 1.2, duration: 100 });
            });
            arrowBtn.on('pointerout', () => {
                circle.setFillStyle(0x1f401d);
                text.setColor('#4ea281');
                this.tweens.add({ targets: arrowBtn, scale: 1, duration: 100 });
            });
            arrowBtn.on('pointerdown', () => this.changeSlide(delta));

            return arrowBtn;
        };

        this.leftArrow = createArrow(-arrowOffset, '❮', -1);
        this.rightArrow = createArrow(arrowOffset, '❯', 1);

        // Slide Dots (Progress Bar)
        this.dots = [];
        const dotSpacing = 30;
        const totalWidth = (this.slides.length - 1) * dotSpacing;
        const startX = x - totalWidth / 2;

        for (let i = 0; i < this.slides.length; i++) {
            const dot = this.add.circle(startX + (i * dotSpacing), y + 380, 8, 0x1f401d);
            dot.setStrokeStyle(1, 0x4ea281);
            this.dots.push(dot);
        }
    }

    showSlide(index) {
        if (index < 0 || index >= this.slides.length) return;

        // Animate Out Old Content (if exists)
        // Ideally we'd tween out, but for responsiveness we update text and tween IN.

        this.currentSlide = index;
        const slide = this.slides[index];

        // Update Text
        this.slideTitle.setText(slide.title);
        this.slideText.setText(slide.text);

        // Tween In Text
        this.slideTitle.setAlpha(0).setY(-200);
        this.slideText.setAlpha(0).setY(60);

        this.tweens.add({
            targets: this.slideTitle,
            y: -180,
            alpha: 1,
            duration: 500,
            ease: 'Back.out'
        });

        this.tweens.add({
            targets: this.slideText,
            y: 40,
            alpha: 1,
            duration: 500,
            delay: 100,
            ease: 'Power2.easeOut'
        });

        // Update Nav State
        this.leftArrow.setVisible(index > 0);
        this.rightArrow.setVisible(index < this.slides.length - 1);

        // Update Dots
        this.dots.forEach((dot, i) => {
            if (i === index) {
                dot.setFillStyle(0x4ea281); // Active Green
                dot.setRadius(10);
            } else {
                dot.setFillStyle(0x1f401d); // Dark Green
                dot.setRadius(6);
            }
        });

        // "Start Playing" Button on Last Slide
        if (this.startPlayBtn) this.startPlayBtn.destroy();

        if (index === this.slides.length - 1) {
            this.startPlayBtn = this.add.text(this.cameras.main.centerX, 540 + 200, '⚗️ BEGIN EXPERIMENT', {
                fontSize: '32px',
                fill: '#ffffff',
                backgroundColor: '#4ea281',
                padding: { x: 40, y: 20 },
                fontFamily: 'SFPro-Bold, Arial',
                shadow: { blur: 10, color: '#4ea281', fill: true }
            })
                .setOrigin(0.5)
                .setInteractive({ cursor: 'pointer' });

            // Pulse Effect
            this.tweens.add({
                targets: this.startPlayBtn,
                scale: 1.05,
                duration: 800,
                yoyo: true,
                repeat: -1
            });

            this.startPlayBtn.on('pointerdown', () => this.scene.start('Start'));
        }
    }

    changeSlide(delta) {
        const newIndex = this.currentSlide + delta;
        this.showSlide(newIndex);
    }
}
