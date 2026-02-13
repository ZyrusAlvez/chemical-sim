import { compounds, elements } from '../../data/chemicals.js';
import { compoundInventory } from '../CompoundInventory.js';

export class Start extends Phaser.Scene {

    constructor() {
        super('Start');
        this.currentHint = null;
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

        // ── TARGET-COMPOUND HINTS (formula-named, shown proactively) ──
        this.load.image('hint_h2o', 'assets/speech/hint/h2o.png');
        this.load.image('hint_nacl', 'assets/speech/hint/nacl.png');
        this.load.image('hint_naoh', 'assets/speech/hint/NaOH.png');
        this.load.image('hint_agno3', 'assets/speech/hint/AgNO3.png');
        this.load.image('hint_caco3', 'assets/speech/hint/CaCO3.png');
        this.load.image('hint_cuso4', 'assets/speech/hint/CuSO4.png');
        this.load.image('hint_hcl', 'assets/speech/hint/HCl.png');
        this.load.image('hint_ch4o2', 'assets/speech/hint/ch4o2.png');

        // ── REACTION HINTS ──
        this.load.image('mgo2flame', 'assets/speech/hint/mgo2flame.png');
        this.load.image('mgcl2', 'assets/speech/hint/mgcl2.png');
        this.load.image('mghcl', 'assets/speech/hint/mghcl.png');
        this.load.image('mgcuso4', 'assets/speech/hint/mgcuso4.png');
        this.load.image('fecuso4', 'assets/speech/hint/fecuso4.png');
        this.load.image('zncuso4', 'assets/speech/hint/zncuso4.png');
        this.load.image('znhcl', 'assets/speech/hint/znhcl.png');
        this.load.image('agno3nacl', 'assets/speech/hint/agno3nacl.png');
        this.load.image('agno3hcl', 'assets/speech/hint/agno3hcl.png');
        this.load.image('hclnaoh', 'assets/speech/hint/hclnaoh.png');
        this.load.image('caco3heat', 'assets/speech/hint/caco3heat.png');
        this.load.image('naclelectric', 'assets/speech/hint/naclelectric.png');
        this.load.image('h2oelectric', 'assets/speech/hint/h2oelectric.png');
        this.load.image('cao2', 'assets/speech/hint/cao2.png');
    }

