export class HomePage extends Phaser.Scene {
    constructor() {
        super('HomePage');
        this.secretCode = '';
        this.particles = [];
    }

    preload() {
        // Preload will use existing assets from the game
    }

    create() {
        // Gradient background (dark blue to purple for a scientific feel)
        const bg = this.add.rectangle(928, 522, 1856, 1044, 0x1a1a2e);

        // Add a second layer for gradient effect
        const bgGradient = this.add.rectangle(928, 522, 1856, 1044, 0x0f3460, 0.6);

        // Create floating atom particles for visual interest
        this.createFloatingAtoms();

        // Large animated title - TWO LINES like Breaking Bad
        const titleContainer = this.add.container(928, 320);

        const chemText = this.add.text(0, -40, 'Chem', {
            fontSize: '120px',
            fill: '#00d4ff',
            fontStyle: 'bold',
            stroke: '#ffffff',
            strokeThickness: 8,
            shadow: {
                offsetX: 5,
                offsetY: 5,
                color: '#000000',
                blur: 10,
                fill: true
            }
        }).setOrigin(0.5);

        const simText = this.add.text(0, 60, 'Sim', {
            fontSize: '120px',
            fill: '#00d4ff',
            fontStyle: 'bold',
            stroke: '#ffffff',
            strokeThickness: 8,
            shadow: {
                offsetX: 5,
                offsetY: 5,
                color: '#000000',
                blur: 10,
                fill: true
            }
        }).setOrigin(0.5);

        titleContainer.add([chemText, simText]);

        // Pulsing glow animation for title
        this.tweens.add({
            targets: titleContainer,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Educational tagline
        const subtitle = this.add.text(928, 420, 'Master Chemistry Through Interactive Experiments!', {
            fontSize: '36px',
            fill: '#ffd700',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Fade in subtitle
        subtitle.setAlpha(0);
        this.tweens.add({
            targets: subtitle,
            alpha: 1,
            duration: 1500,
            delay: 500
        });

        // Create chemical symbols floating around
        this.createChemicalSymbols();

        // Play button (large and inviting)
        const playButton = this.add.rectangle(928, 650, 300, 100, 0x2ecc71);
        playButton.setStrokeStyle(5, 0xffffff);
        playButton.setInteractive({ cursor: 'pointer' });

        const playText = this.add.text(928, 650, '▶ PLAY', {
            fontSize: '48px',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Button hover effects
        playButton.on('pointerover', () => {
            this.tweens.add({
                targets: [playButton, playText],
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 200,
                ease: 'Power2'
            });
            playButton.setFillStyle(0x27ae60);
        });

        playButton.on('pointerout', () => {
            this.tweens.add({
                targets: [playButton, playText],
                scaleX: 1,
                scaleY: 1,
                duration: 200,
                ease: 'Power2'
            });
            playButton.setFillStyle(0x2ecc71);
        });

        // Click to start
        playButton.on('pointerdown', () => {
            this.tweens.add({
                targets: [playButton, playText],
                scaleX: 0.95,
                scaleY: 0.95,
                duration: 100,
                yoyo: true,
                onComplete: () => {
                    this.startGame();
                }
            });
        });

        // Info text at bottom
        const infoText = this.add.text(928, 950, 'Learn • Experiment • Discover', {
            fontSize: '24px',
            fill: '#95a5a6',
            fontStyle: 'italic'
        }).setOrigin(0.5);

        // Tutorial Button (Below Play)
        // Tutorial Button (Below Play) - Senior UX Enhancement
        const tutorialButton = this.add.rectangle(928, 760, 160, 45, 0xe67e22);
        tutorialButton.setStrokeStyle(2, 0xffffff);
        tutorialButton.setInteractive({ cursor: 'pointer' });

        // Add Pulse Animation
        this.tweens.add({
            targets: tutorialButton,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        const tutorialText = this.add.text(928, 760, '📖 TUTORIAL', {
            fontSize: '18px',
            fill: '#ffffff',
            fontStyle: 'bold',
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000000',
                blur: 4,
                fill: true
            }
        }).setOrigin(0.5);

        // Sync text pulse
        this.tweens.add({
            targets: tutorialText,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Tutorial Button Hover
        tutorialButton.on('pointerover', () => {
            tutorialButton.setFillStyle(0xd35400); // Darker Orange
            tutorialButton.setStrokeStyle(4, 0x00d4ff); // Blue glow stroke
        });

        tutorialButton.on('pointerout', () => {
            tutorialButton.setFillStyle(0xe67e22);
            tutorialButton.setStrokeStyle(4, 0xffffff);
        });

        tutorialButton.on('pointerdown', () => {
            this.scene.start('Tutorial');
        });

        // Sparkle effects around title
        this.time.addEvent({
            delay: 300,
            callback: () => this.createSparkle(),
            loop: true
        });

        // 🎩 Breaking Bad Easter Egg - Type "HEISENBERG"
        this.input.keyboard.on('keydown', (event) => {
            this.secretCode += event.key.toUpperCase();

            // Keep only last 11 characters (length of HEISENBERG)
            if (this.secretCode.length > 11) {
                this.secretCode = this.secretCode.slice(-11);
            }

            // Check if HEISENBERG was typed
            if (this.secretCode.includes('HEISENBERG')) {
                this.triggerBreakingBadEasterEgg();
                this.secretCode = ''; // Reset
            }
        });
    }

    createFloatingAtoms() {
        const colors = [0xff6b6b, 0x4ecdc4, 0xffe66d, 0x95e1d3, 0xf38181];

        for (let i = 0; i < 20; i++) {
            const x = Phaser.Math.Between(50, 1806);
            const y = Phaser.Math.Between(50, 994);
            const color = Phaser.Utils.Array.GetRandom(colors);
            const size = Phaser.Math.Between(10, 25);

            const atom = this.add.circle(x, y, size, color, 0.4);
            atom.setStrokeStyle(2, 0xffffff, 0.6);

            // Store for easter egg
            atom.setData('originalColor', color);
            this.particles.push(atom);

            // Random floating movement
            this.tweens.add({
                targets: atom,
                x: x + Phaser.Math.Between(-100, 100),
                y: y + Phaser.Math.Between(-100, 100),
                duration: Phaser.Math.Between(3000, 6000),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
    }

    createChemicalSymbols() {
        const symbols = ['H₂O', 'CO₂', 'NaCl', 'O₂', 'CH₄', 'H₂', 'Fe₂O₃'];
        const positions = [
            { x: 200, y: 200 },
            { x: 1600, y: 250 },
            { x: 300, y: 500 },
            { x: 1500, y: 600 },
            { x: 150, y: 800 },
            { x: 1650, y: 850 }
        ];

        positions.forEach((pos, index) => {
            if (index < symbols.length) {
                const symbol = this.add.text(pos.x, pos.y, symbols[index], {
                    fontSize: '28px',
                    fill: '#ecf0f1',
                    fontStyle: 'bold',
                    stroke: '#34495e',
                    strokeThickness: 2,
                    alpha: 0.3
                });

                // Gentle floating
                this.tweens.add({
                    targets: symbol,
                    y: pos.y - 20,
                    duration: 3000,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
            }
        });
    }

    createSparkle() {
        const x = 928 + Phaser.Math.Between(-300, 300);
        const y = 300 + Phaser.Math.Between(-80, 80);

        const sparkle = this.add.circle(x, y, 3, 0xffffff, 1);

        this.tweens.add({
            targets: sparkle,
            alpha: 0,
            scale: 2,
            duration: 1000,
            onComplete: () => sparkle.destroy()
        });
    }

    startGame() {
        // Fade out effect
        this.cameras.main.fadeOut(500, 0, 0, 0);

        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('Start');
        });
    }

    update() {
        // Simple update, no complex logic
    }

    triggerBreakingBadEasterEgg() {
        console.log('🎩 Breaking Bad Intro!');

        // BLACK OUT THE SCREEN
        const blackOverlay = this.add.rectangle(928, 522, 1856, 1044, 0x000000, 1)
            .setDepth(10000);

        // Breaking Bad signature green
        const bbGreen = '#739B47';

        // Create "Br" element (Bromine) - starts tiny
        const brBox = this.add.rectangle(928, 522, 100, 100, 0x000000)
            .setStrokeStyle(4, 0x739B47)
            .setDepth(10001)
            .setScale(0.1)
            .setAlpha(0);

        const brSymbol = this.add.text(928, 502, 'Br', {
            fontSize: '60px',
            fill: bbGreen,
            fontFamily: 'Arial, sans-serif',
            fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(10002).setScale(0.1).setAlpha(0);

        const brNumber = this.add.text(915, 548, '35', {
            fontSize: '20px',
            fill: bbGreen,
            fontFamily: 'Arial, sans-serif'
        }).setOrigin(0.5).setDepth(10002).setScale(0.1).setAlpha(0);

        // Create "Ba" element (Barium) - starts tiny
        const baBox = this.add.rectangle(928, 522, 100, 100, 0x000000)
            .setStrokeStyle(4, 0x739B47)
            .setDepth(10001)
            .setScale(0.1)
            .setAlpha(0);

        const baSymbol = this.add.text(928, 502, 'Ba', {
            fontSize: '60px',
            fill: bbGreen,
            fontFamily: 'Arial, sans-serif',
            fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(10002).setScale(0.1).setAlpha(0);

        const baNumber = this.add.text(915, 548, '56', {
            fontSize: '20px',
            fill: bbGreen,
            fontFamily: 'Arial, sans-serif'
        }).setOrigin(0.5).setDepth(10002).setScale(0.1).setAlpha(0);

        // ZOOM OUT Br (just like the intro!)
        this.time.delayedCall(200, () => {
            this.tweens.add({
                targets: [brBox, brSymbol, brNumber],
                alpha: 1,
                scale: 3,
                duration: 800,
                ease: 'Power2.easeOut'
            });
        });

        // ZOOM OUT Ba after Br
        this.time.delayedCall(1000, () => {
            this.tweens.add({
                targets: [baBox, baSymbol, baNumber],
                alpha: 1,
                scale: 3,
                duration: 800,
                ease: 'Power2.easeOut'
            });
        });

        // Fade everything out
        this.time.delayedCall(2500, () => {
            this.tweens.add({
                targets: [blackOverlay, brBox, brSymbol, brNumber, baBox, baSymbol, baNumber],
                alpha: 0,
                duration: 500,
                onComplete: () => {
                    blackOverlay.destroy();
                    brBox.destroy();
                    brSymbol.destroy();
                    brNumber.destroy();
                    baBox.destroy();
                    baSymbol.destroy();
                    baNumber.destroy();

                    // Show "Yeah, Science!" after intro
                    this.showYeahScience();
                }
            });
        });
    }

    showYeahScience() {
        // Turn particles blue
        this.particles.forEach(atom => {
            if (atom.active) {
                atom.setFillStyle(0x00BFFF, 0.8);
                atom.setStrokeStyle(3, 0xFFFFFF, 1);

                this.time.delayedCall(4000, () => {
                    if (atom.active) {
                        const originalColor = atom.getData('originalColor');
                        atom.setFillStyle(originalColor, 0.4);
                        atom.setStrokeStyle(2, 0xffffff, 0.6);
                    }
                });
            }
        });

        // "Yeah, Science!" text
        const scienceText = this.add.text(928, 522, 'Yeah, Science!', {
            fontSize: '80px',
            fill: '#00BFFF',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5).setAlpha(0).setDepth(5000);

        this.tweens.add({
            targets: scienceText,
            alpha: 1,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 300,
            yoyo: true,
            hold: 1500,
            onComplete: () => {
                this.tweens.add({
                    targets: scienceText,
                    alpha: 0,
                    duration: 500,
                    onComplete: () => scienceText.destroy()
                });
            }
        });
    }
}
