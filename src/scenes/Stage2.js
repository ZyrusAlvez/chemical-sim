import { compounds, elements } from '../../data/chemicals.js';
import { compoundInventory } from '../CompoundInventory.js';
import { ReactionSystem } from '../ReactionSystem.js';
import { UIManager } from '../UIManager.js';

export class Stage2 extends Phaser.Scene {

    constructor() {
        super('Stage2');
        this.reactionSystem = new ReactionSystem();
        this.currentHint = null;
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
        this.load.image('btn_combine', 'assets/btn_combine.png');
        this.load.image('btn_combine_pressed', 'assets/btn_combine_pressed.png');
        this.load.image('btn_clear', 'assets/btn_clear.png');
        this.load.image('btn_clear_pressed', 'assets/btn_clear_pressed.png');
        this.load.image('electricbutton', 'assets/electricbutton.png');
        this.load.image('btn_electric_pressed', 'assets/btn_electric_pressed.png');
        this.load.image('btn_initialheat', 'assets/btn_initialheat.png');
        this.load.image('btn_initialheat_pressed', 'assets/btn_initialheat_pressed.png');
        this.load.image('btn_highheat', 'assets/btn_highheat.png');
        this.load.image('btn_highheat_pressed', 'assets/btn_highheat_pressed.png');

        // Load hint speech bubbles (all files from assets/speech/hint/)
        // ── TARGET-COMPOUND HINTS (formula-named, shown proactively) ──
        this.load.image('hint_h2o', 'assets/speech/hint/h2o.png');
        this.load.image('hint_nacl', 'assets/speech/hint/nacl.png');
        this.load.image('hint_naoh', 'assets/speech/hint/NaOH.png');
        this.load.image('hint_agno3', 'assets/speech/hint/AgNO3.png');
        this.load.image('hint_caco3', 'assets/speech/hint/CaCO3.png');
        this.load.image('hint_cuso4', 'assets/speech/hint/CuSO4.png');
        this.load.image('hint_hcl', 'assets/speech/hint/HCl.png');
        this.load.image('hint_ch4o2', 'assets/speech/hint/ch4o2.png');

        // ── REACTION HINTS (shown after combo match or energy guidance) ──
        this.load.image('cao2', 'assets/speech/hint/cao2.png?v=999');
        this.load.image('mgo2flame', 'assets/speech/hint/mgo2flame.png?v=999');
        this.load.image('mgo2', 'assets/speech/hint/mgo2.png?v=999');
        this.load.image('mgcl2', 'assets/speech/hint/mgcl2.png?v=999');
        this.load.image('water', 'assets/speech/hint/water.png');
        // Load compound images and hints dynamically from chemicals.js
        if (typeof compounds !== 'undefined') {
            compounds.forEach(compound => {
                // FORCE SKIP NaCl here so we can load it manually below with explicit path
                if (compound.textureKey === 'sodiumChloride') return;

                // Ensure we don't overwrite if manually loaded, but for hints we want the chemicals.js version
                // Actually Stage 2 relies on specific keys.
                // safer to load hint with _hint suffix like Start.js
                if (compound.hint) {
                    this.load.image(compound.textureKey + '_hint', compound.hint);
                }
            });
        }

        // Force override for NaCl Hint - Use cache buster to ensure update
        this.load.image('sodiumChloride_hint', 'assets/speech/hint/nacl.png?v=999');

        // Manual loads for specific reaction hints not in compounds list (if any)
        this.load.image('h2oelectric', 'assets/speech/hint/h2oelectric.png');
        this.load.image('ch4o2_hint', 'assets/speech/hint/ch4o2.png?v=999');
        this.load.image('copperSulfate_hint', 'assets/speech/hint/copperSulfate.png');
        this.load.image('fecuso4', 'assets/speech/hint/fecuso4.png');
        this.load.image('silverNitrate', 'assets/speech/hint/silverNitrate.png');
        this.load.image('sodiumHydroxide', 'assets/speech/hint/sodiumHydroxide.png');
        this.load.image('znhcl', 'assets/speech/hint/znhcl.png');
        this.load.image('mghcl', 'assets/speech/hint/mghcl.png');
        this.load.image('zncuso4', 'assets/speech/hint/zncuso4.png');
        this.load.image('mgcuso4', 'assets/speech/hint/mgcuso4.png');
        this.load.image('agno3nacl', 'assets/speech/hint/agno3nacl.png');
        this.load.image('agno3hcl', 'assets/speech/hint/agno3hcl.png');
        this.load.image('hclnaoh', 'assets/speech/hint/hclnaoh.png');
        this.load.image('caco3heat', 'assets/speech/hint/caco3heat.png');
        this.load.image('naclelectric', 'assets/speech/hint/naclelectric.png');

        // Alert/Feedback PNGs
        this.load.image('wrong_formula', 'assets/speech/wrong_formula.png');
        this.load.image('already_formulated', 'assets/speech/already_formulated.png');
    }

    create() {
        // VERIFICATION: If you see this alert, the NEW code is loaded!


        // Notify that the game is ready (Hides Skeleton)
        window.dispatchEvent(new Event('game-ready'));

        // Load reactions data
        this.reactionSystem.loadReactions();

        // Load reactions data
        this.reactionSystem.loadReactions();

        // FADE IN (Skeleton Removal)
        if (window.startGameTransition) {
            window.startGameTransition();
        }

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
        this.activeEnergySource = null;
        this.activeEnergySource = null;

        // Generate Compound Slots - RESTORED ORIGINAL LAYOUT + NEW ROW
        // Row 1: 2 items (Right side)
        // Row 2: 5 items (Full width)
        // Row 3: 5 items (New request)
        this.compoundSlots = [
            { x: 415, y: 660 }, { x: 515, y: 660 }, // Original Row 1
            { x: 115, y: 790 }, { x: 215, y: 790 }, { x: 315, y: 790 }, { x: 415, y: 790 }, { x: 515, y: 790 }, // Original Row 2
            { x: 115, y: 910 }, { x: 215, y: 910 }, { x: 315, y: 910 }, { x: 415, y: 910 }, { x: 515, y: 910 }  // New Row 3
        ];

        this.inventoryPage = 0;
        this.itemsPerPage = this.compoundSlots.length;

        this.nextSlotIndex = 0;
        this.createdCompounds = [];
        this.wrongAttempts = 0;

        // Pagination Buttons - Positioned around the grid
        this.pageLeftBtn = this.add.text(50, 850, 'â—€', {
            fontSize: '48px', fill: '#ffffff'
        }).setOrigin(0.5).setInteractive({ cursor: 'pointer' }).setVisible(false);

        this.pageRightBtn = this.add.text(600, 850, 'â–¶', {
            fontSize: '48px', fill: '#ffffff'
        }).setOrigin(0.5).setInteractive({ cursor: 'pointer' }).setVisible(false);

        this.pageLeftBtn.on('pointerdown', () => {
            if (this.inventoryPage > 0) {
                this.inventoryPage--;
                this.renderInventory();
            }
        });

        this.pageRightBtn.on('pointerdown', () => {
            const total = compoundInventory.getCreatedCompounds().length;
            if ((this.inventoryPage + 1) * this.itemsPerPage < total) {
                this.inventoryPage++;
                this.renderInventory();
            }
        });

        // Load existing compounds using pagination render
        this.renderInventory();

        const elementPositions = [
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

        elementPositions.forEach(element => {
            const img = this.add.image(element.x, element.y, element.name).setOrigin(element.originX, element.originY).setScale(element.scale).setInteractive().setDepth(2);
            img.originalX = element.x;
            img.originalY = element.y;
            img.isElement = true;
            this.input.setDraggable(img);
        });

        // Increased drop zone size for better usability
        this.dropZone = this.add.zone(1070, 685, 300, 250).setRectangleDropZone(300, 250);
        this.elementsInZone = [];

        this.setupDragAndDrop();
        this.setupButtons();
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
            compoundInventory.clearShelf();
            this.inventoryPage = 0; // Reset page
            this.renderInventory(); // Function already handles clearing visuals
            this.cameras.main.flash(200, 255, 0, 0);
        });