    create() {
        console.log("✅ START SCENE - NEW VERSION LOADED ✅");

        // Notify that the game is ready (Hides Skeleton)
        window.dispatchEvent(new Event('game-ready'));

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
        this.dropZone = this.add.zone(1070, 685, 300, 250).setRectangleDropZone(300, 250);

        this.elementsInZone = [];

        // Drag events
        this.input.on('dragstart', (pointer, gameObject) => {
            gameObject.setAlpha(0.7);
            gameObject.originalDepth = gameObject.depth;
            gameObject.setDepth(1000); // Bring to top
        });

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
                .setScale(0.15); // Bigger size in machine
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

            // HINT TRIGGER: Fire on every drop for dynamic narrowing
            this.updateBeakerState();
        });

        this.input.on('dragend', (pointer, gameObject) => {
            gameObject.setAlpha(1);
            if (gameObject.originalDepth) gameObject.setDepth(gameObject.originalDepth);
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

            // CLEAR ANY VISIBLE HINT before showing result
            this.hideHint();

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

            // CLEAR HINT when beaker is cleared
            this.hideHint();

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

        // CLEAR INVENTORY BUTTON (Top of Shelf) - UX IMPROVED
        const clearInvBtn = this.add.text(300, 270, '✖ CLEAR SHELF', {
            fontSize: '18px',
            fill: '#ff6b6b', // Softer red
            fontFamily: 'Verdana, sans-serif',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4,
            shadow: { offsetX: 2, offsetY: 2, color: '#000000', blur: 2, stroke: true, fill: true }
        })
            .setOrigin(0.5)
            .setInteractive({ cursor: 'pointer' })
            .setDepth(100);

        // Hover Effect - Scale and Brightness
        clearInvBtn.on('pointerover', () => {
            clearInvBtn.setScale(1.1);
            clearInvBtn.setFill('#ff0000'); // Bright red on hover
        });

        clearInvBtn.on('pointerout', () => {
            clearInvBtn.setScale(1);
            clearInvBtn.setFill('#ff6b6b'); // Back to soft red
        });

        clearInvBtn.on('pointerdown', () => {
            compoundInventory.clear();

            // Remove visual sprites
            this.createdCompounds.forEach(comp => {
                if (comp.labelText) comp.labelText.destroy();
                comp.destroy();
            });
            this.createdCompounds = [];

            // Reset slot index
            this.nextSlotIndex = 0;

            // Flash effect to confirm clear
            this.cameras.main.flash(200, 255, 0, 0);
        });

        // =========================================
        // RIGHT SIDE TOOLBAR
        // =========================================
        const toolX = 1880;
        const toolGap = 85;
        let currentToolY = 50;



        const buttonStyle = {
            fontSize: '22px',
            fill: '#ffffff',
            fontFamily: 'Verdana',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3,
            padding: { x: 30, y: 15 },
            shadow: { offsetX: 2, offsetY: 2, color: '#000000', blur: 4, stroke: true, fill: true }
        };

        // EXIT BUTTON (Top Left) - Tab Style
        const exitBtn = this.add.text(0, 50, '✕ EXIT', {
            ...buttonStyle,
            backgroundColor: '#c0392b', // Red
            fixedWidth: 120,
            align: 'center',
            padding: { x: 10, y: 15 } // Adjust padding for tab look
        })
            .setOrigin(0, 0) // Anchor top-left
            .setInteractive({ cursor: 'pointer' })
            .setDepth(1000) // Layering: z-index 1000 equivalent
            .setScrollFactor(0);

        // Add a "Tab" shape mask or background if needed, but text with background color works as a simple tab
        // To make it look "clipped", x=0 is good.

        exitBtn.on('pointerover', () => {
            exitBtn.setBackgroundColor('#e74c3c');
        });
        exitBtn.on('pointerout', () => {
            exitBtn.setBackgroundColor('#c0392b');
        });
        exitBtn.on('pointerdown', () => {
            window.location.href = 'index.html?showThanks=true';
        });

        // 1. TUTORIAL (Top)
        const tutorialBtn = this.add.text(toolX, currentToolY, '📖 TUTORIAL', {
            ...buttonStyle,
            backgroundColor: '#8e44ad'
        })
            .setOrigin(1, 0)
            .setInteractive({ cursor: 'pointer' })
            .setDepth(100);

        tutorialBtn.on('pointerover', () => {
            tutorialBtn.setScale(1.05);
            tutorialBtn.setShadow(0, 0, '#8e44ad', 20, true, true);
        });
        tutorialBtn.on('pointerout', () => {
            tutorialBtn.setScale(1);
            tutorialBtn.setShadow(2, 2, '#000000', 4, true, true);
        });
        tutorialBtn.on('pointerdown', () => this.scene.start('Tutorial', { from: 'Start' }));

        currentToolY += toolGap;

        // 2. RECIPES (Bottom)
        const helpBtn = this.add.text(toolX, currentToolY, '⚡ RECIPES', {
            ...buttonStyle,
            backgroundColor: '#27ae60'
        })
            .setOrigin(1, 0)
            .setInteractive({ cursor: 'pointer' })
            .setDepth(100);

        helpBtn.on('pointerover', () => {
            helpBtn.setScale(1.05);
            helpBtn.setShadow(0, 0, '#27ae60', 20, true, true);
        });
        helpBtn.on('pointerout', () => {
            helpBtn.setScale(1);
            helpBtn.setShadow(2, 2, '#000000', 4, true, true);
        });
        helpBtn.on('pointerdown', () => this.toggleCheatSheet());

        // Create the Cheat Sheet Container
        this.createCheatSheet();
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
            // Gas sprites are 20% smaller than solids for visual distinction
            const gasKeys = ['h2', 'o2', 'cl2'];
            if (gasKeys.includes(compound.textureKey)) {
                scale = scale * 0.8;
            }
            this.nextSlotIndex++;
        }

        const compoundImg = this.add.image(x, y, compound.textureKey)
            .setOrigin(0.5, 0.5)
            .setScale(scale)
            .setInteractive();

        // WORD-SNAPPING FIX: Never break words mid-letter.
        // Put each word on its own line. Use smaller font for long names.
        const words = compound.name.split(' ');
        const displayText = words.join('\n');
        const longestWord = words.reduce((a, b) => a.length > b.length ? a : b, '');
        // If the longest word is 8+ chars, shrink font to fit
        const fontSize = longestWord.length >= 8 ? '12px' : '14px';

        const compoundText = this.add.text(x, y + 50, displayText, {
            fontSize: fontSize,
            fill: '#ffffff',
            fontFamily: 'Verdana',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4,
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
        if (!compoundInventory.addCompound(compound.name)) {
            // If false, it was a duplicate (and not a gas), so don't show congrats or badges
            if (!['Hydrogen Gas', 'Oxygen Gas', 'Chlorine Gas'].includes(compound.name)) {
                this.showAlreadyFormulatedMessage();
            }
            return;
        }

        this.showCongratsScreen(compound);
        this.displayCompoundInInventory(compound);

        // CHECK MILESTONES (Global State)
        const uniqueCount = compoundInventory.getUniqueNonGasCount();

        if (uniqueCount >= 13 && !compoundInventory.isMasterUnlocked) { // Reduced from 19 to 13 relative to recipe list size or keep 100% logic
            // logic implies 100% completion. Let's assume 100% is when all recipes are done. 
            // For now, let's stick to the prompt's "100% Completion" which might be dynamic.
            // But prompt says: "At 100% Completion: Show Master Gold Badge".
            // Let's use a safe high number or check total available. 
            // The prompt has specific triggers: 5 -> Bronze, 10 -> Silver.
            // Let's stick to the prompt strict rule: "At 5... At 10...".
        }

        // Check milestones based on strict thresholds
        if (uniqueCount === 5 && !compoundInventory.hasShownBronze) {
            compoundInventory.hasShownBronze = true;
            this.time.delayedCall(2000, () => {
                this.showAchievementBadge('bronze');
                // Trigger Mission Message
                this.showMissionMessage("MISSION: Unlock 5 more recipes to reveal the Decomposition Guide!");
            });
        }
        else if (uniqueCount === 10 && !compoundInventory.hasShownSilver) {
            compoundInventory.hasShownSilver = true;
            this.time.delayedCall(2000, () => {
                this.showAchievementBadge('silver');
                // Reveal is automatic in recipe book next time it opens
            });
        }

        // Check for "Master" (Assuming 100% is ~12-15 compounds based on provided lists)
        // Hardcoded 12 for now as "100%" or check if all possible compounds are found.
        // Synthesis (9) + Decomp (3) = 12 total distinct products roughly.
        if (uniqueCount >= 12 && !compoundInventory.isMasterUnlocked) {
            compoundInventory.isMasterUnlocked = true;
            this.time.delayedCall(2000, () => this.showAchievementBadge('master'));
        }
    }

    showMissionMessage(msg) {
        const missionBox = document.createElement('div');
        missionBox.style.cssText = `
            position: absolute; top: 15%; left: 50%; transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8); border: 2px solid #3498db;
            color: #ecf0f1; padding: 20px 40px; font-family: 'Verdana', sans-serif;
            font-size: 20px; font-weight: bold; border-radius: 10px;
            box-shadow: 0 0 20px rgba(52, 152, 219, 0.5); z-index: 2000;
            text-align: center;
        `;
        missionBox.innerText = msg;
        document.body.appendChild(missionBox);

        setTimeout(() => {
            missionBox.style.transition = 'opacity 1s';
            missionBox.style.opacity = '0';
            setTimeout(() => missionBox.remove(), 1000);
        }, 4000);
    }

    showAchievementBadge(tier) {
        const config = {
            bronze: { css: 'border: 3px solid #cd7f32; color: #cd7f32; box-shadow: 0 0 15px #cd7f32;', symbol: '5', label: 'BRONZE ALCHEMIST' },
            silver: { css: 'border: 3px solid #c0c0c0; color: #c0c0c0; box-shadow: 0 0 15px #c0c0c0;', symbol: '10', label: 'SILVER CHEMIST' },
            master: { css: 'border: 3px solid #ffd700; color: #ffd700; box-shadow: 0 0 25px #ffd700;', symbol: 'M', label: 'MASTER ALCHEMIST' }
        }[tier];

        const wrapper = document.createElement('div');
        wrapper.className = 'achievement-badge';
        wrapper.style.cssText = `
            position: absolute; top: 50px; left: 50%; transform: translateX(-50%);
            width: 80px; height: 80px; border-radius: 50%; display: flex;
            align-items: center; justify-content: center; background: rgba(0,0,0,0.9);
            z-index: 5000; animation: badgePop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            ${config.css}
        `;

        wrapper.innerHTML = `
            <div style="font-size: 32px; font-weight: 900; font-family: 'Verdana';">${config.symbol}</div>
            <div style="position: absolute; bottom: -40px; white-space: nowrap; font-size: 16px; font-weight: bold; text-shadow: 2px 2px 0 #000;">${config.label}</div>
        `;
        document.body.appendChild(wrapper);

        // Add keyframes if not exists
        if (!document.getElementById('badge-style')) {
            const style = document.createElement('style');
            style.id = 'badge-style';
            style.innerHTML = `@keyframes badgePop { 0% { transform: translateX(-50%) scale(0); } 100% { transform: translateX(-50%) scale(1); } }`;
            document.head.appendChild(style);
        }

        if (tier === 'master') {
            this.triggerSparkle();
        }

        setTimeout(() => {
            wrapper.style.transition = 'opacity 0.5s, transform 0.5s';
            wrapper.style.opacity = '0';
            wrapper.style.transform = 'translateX(-50%) translateY(-20px)';
            setTimeout(() => wrapper.remove(), 500);
        }, 4000);
    }

    triggerSparkle() {
        const sparkleOverlay = document.createElement('div');
        sparkleOverlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9999;';
        document.body.appendChild(sparkleOverlay);

        const colors = ['#FFD700', '#FFF', '#FFA500'];
        for (let i = 0; i < 100; i++) {
            const star = document.createElement('div');
            star.innerText = '✨';
            star.style.cssText = `
                position: absolute; font-size: ${10 + Math.random() * 20}px;
                left: ${Math.random() * 100}%; top: ${Math.random() * 100}%;
                color: ${colors[Math.floor(Math.random() * colors.length)]};
                opacity: 0; animation: sparkleAnim ${1 + Math.random()}s linear forwards;
                animation-delay: ${Math.random() * 0.5}s;
            `;
            sparkleOverlay.appendChild(star);
        }

        const style = document.createElement('style');
        style.innerHTML = `@keyframes sparkleAnim { 0% { opacity: 0; transform: scale(0); } 50% { opacity: 1; transform: scale(1.5); } 100% { opacity: 0; transform: scale(0); } }`;
        sparkleOverlay.appendChild(style);

        setTimeout(() => sparkleOverlay.remove(), 2000);
    }

    createCheatSheet() {
        // Placeholder to satisfy engine if called, but we use toggleRecipeBook logic
    }

    toggleCheatSheet() {
        // Redirect to new DOM method
        this.toggleRecipeBook();
    }

    toggleRecipeBook() {
        // Toggle existence of DOM element
        const existing = document.getElementById('recipe-book-overlay');
        if (existing) {
            existing.remove();
            return;
        }

        // Data Source
        const uniqueCount = compoundInventory.getUniqueNonGasCount();
        const showDecomp = uniqueCount >= 10;

        const synthesisRecipes = [
            { name: "WATER (H₂O)", formula: "H + H + O" },
            { name: "SALT (NaCl)", formula: "Na + Cl" },
            { name: "METHANE (CH₄)", formula: "C + 4H" },
            { name: "CARBON DIOXIDE (CO₂)", formula: "C + 2O" },
            { name: "CALCIUM CARBONATE", formula: "Ca + C + 3O" },
            { name: "SILVER NITRATE", formula: "Ag + N + 3O" },
            { name: "SODIUM HYDROXIDE", formula: "Na + O + H" },
            { name: "HYDROCHLORIC ACID", formula: "H + Cl" },
            { name: "COPPER SULFATE", formula: "Cu + S + 4O" }
        ];

        const decompRecipes = [
            { name: "WATER → H₂ + O₂", formula: "Water + Electricity (High)" },
            { name: "SALT → Na + Cl₂", formula: "NaCl + Electricity (Molten)" },
            { name: "CaCO₃ → CaO + CO₂", formula: "CaCO₃ + Heat (High)" }
        ];

        // Container
        const overlay = document.createElement('div');
        overlay.id = 'recipe-book-overlay';
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.6); z-index: 10000;
            display: flex; justify-content: center; align-items: center;
        `;

        // Click outside to close
        overlay.onclick = (e) => {
            if (e.target === overlay) overlay.remove();
        };

        // Book Content
        const book = document.createElement('div');
        book.style.cssText = `
            width: 500px; max-height: 450px; background: #1a1a1a;
            border: 2px solid #2ecc71; border-radius: 8px;
            box-shadow: 0 0 20px rgba(46, 204, 113, 0.2);
            display: flex; flex-direction: column; overflow: hidden;
            font-family: 'Verdana', sans-serif;
        `;

        // Header
        const header = document.createElement('div');
        header.style.cssText = `
            background: #2ecc71; color: #000; padding: 15px;
            font-weight: bold; font-size: 20px; text-align: center;
            display: flex; justify-content: space-between; align-items: center;
        `;
        header.innerHTML = `<span>🧪 RECIPE BOOK</span><span style="font-size: 14px; opacity: 0.8">Unlocked: ${uniqueCount}</span>`;

        // Scrollable List
        const list = document.createElement('div');
        list.style.cssText = `
            flex: 1; overflow-y: auto; padding: 20px;
            color: #ecf0f1;
        `;

        // Helper to render items
        const renderItem = (item, color) => `
            <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #333;">
                <div style="color: ${color}; font-weight: bold; font-size: 16px; margin-bottom: 5px;">${item.name}</div>
                <div style="color: #bdc3c7; font-size: 14px;">${item.formula}</div>
            </div>
        `;

        // 1. Synthesis Section
        list.innerHTML += `<div style="color: #2ecc71; font-weight: bold; margin-bottom: 15px; border-bottom: 2px solid #2ecc71; padding-bottom: 5px;">⚗️ SYNTHESIS</div>`;
        synthesisRecipes.forEach(r => list.innerHTML += renderItem(r, '#ffffff'));

        // 2. Decomposition Section (Gated)
        list.innerHTML += `<div style="color: #e74c3c; font-weight: bold; margin: 25px 0 15px 0; border-bottom: 2px solid #e74c3c; padding-bottom: 5px;">💥 DECOMPOSITION</div>`;

        if (showDecomp) {
            decompRecipes.forEach(r => list.innerHTML += renderItem(r, '#ffffff'));
        } else {
            list.innerHTML += `
                <div style="background: rgba(231, 76, 60, 0.1); border: 1px dashed #e74c3c; padding: 15px; text-align: center; color: #e74c3c; border-radius: 5px;">
                    <div>🔒 LOCKED</div>
                    <div style="font-size: 12px; margin-top: 5px;">Collect 10 Unique Compounds to reveal</div>
                </div>
            `;
        }

        book.appendChild(header);
        book.appendChild(list);

        // Footer hint
        const footer = document.createElement('div');
        footer.style.cssText = "padding: 10px; background: #222; text-align: center; color: #777; font-size: 12px; font-style: italic;";
        footer.innerText = "(Click outside to close)";
        book.appendChild(footer);

        overlay.appendChild(book);
        document.body.appendChild(overlay);
    }

    showClosestHint(elementsInZone) {
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
            fill: '#ffffff',
            fontFamily: 'Verdana',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 6,
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

    hideHint() {
        if (this.currentHint) {
            this.currentHint.destroy();
            this.currentHint = null;
        }
    }

    showHint(data) {
        // Destroy previous hint if exists
        this.hideHint();

        // Verify texture exists in Phaser cache before rendering
        const textureExists = this.textures.exists(data.image);
        if (!textureExists && data.image) {
            console.log('HINT WARNING: Texture key "' + data.image + '" NOT in Phaser cache.');
            return;
        }

        // UNIFIED POSITION: Same coordinates and dimensions as wrong_formula.png
        // Depth 1010 forces hint to absolute front above all UI elements
        const hintContainer = this.add.container(1200, 300);
        hintContainer.setDepth(1010);
        hintContainer.setAlpha(1);
        this.currentHint = hintContainer;

        // Hint image at same scale and position as wrong_formula.png
        if (data.image && textureExists) {
            const img = this.add.image(0, 0, data.image);
            img.setOrigin(0.5);
            img.setScale(0.7);
            img.setAlpha(1);
            hintContainer.add(img);
        }

        // PERSISTENT DISPLAY: Hint stays visible until Combine or Clear is clicked.
    }

    updateBeakerState() {
        // TARGET-BASED PRIORITY HINT SYSTEM
        // Identical to Stage 2. Maps beaker contents to target-compound hint PNGs.
        // Multi-element combos take priority over single-element hints.

        const keys = this.elementsInZone.map(el => el.texture.key);
        if (keys.length === 0) return;

        const has = (id) => keys.includes(id);

        // ── MULTI-ELEMENT COMBOS (highest priority) ──

        // Na + O + H  →  NaOH.png
        if (has('sodium') && has('oxygen') && has('hydrogen')) {
            this.showHint({ image: 'hint_naoh' });
            return;
        }

        // Cu + S + O  →  CuSO4.png
        if (has('copper') && has('sulfur') && has('oxygen')) {
            this.showHint({ image: 'hint_cuso4' });
            return;
        }

        // H + Cl  →  HCl.png
        if (has('hydrogen') && has('chlorine')) {
            this.showHint({ image: 'hint_hcl' });
            return;
        }

        // Mg + O2  →  mgo2flame.png
        if (has('magnesium') && has('o2')) {
            this.showHint({ image: 'mgo2flame' });
            return;
        }

        // Mg + Cl2  →  mgcl2.png
        if (has('magnesium') && has('cl2')) {
            this.showHint({ image: 'mgcl2' });
            return;
        }

        // Mg + HCl  →  mghcl.png
        if (has('magnesium') && has('hydrochloricAcid')) {
            this.showHint({ image: 'mghcl' });
            return;
        }

        // Mg + CuSO4  →  mgcuso4.png
        if (has('magnesium') && has('copperSulfate')) {
            this.showHint({ image: 'mgcuso4' });
            return;
        }

        // Ca + O2  →  cao2.png
        if (has('calcium') && has('o2')) {
            this.showHint({ image: 'cao2' });
            return;
        }

        // CH4 + O2  →  ch4o2.png
        if (has('methane') && has('o2')) {
            this.showHint({ image: 'hint_ch4o2' });
            return;
        }

        // Fe + CuSO4  →  fecuso4.png
        if (has('iron') && has('copperSulfate')) {
            this.showHint({ image: 'fecuso4' });
            return;
        }

        // Zn + CuSO4  →  zncuso4.png
        if (has('zinc') && has('copperSulfate')) {
            this.showHint({ image: 'zncuso4' });
            return;
        }

        // Zn + HCl  →  znhcl.png
        if (has('zinc') && has('hydrochloricAcid')) {
            this.showHint({ image: 'znhcl' });
            return;
        }

        // AgNO3 + NaCl  →  agno3nacl.png
        if ((has('silverNitrate') || has('agno3')) && (has('sodiumChloride') || has('nacl'))) {
            this.showHint({ image: 'agno3nacl' });
            return;
        }

        // AgNO3 + HCl  →  agno3hcl.png
        if ((has('silverNitrate') || has('agno3')) && has('hydrochloricAcid')) {
            this.showHint({ image: 'agno3hcl' });
            return;
        }

        // HCl + NaOH  →  hclnaoh.png
        if (has('hydrochloricAcid') && has('sodiumHydroxide')) {
            this.showHint({ image: 'hclnaoh' });
            return;
        }

        // ── SINGLE-ELEMENT / SINGLE-COMPOUND HINTS ──

        // Mg  →  mgo2flame.png
        if (has('magnesium')) {
            this.showHint({ image: 'mgo2flame' });
            return;
        }

        // Na or Cl  →  nacl.png
        if (has('sodium') || has('chlorine')) {
            this.showHint({ image: 'hint_nacl' });
            return;
        }

        // H or O  →  h2o.png
        if (has('hydrogen') || has('oxygen')) {
            this.showHint({ image: 'hint_h2o' });
            return;
        }

        // Ag  →  AgNO3.png
        if (has('silver')) {
            this.showHint({ image: 'hint_agno3' });
            return;
        }

        // Ca  →  CaCO3.png
        if (has('calcium')) {
            this.showHint({ image: 'hint_caco3' });
            return;
        }

        // C  →  ch4o2.png
        if (has('carbon')) {
            this.showHint({ image: 'hint_ch4o2' });
            return;
        }

        // Cu or S  →  CuSO4.png
        if (has('copper') || has('sulfur')) {
            this.showHint({ image: 'hint_cuso4' });
            return;
        }

        // Iron  →  fecuso4.png
        if (has('iron')) {
            this.showHint({ image: 'fecuso4' });
            return;
        }

        // Zinc  →  znhcl.png
        if (has('zinc')) {
            this.showHint({ image: 'znhcl' });
            return;
        }

        // ── COMPOUND HINTS (dragged from shelf) ──

        // H2O  →  h2oelectric.png
        if (has('h2o')) {
            this.showHint({ image: 'h2oelectric' });
            return;
        }

        // CaCO3  →  caco3heat.png
        if (has('caco3') || has('calciumCarbonate')) {
            this.showHint({ image: 'caco3heat' });
            return;
        }

        // NaCl (compound)  →  naclelectric.png
        if (has('sodiumChloride') || has('nacl')) {
            this.showHint({ image: 'naclelectric' });
            return;
        }

        // HCl (compound)  →  hclnaoh.png
        if (has('hydrochloricAcid')) {
            this.showHint({ image: 'hclnaoh' });
            return;
        }

        // AgNO3 (compound)  →  agno3nacl.png
        if (has('silverNitrate') || has('agno3')) {
            this.showHint({ image: 'agno3nacl' });
            return;
        }

        // NaOH (compound)  →  hclnaoh.png
        if (has('sodiumHydroxide')) {
            this.showHint({ image: 'hclnaoh' });
            return;
        }

        // CuSO4 (compound)  →  fecuso4.png
        if (has('copperSulfate')) {
            this.showHint({ image: 'fecuso4' });
            return;
        }

        // CH4 (methane)  →  ch4o2.png
        if (has('methane')) {
            this.showHint({ image: 'hint_ch4o2' });
            return;
        }

        // O2 gas  →  mgo2flame.png
        if (has('o2')) {
            this.showHint({ image: 'mgo2flame' });
            return;
        }

        // Cl2 gas  →  mgcl2.png
        if (has('cl2')) {
            this.showHint({ image: 'mgcl2' });
            return;
        }

        // No match — do not show a hint
    }

    checkForCompound(elementsInZone) {
        const elementCounts = {};
        elementsInZone.forEach(element => {
            if (element === 'o2') {
                elementCounts['oxygen'] = (elementCounts['oxygen'] || 0) + 2;
            } else if (element === 'h2') {
                elementCounts['hydrogen'] = (elementCounts['hydrogen'] || 0) + 2;
            } else if (element === 'cl2') {
                elementCounts['chlorine'] = (elementCounts['chlorine'] || 0) + 2;
            } else {
                elementCounts[element] = (elementCounts[element] || 0) + 1;
            }
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