        this.prevStageBtn = this.add.image(1500, 950, 'previousstagebutton').setOrigin(1, 1).setScale(0.2).setInteractive({ cursor: 'pointer' });

        this.prevStageBtn.on('pointerdown', () => {
            // Button Click Effect
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


        // ── STRICT UI NAVIGATION (DOM-based) ──
        this.uiManager = new UIManager(this);

        // Load history for Journal
        const savedHistory = window.sessionStorage.getItem('chemSimHistory');
        this.history = savedHistory ? JSON.parse(savedHistory) : [];
        this.historyPanelOpen = false;

        this.uiManager.createNavbar({
            onExit: () => {
                window.location.href = 'index.html?showThanks=true';
            },
            onJournal: () => {
                this.toggleHistory();
            },
            onTutorial: () => {
                this.scene.start('Tutorial', { from: 'Stage2' });
            },
            onRecipes: () => {
                this.toggleRecipeBook();
            }
        });
    }

    toggleRecipeBook() {
        const existing = document.getElementById('recipe-book-overlay');
        if (existing) { existing.remove(); return; }

        const discoveryCount = compoundInventory.getDiscoveryCount();

        // 6 recipe sections — grouped unlock at 5, 10, 15
        const sections = [
            {
                title: 'Synthesis', icon: '\u2697\uFE0F', color: '#2980b9', tier: 0, recipes: [
                    { name: 'Water (H\u2082O)', formula: 'H + H + O' },
                    { name: 'Hydrochloric Acid (HCl)', formula: 'H + Cl' },
                    { name: 'Sodium Hydroxide (NaOH)', formula: 'Na + O + H' },
                    { name: 'Sodium Chloride (NaCl)', formula: 'Na + Cl' },
                    { name: 'Methane (CH\u2084)', formula: 'C + 4H' },
                    { name: 'Carbon Dioxide (CO\u2082)', formula: 'C + O\u2082  or  C + 2O' },
                    { name: 'Calcium Carbonate (CaCO\u2083)', formula: 'Ca + C + 3O' },
                    { name: 'Copper Sulfate (CuSO\u2084)', formula: 'Cu + S + 4O' },
                    { name: 'Silver Nitrate (AgNO\u2083)', formula: 'Ag + N + 3O' },
                    { name: 'Iron Oxide (Fe\u2082O\u2083)', formula: '4Fe + 3O\u2082 \u2192 2Fe\u2082O\u2083' },
                    { name: 'Magnesium Chloride (MgCl\u2082)', formula: 'Mg + Cl\u2082' },
                    { name: 'Calcium Oxide (CaO)', formula: '2Ca + O\u2082 \u2192 2CaO' },
                ]
            },
            {
                title: 'Decomposition', icon: '\uD83D\uDCA5', color: '#c0392b', tier: 5, recipes: [
                    { name: '2H\u2082O \u2192 2H\u2082 + O\u2082', formula: 'H\u2082O + Electricity' },
                    { name: '2NaCl \u2192 2Na + Cl\u2082', formula: 'NaCl + Electricity' },
                    { name: 'CaCO\u2083 \u2192 CaO + CO\u2082', formula: 'CaCO\u2083 + High Heat' },
                ]
            },
            {
                title: 'Single Displacement', icon: '\u2194\uFE0F', color: '#8e44ad', tier: 10, recipes: [
                    { name: 'Zn + HCl \u2192 ZnCl\u2082 + H\u2082', formula: 'Zinc + Hydrochloric Acid' },
                    { name: 'Mg + 2HCl \u2192 MgCl\u2082 + H\u2082', formula: 'Magnesium + Hydrochloric Acid' },
                    { name: 'Fe + CuSO\u2084 \u2192 FeSO\u2084 + Cu', formula: 'Iron + Copper Sulfate' },
                    { name: 'Zn + CuSO\u2084 \u2192 ZnSO\u2084 + Cu', formula: 'Zinc + Copper Sulfate' },
                ]
            },
            {
                title: 'Double Displacement', icon: '\uD83D\uDD00', color: '#d35400', tier: 10, recipes: [
                    { name: 'AgNO\u2083 + NaCl \u2192 AgCl + NaNO\u2083', formula: 'Silver Nitrate + Sodium Chloride' },
                    { name: 'AgNO\u2083 + HCl \u2192 AgCl + HNO\u2083', formula: 'Silver Nitrate + Hydrochloric Acid' },
                ]
            },
            {
                title: 'Neutralization', icon: '\u2696\uFE0F', color: '#16a085', tier: 15, recipes: [
                    { name: 'HCl + NaOH \u2192 NaCl + H\u2082O', formula: 'Hydrochloric Acid + Sodium Hydroxide' },
                ]
            },
            {
                title: 'Combustion', icon: '\uD83D\uDD25', color: '#e67e22', tier: 15, recipes: [
                    { name: 'Mg + O\u2082 \u2192 MgO', formula: 'Magnesium + Oxygen Gas + Heat' },
                    { name: 'CH\u2084 + 2O\u2082 \u2192 CO\u2082 + 2H\u2082O', formula: 'Methane + Oxygen Gas' },
                ]
            },
        ];

        // OVERLAY
        const overlay = document.createElement('div');
        overlay.id = 'recipe-book-overlay';
        overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:1020;display:flex;justify-content:center;align-items:center;';
        overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };

        // BOOK (Lab Manual Theme — Blue/White)
        const book = document.createElement('div');
        book.style.cssText = 'width:540px;max-height:450px;background:#f5f7fa;border:2px solid #2980b9;border-radius:10px;display:flex;flex-direction:column;overflow:hidden;font-family:Verdana,sans-serif;box-shadow:0 8px 32px rgba(41,128,185,0.3);';

        // HEADER
        const header = document.createElement('div');
        header.style.cssText = 'background:#2980b9;color:#fff;padding:14px 20px;font-weight:bold;font-size:18px;display:flex;justify-content:space-between;align-items:center;';
        header.innerHTML = '<span>\uD83D\uDCD6 LAB MANUAL</span><span style="font-size:13px;opacity:0.85">Discovered: ' + discoveryCount + '</span>';

        // SCROLLABLE LIST
        const list = document.createElement('div');
        list.style.cssText = 'flex:1;overflow-y:auto;padding:16px 20px;';

        const renderRecipe = (r) => '<div style="margin-bottom:10px;padding-bottom:10px;border-bottom:1px solid #dce1e8;"><div style="color:#2c3e50;font-weight:bold;font-size:14px;margin-bottom:3px;">' + r.name + '</div><div style="color:#7f8c8d;font-size:13px;">' + r.formula + '</div></div>';

        const renderLocked = (needed, nextSection) => '<div style="background:rgba(41,128,185,0.08);border:1px dashed #2980b9;padding:14px;text-align:center;color:#2980b9;border-radius:6px;margin-bottom:10px;"><div>\uD83D\uDD12 LOCKED</div><div style="font-size:11px;margin-top:4px;">Discover ' + needed + ' compounds to unlock ' + nextSection + '</div></div>';

        sections.forEach(sec => {
            list.innerHTML += '<h3 style="color:' + sec.color + ';font-weight:bold;margin:18px 0 10px 0;border-bottom:2px solid ' + sec.color + ';padding-bottom:4px;font-size:15px;">' + sec.icon + ' ' + sec.title + '</h3>';
            if (discoveryCount >= sec.tier) {
                sec.recipes.forEach(r => { list.innerHTML += renderRecipe(r); });
            } else {
                list.innerHTML += renderLocked(sec.tier, sec.title);
            }
        });

        // FOOTER
        const footer = document.createElement('div');
        footer.style.cssText = 'padding:8px;background:#eaecf0;text-align:center;color:#95a5a6;font-size:11px;font-style:italic;';
        footer.innerText = '(Click outside to close)';

        book.appendChild(header);
        book.appendChild(list);
        book.appendChild(footer);
        overlay.appendChild(book);
        document.body.appendChild(overlay);
    }

    showMissionMessage(msg) {
        const missionBox = document.createElement('div');
        missionBox.style.cssText = `
            position: absolute; top: 15%; left: 50%; transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8); border: 2px solid #3498db;
            color: #ecf0f1; padding: 20px 40px; font-family: 'Verdana', sans-serif;
            font-size: 20px; font-weight: bold; border-radius: 10px;
            box-shadow: 0 0 20px rgba(52, 152, 219, 0.5); z-index: 1050;
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



    setupDragAndDrop() {
        this.input.on('dragstart', (pointer, gameObject) => {
            gameObject.setDepth(5000); // SUPER TOP PRIORITY
            gameObject.setAlpha(0.7); // Semi-transparent during drag
            // TEXT FIX: Do not drag the label visually, or keep it attached but ensure it doesn't clone.
            if (gameObject.labelText) {
                gameObject.labelText.setAlpha(0.7);
            }
        });

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
            if (gameObject.labelText) {
                gameObject.labelText.x = dragX;
                gameObject.labelText.y = dragY + 50;
            }
        });

        this.input.on('drop', (pointer, gameObject, dropZone) => {
            // Position items within the beaker bounds
            const beakerCenterX = 1070;
            const beakerCenterY = 685;
            const offsetX = Phaser.Math.Between(-80, 80);
            const offsetY = Phaser.Math.Between(-40, 50);

            // TEXT FIX: Create ONLY the image. explicit texture key.
            // Do NOT clone children or labels.
            const copy = this.add.image(beakerCenterX + offsetX, beakerCenterY + offsetY, gameObject.texture.key)
                .setOrigin(0.5, 0.5)
                .setScale(0.12)
                .setData('textureKey', gameObject.texture.key);

            // Ensure no label logic is attached to 'copy'
            this.elementsInZone.push(copy);
            copy.inDropZone = true;

            this.tweens.add({
                targets: gameObject,
                x: gameObject.originalX,
                y: gameObject.originalY,
                duration: 300,
                ease: 'Power2',
                onComplete: () => {
                    gameObject.setDepth(2); // Reset depth after tween back
                    gameObject.setAlpha(1); // Restore full opacity
                    if (gameObject.labelText) {
                        gameObject.labelText.setAlpha(1);
                        gameObject.labelText.x = gameObject.originalX;
                        gameObject.labelText.y = gameObject.originalY + 50;
                    }
                }
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

            copy.floatTween = this.tweens.add({
                targets: copy,
                y: copy.y - 15,
                duration: 2000,
                ease: 'Sine.easeInOut',
                yoyo: true,
                repeat: -1
            });

            // Hints are now ONLY triggered by 3-error rule on combine, not placement
        });

        this.input.on('dragend', (pointer, gameObject) => {
            if (!gameObject.inDropZone) {
                this.tweens.add({
                    targets: gameObject,
                    x: gameObject.originalX,
                    y: gameObject.originalY,
                    duration: 300,
                    ease: 'Power2',
                    onComplete: () => {
                        gameObject.setDepth(2);
                        gameObject.setAlpha(1);
                        if (gameObject.labelText) {
                            gameObject.labelText.setAlpha(1);
                            gameObject.labelText.x = gameObject.originalX;
                            gameObject.labelText.y = gameObject.originalY + 50;
                        }
                    }
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
            } else {
                // Was dropped successfully (clone created), logic handled in drop.
                // Just reset the original item.
                gameObject.inDropZone = false;
                gameObject.setDepth(2);
                gameObject.setAlpha(1);
                if (gameObject.labelText) {
                    gameObject.labelText.setAlpha(1);
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

            try {
                // CLEAR ANY VISIBLE HINT before showing result
                this.hideHint();

                const elementsInZone = this.elementsInZone.map(element => element.texture.key);

                // Save energy source BEFORE resetting buttons
                const savedEnergySource = this.activeEnergySource;

                // RESET ENERGY BUTTONS immediately after combine press
                this.resetEnergyButtons();

                // NEGATIVE GUARD CLAUSE: Mg + O2 without Initial Heat
                // This is checked FIRST, before findReaction, so it can never bypass.
                const hasMg = elementsInZone.includes('magnesium');
                const hasO2 = elementsInZone.includes('o2');
                if (hasMg && hasO2 && savedEnergySource !== 'initial_heat') {
                    this.wrongAttempts++;
                    if (this.wrongAttempts >= 3) {
                        this.updateBeakerState();
                        this.wrongAttempts = 0;
                    } else {
                        this.showWrongFormulaMessage();
                    }
                    this.time.delayedCall(2000, () => {
                        this.combineBtn.setVisible(true);
                        this.combineBtnPressed.setVisible(false);
                        this.combineBtn.setInteractive();
                        this.buttonPressed = false;
                    });
                    return;
                }

                // ===== PRIORITY 1: RECIPE CHECK =====
                // Find matching reaction using the SAVED energy source
                const reaction = this.reactionSystem.findReaction(elementsInZone, savedEnergySource);

                if (!reaction && elementsInZone.length > 0) {
                    // No recipe matches at all
                    this.wrongAttempts++;
                    if (this.wrongAttempts >= 3) {
                        this.updateBeakerState();
                        this.wrongAttempts = 0;
                    } else {
                        this.showWrongFormulaMessage();
                    }
                    this.time.delayedCall(2000, () => {
                        this.combineBtn.setVisible(true);
                        this.combineBtnPressed.setVisible(false);
                        this.combineBtn.setInteractive();
                        this.buttonPressed = false;
                    });
                    return;
                }

                if (reaction) {
                    // ===== PRIORITY 2: ENERGY GATE =====
                    const requiredEnergy = this.reactionSystem.getRequiredEnergy(reaction);

                    if (requiredEnergy && savedEnergySource !== requiredEnergy) {
                        // Recipe valid but wrong/missing energy
                        this.wrongAttempts++;
                        if (this.wrongAttempts >= 3) {
                            this.updateBeakerState();
                            this.wrongAttempts = 0;
                        } else {
                            this.showWrongFormulaMessage();
                        }
                        this.time.delayedCall(2000, () => {
                            this.combineBtn.setVisible(true);
                            this.combineBtnPressed.setVisible(false);
                            this.combineBtn.setInteractive();
                            this.buttonPressed = false;
                        });
                        return;
                    }

                    // Get products
                    const products = this.reactionSystem.getProducts(reaction);



                    // ===== PRIORITY 3: DUPLICATE CHECK =====
                    // Gas compounds (H2, O2, Cl2) are allowed as duplicates
                    const gasNames = ['Hydrogen Gas', 'Oxygen Gas', 'Chlorine Gas'];
                    if (products.length > 0) {
                        const mainProduct = products[0];
                        if (!gasNames.includes(mainProduct.name) && compoundInventory.hasCompound(mainProduct.name)) {
                            // Already discovered (non-gas)!
                            this.showAlreadyFormulatedMessage();
                            this.time.delayedCall(2000, () => {
                                this.combineBtn.setVisible(true);
                                this.combineBtnPressed.setVisible(false);
                                this.combineBtn.setInteractive();
                                this.buttonPressed = false;
                            });
                            return;
                        }
                    }

                    // ALL CHECKS PASSED -> Show reaction result
                    this.wrongAttempts = 0;
                    this.showReactionResult(reaction);
                }
            } catch (error) {
                console.error('CRITICAL ERROR in combineBtn:', error);
                this.time.delayedCall(500, () => {
                    this.combineBtn.setVisible(true);
                    this.combineBtnPressed.setVisible(false);
                    this.combineBtn.setInteractive();
                    this.buttonPressed = false;
                });
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
            this.hideHint(); // CLEAR HINTS
            this.activeEnergySource = null;

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
            this.activeEnergySource = 'initial_heat';
            this.showLowHeatEffect();

            // Hints are now ONLY triggered by 3-error rule on combine

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
            this.activeEnergySource = 'electricity';
            this.showElectricEffect();

            // Hints are now ONLY triggered by 3-error rule on combine

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
            this.activeEnergySource = 'high_heat';
            this.showHighHeatEffect();

            // Hints are now ONLY triggered by 3-error rule on combine

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

        for (let i = 0; i < 3; i++) {
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
                duration: 3500,
                delay: i * 400,
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
        compoundInventory.addCompound(compound.name);
        this.showCongratsScreen(compound);
        // Refresh entire inventory to handle pagination/sorting
        this.renderInventory();

        // CHECK MILESTONES (5-10-15 grouped unlock system)
        const discoveryCount = compoundInventory.getDiscoveryCount();
        const TOTAL_RECIPES = 20; // Total unique non-gas compounds discoverable

        if (discoveryCount >= 5 && !compoundInventory.hasShownBronze) {
            compoundInventory.hasShownBronze = true;
            this.time.delayedCall(2000, () => {
                this.showAchievementBadge('bronze');
                this.showMissionMessage('BRONZE ALCHEMIST! Decomposition unlocked! Discover 5 more to learn Displacement!');
            });
        }
        if (discoveryCount >= 10 && !compoundInventory.hasShownSilver) {
            compoundInventory.hasShownSilver = true;
            this.time.delayedCall(2000, () => {
                this.showAchievementBadge('silver');
                this.showMissionMessage('SILVER CHEMIST! Displacement unlocked! Discover 5 more to reach the final tier!');
            });
        }

        // Gold Master Alchemist — triggers when ALL unique recipes found
        if (discoveryCount >= TOTAL_RECIPES && !compoundInventory.isMasterUnlocked) {
            compoundInventory.isMasterUnlocked = true;
            this.time.delayedCall(2500, () => {
                this.showAchievementBadge('master');
                this.showMissionMessage('GOLD MASTER ALCHEMIST! Every recipe discovered!');
            });
        }
    }

    showAchievementBadge(tier) {
        // DOM-BASED CSS ACHIEVEMENT BADGE — non-blocking, top-center, z-index 1050
        const config = {
            bronze: { css: 'badge-bronze', symbol: '5', label: 'BRONZE ALCHEMIST' },
            silver: { css: 'badge-silver', symbol: '10', label: 'SILVER CHEMIST' },
            master: { css: 'badge-master', symbol: '\u2605', label: 'GOLD MASTER ALCHEMIST' }
        }[tier];

        // Create badge container
        const wrapper = document.createElement('div');
        wrapper.className = `achievement-badge ${config.css}`;
        wrapper.innerHTML = `
            <div class="badge-circle">${config.symbol}</div>
            <div class="badge-label">${config.label}</div>
        `;
        document.body.appendChild(wrapper);

        // Master: add sparkle screen overlay
        let sparkleOverlay = null;
        if (tier === 'master') {
            sparkleOverlay = document.createElement('div');
            sparkleOverlay.className = 'sparkle-overlay';

            // Generate star particles
            const starColors = ['#FFD700', '#FFFFFF', '#FFF8DC', '#FFE4B5', '#FFC107', '#FFEB3B'];
            for (let i = 0; i < 50; i++) {
                const star = document.createElement('div');
                star.className = 'sparkle-star';
                star.style.left = `${Math.random() * 100}%`;
                star.style.top = `${Math.random() * 100}%`;
                star.style.backgroundColor = starColors[Math.floor(Math.random() * starColors.length)];
                star.style.width = `${4 + Math.random() * 8}px`;
                star.style.height = star.style.width;
                star.style.setProperty('--duration', `${0.6 + Math.random() * 1.4}s`);
                star.style.setProperty('--delay', `${Math.random() * 2}s`);
                sparkleOverlay.appendChild(star);
            }
            document.body.appendChild(sparkleOverlay);
        }

        // Fade out after 4 seconds, remove after animation
        setTimeout(() => {
            wrapper.classList.add('fade-out');
            setTimeout(() => {
                wrapper.remove();
                if (sparkleOverlay) sparkleOverlay.remove();
            }, 600);
        }, 4000);
    }

    // New method to render full inventory page
    renderInventory() {
        this.clearInventoryUI();

        const allCompounds = compoundInventory.getCreatedCompounds();
        // Sort if needed? No, chronological is fine.

        const start = this.inventoryPage * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        const pageItems = allCompounds.slice(start, end);

        this.nextSlotIndex = 0;

        pageItems.forEach(compoundName => {
            const compound = compounds.find(c => c.name === compoundName);
            if (compound) {
                this.displayCompoundInInventory(compound);
            }
        });

        this.updatePaginationButtons(allCompounds.length);
    }

    clearInventoryUI() {
        this.createdCompounds.forEach(item => {
            if (item.labelText) item.labelText.destroy();
            item.destroy();
        });
        this.createdCompounds = [];
    }

    updatePaginationButtons(totalCount) {
        this.pageLeftBtn.setVisible(this.inventoryPage > 0);
        this.pageRightBtn.setVisible((this.inventoryPage + 1) * this.itemsPerPage < totalCount);
    }

    loadExistingCompounds() {
        // Deprecated, use renderInventory()
        this.renderInventory();
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

        // PERSISTENT DISPLAY: No auto-expire timer.
        // Hint stays visible until Combine or Clear is clicked.
    }

    updateBeakerState() {
        // TARGET-BASED PRIORITY HINT SYSTEM
        // Maps beaker contents to target-compound hint PNGs.
        // Multi-element combos take priority over single-element hints.
        // Only uses files verified in /hints/ folder.

        const keys = this.elementsInZone.map(el => el.texture.key);
        if (keys.length === 0) return;

        // Helper: check if any of the texture keys match
        const has = (id) => keys.includes(id);

        // ══════════════════════════════════════════════════
        // PRIORITY RULES (checked top-to-bottom, first wins)
        // Multi-element combos MUST come before single-element.
        // ══════════════════════════════════════════════════

        // ── MULTI-ELEMENT COMBOS (highest priority) ──

        // Na + O + H  →  NaOH.png  (takes priority over h2o or nacl)
        if (has('sodium') && has('oxygen') && has('hydrogen')) {
            this.showHint({ image: 'hint_naoh' });
            return;
        }

        // H + Cl  →  HCl.png
        if (has('hydrogen') && has('chlorine')) {
            this.showHint({ image: 'hint_hcl' });
            return;
        }

        // Mg + O2  →  mgo2flame.png (combustion hint)
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

        // Mg  →  mgo2flame.png (combustion target)
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

        // Ag (silver element)  →  AgNO3.png
        if (has('silver')) {
            this.showHint({ image: 'hint_agno3' });
            return;
        }

        // Ca  →  CaCO3.png
        if (has('calcium')) {
            this.showHint({ image: 'hint_caco3' });
            return;
        }

        // C  →  ch4o2.png (methane combustion target)
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

        // Zinc  ->  zncuso4.png (do NOT show znhcl when only zinc is present)
        if (has('zinc')) {
            this.showHint({ image: 'zncuso4' });
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

        // NaCl (compound from shelf)  →  naclelectric.png
        if (has('sodiumChloride') || has('nacl')) {
            this.showHint({ image: 'naclelectric' });
            return;
        }

        // HCl (compound from shelf)  →  hclnaoh.png
        if (has('hydrochloricAcid')) {
            this.showHint({ image: 'hclnaoh' });
            return;
        }

        // AgNO3 (compound from shelf)  →  agno3nacl.png
        if (has('silverNitrate') || has('agno3')) {
            this.showHint({ image: 'agno3nacl' });
            return;
        }

        // NaOH (compound from shelf)  →  hclnaoh.png
        if (has('sodiumHydroxide')) {
            this.showHint({ image: 'hclnaoh' });
            return;
        }

        // CuSO4 (compound from shelf)  →  fecuso4.png
        if (has('copperSulfate')) {
            this.showHint({ image: 'fecuso4' });
            return;
        }

        // CH4 (methane from shelf)  →  ch4o2.png
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

    // Centralized energy button reset - called after every combine press
    resetEnergyButtons() {
        // Reset all energy visual states to unpressed
        this.initialHeatBtn.setVisible(true);
        this.initialHeatBtnPressed.setVisible(false);
        this.initialHeatBtn.setInteractive();
        this.initialHeatButtonPressed = false;

        this.highHeatBtn.setVisible(true);
        this.highHeatBtnPressed.setVisible(false);
        this.highHeatBtn.setInteractive();
        this.highHeatButtonPressed = false;

        this.electricBtn.setVisible(true);
        this.electricBtnPressed.setVisible(false);
        this.electricBtn.setInteractive();
        this.electricButtonPressed = false;

        // Clear energy source and visual effects
        this.hideAllAnimations();
        this.activeEnergySource = null;
    }

    showWrongFormulaMessage() {
        this.input.enabled = false;
        this.scientist.setTexture('shock');

        const wrongFormulaImg = this.add.image(1200, 300, 'wrong_formula')
            .setOrigin(0.5)
            .setScale(0.7)
            .setDepth(999);

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
            .setDepth(999);

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
        this.hideHint(); // Hide hint when beaker is cleared
    }




    playReactionEffect(reaction, callback) {
        this.input.enabled = false;

        const animKey = reaction.animation_key;
        // Use the correct beaker position (where elements float)
        const beakerX = 1760;
        const beakerY = 580;



        // Different effects based on animation key
        if (animKey === 'bubble' || animKey === 'rapidBubble' || animKey === 'electricityHigh') {
            // Bubble effect
            const bubbleCount = animKey === 'rapidBubble' ? 20 : 10;

            for (let i = 0; i < bubbleCount; i++) {
                this.time.delayedCall(i * 100, () => {
                    const bubble = this.add.circle(
                        beakerX + Phaser.Math.Between(-50, 50),
                        beakerY + Phaser.Math.Between(0, 100),
                        Phaser.Math.Between(5, 15),
                        0xFFFFFF,
                        0.7
                    ).setDepth(100);

                    this.tweens.add({
                        targets: bubble,
                        y: beakerY - 200,
                        alpha: 0,
                        duration: 1500,
                        onComplete: () => bubble.destroy()
                    });
                });
            }

            this.time.delayedCall(2500, callback);

        } else if (animKey === 'initialHeat' || animKey === 'brightFlame' || animKey === 'blueFlame') {
            // Flash/Flame effect
            const isBlue = animKey === 'blueFlame';
            const flameColor = isBlue ? 0x0088FF : 0xFFAA00; // Blue or Orange

            const flash = this.add.rectangle(beakerX, beakerY, 200, 200, 0xFFFFFF, 1)
                .setDepth(100);

            this.tweens.add({
                targets: flash,
                alpha: 0,
                scale: 2,
                duration: 800, // Faster (was 1000)
                onComplete: () => flash.destroy()
            });

            // Add flame particles
            for (let i = 0; i < 15; i++) {
                this.time.delayedCall(i * 50, () => {
                    const flame = this.add.circle(
                        beakerX + Phaser.Math.Between(-30, 30),
                        beakerY + Phaser.Math.Between(-20, 20),
                        Phaser.Math.Between(8, 20),
                        flameColor,
                        0.8
                    ).setDepth(100);

                    this.tweens.add({
                        targets: flame,
                        y: beakerY - 150,
                        alpha: 0,
                        duration: 600, // Faster (was 800)
                        onComplete: () => flame.destroy()
                    });
                });
            }

            this.time.delayedCall(1200, callback); // Faster (was 2000)

        } else if (animKey === 'highHeat') {
            // High heat with gas release

            const heat = this.add.rectangle(beakerX, beakerY, 150, 150, 0xFF4400, 0.6)
                .setDepth(100);

            this.tweens.add({
                targets: heat,
                alpha: 0,
                scale: 1.5,
                duration: 1500,
                onComplete: () => heat.destroy()
            });

            // Gas bubbles
            for (let i = 0; i < 12; i++) {
                this.time.delayedCall(i * 120, () => {
                    const gas = this.add.circle(
                        beakerX + Phaser.Math.Between(-40, 40),
                        beakerY + Phaser.Math.Between(0, 80),
                        Phaser.Math.Between(10, 20),
                        0xCCCCCC,
                        0.5
                    ).setDepth(100);

                    this.tweens.add({
                        targets: gas,
                        y: beakerY - 180,
                        alpha: 0,
                        duration: 1200,
                        onComplete: () => gas.destroy()
                    });
                });
            }

            this.time.delayedCall(2200, callback);

        } else if (animKey === 'solutionFade') {
            // Solution fades Blue -> Clear (e.g. Zn + CuSO4)
            // Create a blue circle representing the solution
            const solution = this.add.circle(beakerX, beakerY, 80, 0x3498db, 0.6)
                .setDepth(100);

            this.tweens.add({
                targets: solution,
                alpha: 0,
                duration: 1000,
                onComplete: () => solution.destroy()
            });

            this.time.delayedCall(1200, callback);

        } else if (animKey === 'precipitate') {
            // Milk-white Precipitate (AgNO3 + NaCl)
            const particles = [];
            for (let i = 0; i < 30; i++) {
                const p = this.add.circle(
                    beakerX + Phaser.Math.Between(-40, 40),
                    beakerY + Phaser.Math.Between(-30, 30),
                    Phaser.Math.Between(3, 8),
                    0xFFFFFF,
                    0.9
                ).setDepth(100);
                particles.push(p);

                this.tweens.add({
                    targets: p,
                    y: beakerY + 50 + Phaser.Math.Between(-10, 10), // Fall down slightly
                    alpha: 0.2, // Fade out partially
                    duration: 1500,
                    ease: 'Quad.easeOut',
                    onComplete: () => p.destroy()
                });
            }
            this.time.delayedCall(1500, callback);

        } else if (animKey === 'cloudyParticles') {
            // White Cloudy Particles (AgNO3 + HCl)
            const particles = [];
            for (let i = 0; i < 25; i++) {
                const cloud = this.add.circle(
                    beakerX + Phaser.Math.Between(-50, 50),
                    beakerY + Phaser.Math.Between(-40, 40),
                    Phaser.Math.Between(10, 20),
                    0xEEEEEE,
                    0.6 // Semi-transparent cloud
                ).setDepth(100);
                particles.push(cloud);

                this.tweens.add({
                    targets: cloud,
                    scale: 1.5,
                    alpha: 0,
                    duration: 1800,
                    ease: 'Sine.easeInOut',
                    onComplete: () => cloud.destroy()
                });
            }
            this.time.delayedCall(1500, callback);

        } else if (animKey === 'colorChange') {
            // Color change effect (e.g. Fe + CuSO4) - Rust/Brown
            const glow = this.add.circle(beakerX, beakerY, 80, 0xD45500, 0.6)
                .setDepth(100);

            this.tweens.add({
                targets: glow,
                scale: 2.5,
                alpha: 0,
                duration: 800, // Fast fade
                onComplete: () => glow.destroy()
            });

            this.time.delayedCall(1000, callback); // Fast callback

        } else {
            // Default effect - simple glow

            const glow = this.add.circle(beakerX, beakerY, 80, 0x00FF00, 0.5)
                .setDepth(100);

            this.tweens.add({
                targets: glow,
                scale: 2,
                alpha: 0,
                duration: 800, // Faster (was 1500)
                onComplete: () => glow.destroy()
            });

            this.time.delayedCall(1000, callback); // Faster (was 1800)
        }
    }


    showReactionResult(reaction) {
        this.hideHint();

        // 1. Add to history for ALL reaction types
        this.addToHistory(reaction);

        // 2. Unlock Products on Shelf & Check Milestones
        reaction.products.forEach(productSymbol => {
            const compound = compounds.find(c => c.symbol === productSymbol);
            if (compound) {
                // addCompound handles duplicates (blocks non-gas, allows gas) and capacity
                const added = compoundInventory.addCompound(compound.name);
                if (added) {
                    this.displayCompoundInInventory(compound);
                }
            }
        });

        // CHECK MILESTONES (5-10-15 grouped unlock system)
        const discoveryCount = compoundInventory.getDiscoveryCount();
        const TOTAL_RECIPES = 20;

        if (discoveryCount >= 5 && !compoundInventory.hasShownBronze) {
            compoundInventory.hasShownBronze = true;
            this.time.delayedCall(2000, () => {
                this.showAchievementBadge('bronze');
                this.showMissionMessage('BRONZE ALCHEMIST! Decomposition unlocked! Discover 5 more to learn Displacement!');
            });
        }
        if (discoveryCount >= 10 && !compoundInventory.hasShownSilver) {
            compoundInventory.hasShownSilver = true;
            this.time.delayedCall(2000, () => {
                this.showAchievementBadge('silver');
                this.showMissionMessage('SILVER CHEMIST! Displacement unlocked! Discover 5 more to reach the final tier!');
            });
        }

        // Gold Master Alchemist — triggers when ALL unique recipes found
        if (discoveryCount >= TOTAL_RECIPES && !compoundInventory.isMasterUnlocked) {
            compoundInventory.isMasterUnlocked = true;
            this.time.delayedCall(2500, () => {
                this.showAchievementBadge('master');
                this.showMissionMessage('GOLD MASTER ALCHEMIST! Every recipe discovered!');
            });
        }

        // 3. Handle SYNTHESIS - Show full celebration screen (ALL products including gases)
        if (reaction.type === 'synthesis') {
            // Find the first compound product
            const newCompound = reaction.products
                .map(symbol => compounds.find(c => c.symbol === symbol))
                .find(c => c !== undefined);

            if (newCompound) {
                // Full Celebration for ALL synthesis products (including O2, Cl2, H2)
                this.showCongratsScreen(newCompound);
            }
            return;
        }

        // 4. Handle NON-SYNTHESIS (Decomposition, etc) - Show Reaction Analysis Screen

        // Clear beaker immediately after reaction
        this.elementsInZone.forEach(element => {
            if (element.floatTween) element.floatTween.destroy();
            element.destroy();
        });
        this.elementsInZone = [];

        // Pause bubbles during analysis screen
        if (this.bubbleTimer) {
            this.bubbleTimer.paused = true;
        }

        // Background (Readable Slate)
        const resultBg = this.add.rectangle(928, 522, 3000, 3000, 0x1a2530, 0.95)
            .setOrigin(0.5)
            .setDepth(1000)
            .setInteractive();

        // Title
        const titleText = this.add.text(928, 200, 'Reaction Analysis', {
            fontSize: '48px',
            fill: '#ffffff',
            fontStyle: 'bold',
            stroke: '#2c3e50',
            strokeThickness: 6
        }).setOrigin(0.5).setDepth(1001);

        // Type
        const typeText = this.add.text(928, 280, `Type: ${reaction.type.toUpperCase()}`, {
            fontSize: '34px',
            fill: '#3498db',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5).setDepth(1001);

        // Balanced Equation
        const equationText = this.add.text(928, 380, reaction.equation, {
            fontSize: '44px',
            fill: '#ecf0f1',
            fontFamily: 'Verdana, sans-serif',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4,
            backgroundColor: '#2c3e50',
            padding: { x: 30, y: 20 }
        }).setOrigin(0.5).setDepth(1001);


        // Products
        const productsStr = reaction.products.map(p => p.replace(/_c$/, '')).join(' + ');
        const productsText = this.add.text(928, 500, `Products: ${productsStr}`, {
            fontSize: '38px',
            fill: '#2ecc71',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5).setDepth(1001);

        // Play VFX at products position
        let vfxTimer = null;
        if (reaction.product_effect) {
            this.playProductEffect(reaction.product_effect, 928, 500);
            // Loop the effect every 2 seconds while screen is open
            vfxTimer = this.time.addEvent({
                delay: 2000,
                callback: () => {
                    if (resultBg.active) {
                        this.playProductEffect(reaction.product_effect, 928, 500);
                    }
                },
                loop: true
            });
        }

        // Energy (if applicable)
        let energyText = null;
        if (reaction.energy_source) {
            let energyName = reaction.energy_source;
            if (energyName === 'initial_heat') energyName = 'Initial Heat';
            else if (energyName === 'electricity') energyName = 'Electricity';
            else if (energyName === 'high_heat') energyName = 'High Heat';

            energyText = this.add.text(928, 600, `⚡ Energy Required: ${energyName}`, {
                fontSize: '28px',
                fill: '#e67e22',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 3
            }).setOrigin(0.5).setDepth(1001);
        }

        // Continue
        const continueText = this.add.text(928, 720, 'Click anywhere to continue', {
            fontSize: '26px',
            fill: '#95a5a6',
            fontStyle: 'italic',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5).setDepth(1001);

        this.tweens.add({
            targets: continueText, alpha: 0.5, duration: 800, yoyo: true, repeat: -1
        });

        // Dismiss
        const dismissDisplay = () => {
            if (resultBg.active) {
                resultBg.destroy();
                titleText.destroy();
                typeText.destroy();
                equationText.destroy();
                productsText.destroy();
                if (energyText) energyText.destroy();
                continueText.destroy();

                // Stop VFX timer
                if (vfxTimer) {
                    vfxTimer.remove();
                }

                // Resume bubbles after dismissing
                if (this.bubbleTimer) {
                    this.bubbleTimer.paused = false;
                }
            }
        };

        resultBg.on('pointerdown', dismissDisplay);
        this.time.delayedCall(10000, dismissDisplay);
    }


    getRequiredEnergySource(elementsInZone) {
        // Check if any element requires energy
        for (const elementKey of elementsInZone) {
            const element = elements.find(e => e.textureKey === elementKey);
            if (element && element.energySource) {
                return element.energySource;
            }

            // Check if it's a compound that requires energy
            const compound = compounds.find(c => c.textureKey === elementKey);
            if (compound && compound.energySource) {
                // Map compound energy source to our button types
                if (compound.energySource.includes('electricity')) {
                    return 'electricity';
                } else if (compound.energySource.includes('heat (high)')) {
                    return 'high_heat';
                }
            }
        }

        return null; // No energy required
    }

    showEnergyRequiredMessage(requiredEnergy) {
        this.input.enabled = false;
        this.scientist.setTexture('shock');

        let energyName = '';
        if (requiredEnergy === 'initial_heat') {
            energyName = 'Initial Heat';
        } else if (requiredEnergy === 'electricity') {
            energyName = 'Electricity';
        } else if (requiredEnergy === 'high_heat') {
            energyName = 'High Heat';
        }

        const messageText = this.add.text(1200, 300, `This reaction requires:\n${energyName}`, {
            fontSize: '32px',
            fill: '#FFFF00',
            stroke: '#000000',
            strokeThickness: 4,
            align: 'center',
            backgroundColor: '#000000',
            padding: { x: 20, y: 20 }
        }).setOrigin(0.5).setDepth(1001);

        this.time.delayedCall(4000, () => {
            messageText.destroy();
            this.scientist.setTexture('default');
            this.input.enabled = true;
        });
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

    addToHistory(reaction) {
        // Prevent duplicates
        if (this.history.find(r => r.equation === reaction.equation)) return;

        this.history.push(reaction);
        // Save to sessionStorage for cross-stage persistence
        window.sessionStorage.setItem('chemSimHistory', JSON.stringify(this.history));

    }

    toggleHistory() {
        // DOM-BASED JOURNAL — Field Notes / Parchment Theme
        const existing = document.getElementById('journal-overlay');
        if (existing) { existing.remove(); return; }

        // Also close old Phaser panel if open
        if (this.historyPanelOpen) {
            if (this.historyDragHandler) {
                this.input.off('pointermove', this.historyDragHandler);
                this.input.off('pointerup', this.historyUpHandler);
                this.historyDragHandler = null;
                this.historyUpHandler = null;
            }
            if (this.historyContainer) this.historyContainer.destroy();
            this.historyPanelOpen = false;
        }

        // OVERLAY
        const overlay = document.createElement('div');
        overlay.id = 'journal-overlay';
        overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:1020;display:flex;justify-content:center;align-items:center;';
        overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };

        // JOURNAL CONTAINER (Parchment Theme)
        const journal = document.createElement('div');
        journal.style.cssText = 'width:540px;max-height:450px;background:#f4ecd8;border:2px solid #c4a96a;border-radius:12px;display:flex;flex-direction:column;overflow:hidden;font-family:Georgia,\"Times New Roman\",serif;box-shadow:0 8px 32px rgba(139,109,56,0.35);';

        // HEADER
        const header = document.createElement('div');
        header.style.cssText = 'background:linear-gradient(135deg,#8b6d38,#a0824a);color:#fff;padding:14px 20px;font-weight:bold;font-size:18px;display:flex;justify-content:space-between;align-items:center;';
        header.innerHTML = '<span>\uD83D\uDCDC FIELD NOTES</span><span style="font-size:13px;opacity:0.85">Reactions: ' + this.history.length + '</span>';

        // SCROLLABLE LIST
        const list = document.createElement('div');
        list.style.cssText = 'flex:1;overflow-y:auto;padding:16px 20px;';

        if (this.history.length === 0) {
            list.innerHTML = '<div style="text-align:center;color:#8b7d6b;padding:40px 0;font-style:italic;font-size:16px;">No discoveries yet.<br><span style="font-size:13px;margin-top:8px;display:block;">Combine elements to record your first reaction!</span></div>';
        } else {
            // Group by reaction type
            const groups = {};
            this.history.forEach(r => {
                const rawType = r.type || 'Other';
                const type = rawType.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                if (!groups[type]) groups[type] = [];
                groups[type].push(r);
            });

            const typeColors = {
                'Synthesis': '#2980b9',
                'Decomposition': '#c0392b',
                'Single Displacement': '#8e44ad',
                'Double Displacement': '#d35400',
                'Neutralization': '#16a085',
                'Combustion': '#e67e22'
            };

            Object.keys(groups).forEach(type => {
                const color = typeColors[type] || '#8b6d38';
                list.innerHTML += '<h3 style="color:' + color + ';font-weight:bold;margin:14px 0 8px 0;border-bottom:2px solid ' + color + ';padding-bottom:4px;font-size:15px;">' + type + '</h3>';

                groups[type].forEach(r => {
                    const productStr = r.products.map(p => p.replace(/_c$/, '')).join(' + ');
                    list.innerHTML += '<div style="margin-bottom:12px;padding-bottom:10px;border-bottom:1px dashed #c4a96a;">' +
                        '<div style="color:#3c2f1a;font-weight:bold;font-size:14px;margin-bottom:3px;">' + r.equation + '</div>' +
                        '<div style="color:#2ecc71;font-size:15px;font-weight:bold;">\u2192 ' + productStr + '</div>' +
                        '</div>';
                });
            });
        }

        // FOOTER with Clear History button
        const footer = document.createElement('div');
        footer.style.cssText = 'padding:10px 20px;background:#e8dcc8;display:flex;justify-content:space-between;align-items:center;border-top:1px solid #c4a96a;';

        const clearBtn = document.createElement('button');
        clearBtn.textContent = '\uD83D\uDDD1\uFE0F Clear History';
        clearBtn.style.cssText = 'background:transparent;border:1px solid #c0392b;color:#c0392b;padding:6px 14px;border-radius:6px;cursor:pointer;font-family:Georgia,serif;font-size:13px;font-weight:bold;';
        clearBtn.onmouseenter = () => { clearBtn.style.background = '#c0392b'; clearBtn.style.color = '#fff'; };
        clearBtn.onmouseleave = () => { clearBtn.style.background = 'transparent'; clearBtn.style.color = '#c0392b'; };
        clearBtn.onclick = () => {
            window.sessionStorage.removeItem('chemSimHistory');
            this.history = [];
            overlay.remove();
        };

        const hint = document.createElement('span');
        hint.style.cssText = 'color:#8b7d6b;font-size:11px;font-style:italic;';
        hint.textContent = '(Click outside to close)';

        footer.appendChild(clearBtn);
        footer.appendChild(hint);

        journal.appendChild(header);
        journal.appendChild(list);
        journal.appendChild(footer);
        overlay.appendChild(journal);
        document.body.appendChild(overlay);
    }

    playProductEffect(effectType, x, y) {


        if (effectType === 'bubbles' || effectType === 'constant_bubbles' || effectType === 'rapid_bubbles') {
            // Create bubbles rising
            for (let i = 0; i < 20; i++) {
                this.time.delayedCall(i * 100, () => {
                    const bubble = this.add.circle(x + Phaser.Math.Between(-50, 50), y + Phaser.Math.Between(0, 50), Phaser.Math.Between(5, 12), 0x88ccff, 0.6)
                        .setDepth(1002);

                    this.tweens.add({
                        targets: bubble,
                        y: y - 150,
                        alpha: 0,
                        duration: 2000,
                        onComplete: () => bubble.destroy()
                    });
                });
            }
        } else if (effectType === 'fizz') {
            // Quick small bubbles
            for (let i = 0; i < 30; i++) {
                const bubble = this.add.circle(x + Phaser.Math.Between(-30, 30), y + Phaser.Math.Between(-10, 10), Phaser.Math.Between(2, 6), 0xffffff, 0.8)
                    .setDepth(1002);

                this.tweens.add({
                    targets: bubble,
                    y: y - 100 + Phaser.Math.Between(-20, 20),
                    x: x + Phaser.Math.Between(-50, 50),
                    alpha: 0,
                    duration: 1000,
                    onComplete: () => bubble.destroy()
                });
            }
        } else if (effectType === 'metal_glow' || effectType === 'glow') {
            const glow = this.add.circle(x, y, 60, 0xffff00, 0.4).setDepth(1002);
            this.tweens.add({
                targets: glow,
                scale: 2.5,
                alpha: 0,
                duration: 1000,
                repeat: 0,
                yoyo: false,
                onComplete: () => glow.destroy()
            });
        } else if (effectType === 'smoke') {
            for (let i = 0; i < 15; i++) {
                this.time.delayedCall(i * 150, () => {
                    const smoke = this.add.circle(x, y - 20, Phaser.Math.Between(10, 25), 0x555555, 0.4).setDepth(1002);
                    this.tweens.add({
                        targets: smoke,
                        y: y - 200,
                        x: x + Phaser.Math.Between(-30, 30),
                        scale: 2,
                        alpha: 0,
                        duration: 2500,
                        onComplete: () => smoke.destroy()
                    });
                });
            }
        } else if (effectType === 'rust_glow') {
            const glow = this.add.circle(x, y, 60, 0xD45500, 0.6).setDepth(1002);
            this.tweens.add({
                targets: glow,
                scale: 2.5,
                alpha: 0,
                duration: 1000,
                onComplete: () => glow.destroy()
            });
        } else if (effectType === 'solution_fade') {
            const solution = this.add.circle(x, y, 60, 0x3498db, 0.6).setDepth(1002);
            this.tweens.add({
                targets: solution,
                alpha: 0,
                duration: 1000,
                onComplete: () => solution.destroy()
            });
        } else if (effectType === 'precipitate_milk') {
            for (let i = 0; i < 20; i++) {
                const p = this.add.circle(
                    x + Phaser.Math.Between(-30, 30),
                    y + Phaser.Math.Between(-20, 20),
                    Phaser.Math.Between(3, 8),
                    0xFFFFFF,
                    0.9
                ).setDepth(1002);

                this.tweens.add({
                    targets: p,
                    y: y + 40 + Phaser.Math.Between(-10, 10),
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quad.easeOut',
                    onComplete: () => p.destroy()
                });
            }

        } else if (effectType === 'cloudy_white') {
            for (let i = 0; i < 15; i++) {
                const cloud = this.add.circle(
                    x + Phaser.Math.Between(-40, 40),
                    y + Phaser.Math.Between(-30, 30),
                    Phaser.Math.Between(10, 18),
                    0xEEEEEE,
                    0.5
                ).setDepth(1002);

                this.tweens.add({
                    targets: cloud,
                    scale: 1.5,
                    alpha: 0,
                    duration: 1800,
                    ease: 'Sine.easeInOut',
                    onComplete: () => cloud.destroy()
                });
            }
        } else if (effectType === 'bright_flame' || effectType === 'blue_flame') {
            const isBlue = effectType === 'blue_flame';
            const color = isBlue ? 0x0088FF : 0xFFAA00;

            // Flash
            const flash = this.add.circle(x, y, 80, color, 0.6).setDepth(1002);
            this.tweens.add({
                targets: flash,
                scale: 3,
                alpha: 0,
                duration: 500,
                onComplete: () => flash.destroy()
            });

            // Flame particles
            for (let i = 0; i < 12; i++) {
                this.time.delayedCall(i * 30, () => {
                    const p = this.add.circle(
                        x + Phaser.Math.Between(-25, 25),
                        y + Phaser.Math.Between(-15, 15),
                        Phaser.Math.Between(6, 14),
                        color,
                        0.9
                    ).setDepth(1002);

                    this.tweens.add({
                        targets: p,
                        y: y - 140,
                        alpha: 0,
                        duration: 700,
                        ease: 'Quad.easeOut',
                        onComplete: () => p.destroy()
                    });
                });
            }
        }
    }

    transitionToStart() {
        const beaker = this.children.getByName('beaker');

        this.tweens.add({
            targets: [beaker, this.combineBtn, this.combineBtnPressed, this.clearBtn, this.clearBtnPressed, this.electricBtn, this.electricBtnPressed, this.initialHeatBtn, this.initialHeatBtnPressed, this.highHeatBtn, this.highHeatBtnPressed],
            y: '+=100',
            duration: 400,
            ease: 'Power2',
            onComplete: () => {
                if (window.showSkeleton) window.showSkeleton();
                this.scene.start('Start');
            }
        });
    }


}
