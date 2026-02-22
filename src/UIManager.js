export class UIManager {
    constructor() {
        this.buttons = {};
        this.activeMenu = null;
        this.styleId = 'bookmark-ui-styles';
        this.resizeListener = null;
        this.container = null;
        this.callbacks = {};
        this.injectStyles();
    }

    injectStyles() {
        if (document.getElementById(this.styleId)) return;

        const css = `
            /* BOOKMARK STICKER THEME - PERSISTENT NAV */
            .nav-ui-bar {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 2000;
                pointer-events: none;
                user-select: none;
                font-family: 'Verdana', 'Arial', sans-serif;
                visibility: visible !important;

                /* HIDE INITIALLY TO PREVENT CHAOS */
                opacity: 0;
                transition: opacity 0.3s ease-out;
            }

            .nav-ui-group {
                position: absolute;
                top: clamp(8px, 5vh, 60px);
                display: flex;
                flex-direction: column;
                gap: clamp(6px, 1.5vh, 15px);
                pointer-events: auto;
            }

            .nav-ui-group.left {
                left: 0;
            }

            .nav-ui-group.right {
                right: 0;
                align-items: flex-end;
            }

            /* CHUNKY BOOKMARK BUTTON - RESPONSIVE */
            .friendly-btn {
                background: #cccccc;
                border: clamp(2px, 0.3vw, 3px) solid #999999;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: clamp(4px, 0.8vw, 10px);
                height: clamp(30px, 5vh, 55px);
                color: #ffffff;
                font-size: clamp(9px, 1.2vw, 16px);
                font-weight: bold;
                text-transform: uppercase;
                transition: transform 0.1s ease-out;
                pointer-events: auto;
                box-shadow: 0 clamp(2px, 0.4vh, 4px) 0 rgba(0,0,0,0.2);
                position: relative;
                white-space: nowrap;
            }

            .friendly-btn svg {
                width: clamp(14px, 2vw, 24px);
                height: clamp(14px, 2vw, 24px);
                fill: currentColor;
                min-width: clamp(14px, 2vw, 24px);
                flex-shrink: 0;
            }

            /* LEFT EDGE STICKERS (Exit) */
            .nav-ui-group.left .friendly-btn {
                border-radius: 0 clamp(10px, 2vw, 20px) clamp(10px, 2vw, 20px) 0;
                border-left: none;
                padding: 0 clamp(10px, 2vw, 25px) 0 clamp(6px, 1vw, 15px);
                margin-left: 0;
            }

            /* RIGHT EDGE STICKERS (Menus) */
            .nav-ui-group.right .friendly-btn {
                border-radius: clamp(10px, 2vw, 20px) 0 0 clamp(10px, 2vw, 20px);
                border-right: none;
                padding: 0 clamp(8px, 1.5vw, 20px) 0 clamp(10px, 2vw, 25px);
            }

            /* COLORS */
            .friendly-btn.btn-exit {
                background: #e74c3c;
                border-color: #c0392b;
            }
            .friendly-btn.btn-journal {
                background: #2ecc71;
                border-color: #27ae60;
            }
            .friendly-btn.btn-recipes {
                background: #3498db;
                border-color: #2980b9;
            }
            .friendly-btn.btn-tutorial {
                background: #f1c40f;
                border-color: #f39c12;
            }

            .nav-ui-group.left .friendly-btn:not(.active):hover {
                transform: translateX(10px) scale(1.05);
            }
            .nav-ui-group.right .friendly-btn:not(.active):hover {
                transform: translateX(-10px) scale(1.05);
            }

            .friendly-btn:active, .friendly-btn.active {
                transform: scale(0.95);
                box-shadow: 0 2px 0 rgba(0,0,0,0.2);
            }

            /* RESPONSIVE: Very small screens */
            @media (max-width: 480px) {
                .friendly-btn span {
                    display: none;
                }
            }
        `;

        const style = document.createElement('style');
        style.id = this.styleId;
        style.textContent = css;
        document.head.appendChild(style);
    }

    createNavbar(options = {}) {
        // Store callbacks for later updates
        this.callbacks = options;

        // If navbar already exists in DOM, just update callbacks and show it
        if (this.container && this.container.parentNode) {
            this.updateCallbacks(options);
            this.syncToCanvas();
            return;
        }

        // Remove any orphaned bars
        document.querySelectorAll('.nav-ui-bar').forEach(el => el.remove());
        this.closeAllMenus();

        const bar = document.createElement('div');
        bar.className = 'nav-ui-bar';
        bar.id = 'chemsim-nav-bar';
        bar.style.opacity = '0';
        this.container = bar;

        const leftGroup = document.createElement('div');
        leftGroup.className = 'nav-ui-group left';

        const rightGroup = document.createElement('div');
        rightGroup.className = 'nav-ui-group right';

        // 1. EXIT (Left)
        const exitBtn = this.createButton({
            label: 'EXIT',
            svg: '<path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>',
            onClick: () => {
                this.closeAllMenus();
                if (this.callbacks.onExit) this.callbacks.onExit();
            },
            type: 'btn-exit'
        });
        this.buttons.exit = exitBtn;
        leftGroup.appendChild(exitBtn);

        // 2. JOURNAL (Right)
        const journalBtn = this.createButton({
            label: 'JOURNAL',
            svg: '<path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>',
            onClick: () => {
                this.handleToggle(this.buttons.journal, () => {
                    if (this.callbacks.onJournal) this.callbacks.onJournal();
                });
            },
            type: 'btn-journal'
        });
        this.buttons.journal = journalBtn;
        rightGroup.appendChild(journalBtn);

        // 3. TUTORIAL (Right)
        const tutorialBtn = this.createButton({
            label: 'TUTORIAL',
            svg: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>',
            onClick: () => {
                this.closeAllMenus();
                if (this.callbacks.onTutorial) this.callbacks.onTutorial();
            },
            type: 'btn-tutorial'
        });
        this.buttons.tutorial = tutorialBtn;
        rightGroup.appendChild(tutorialBtn);

        // 4. RECIPES (Right)
        const recipesBtn = this.createButton({
            label: 'RECIPES',
            svg: '<path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12zM12 5.5v9l6-4.5z"/>',
            onClick: () => {
                this.handleToggle(this.buttons.recipes, () => {
                    if (this.callbacks.onRecipes) this.callbacks.onRecipes();
                });
            },
            type: 'btn-recipes'
        });
        this.buttons.recipes = recipesBtn;
        rightGroup.appendChild(recipesBtn);

        bar.appendChild(leftGroup);
        bar.appendChild(rightGroup);
        document.body.appendChild(bar);

        // Start canvas sync
        this.startCanvasSync();
    }

    startCanvasSync() {
        // Sync navbar position to the Phaser canvas
        this.syncToCanvas = () => {
            if (!this.container) return;
            const canvas = document.querySelector('#game-container canvas');
            if (canvas) {
                const rect = canvas.getBoundingClientRect();
                if (rect.width > 0 && rect.height > 0) {
                    this.container.style.top = rect.top + 'px';
                    this.container.style.left = rect.left + 'px';
                    this.container.style.width = rect.width + 'px';
                    this.container.style.height = rect.height + 'px';
                    this.container.style.opacity = '1';
                }
            } else {
                // No canvas yet, try again
                this.container.style.opacity = '0';
            }
        };

        // Run sync on multiple intervals to catch canvas appearing
        const intervals = [50, 100, 200, 400, 800, 1200, 2000];
        intervals.forEach(ms => {
            setTimeout(() => this.syncToCanvas(), ms);
        });

        // Debounced resize listener
        if (this.resizeListener) {
            window.removeEventListener('resize', this.resizeListener);
        }
        this.resizeListener = () => this.syncToCanvas();
        window.addEventListener('resize', this.resizeListener);
    }

    updateCallbacks(options = {}) {
        this.callbacks = options;
        // Re-sync position to canvas
        if (this.syncToCanvas) {
            this.syncToCanvas();
            // Also retry a few times in case canvas is still loading
            setTimeout(() => this.syncToCanvas(), 100);
            setTimeout(() => this.syncToCanvas(), 500);
            setTimeout(() => this.syncToCanvas(), 1000);
        }
    }

    createButton({ label, svg, onClick, type }) {
        const btn = document.createElement('button');
        btn.className = 'friendly-btn ' + type;
        btn.innerHTML = '<svg viewBox="0 0 24 24">' + svg + '</svg><span>' + label + '</span>';

        btn.addEventListener('mousedown', (e) => e.stopPropagation());
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            onClick();
        });

        return btn;
    }

    handleToggle(btn, callback) {
        const wasActive = btn.classList.contains('active');
        this.closeAllMenus();
        if (!wasActive) {
            btn.classList.add('active');
            callback();
        }
    }

    closeAllMenus() {
        Object.values(this.buttons).forEach(b => b.classList.remove('active'));
        const overlays = ['recipe-book-overlay', 'journal-overlay'];
        overlays.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.remove();
        });
        // Also close any reset confirmation
        const resetConfirm = document.getElementById('reset-confirm-overlay');
        if (resetConfirm) resetConfirm.remove();
    }

    show() {
        if (this.container) {
            this.container.style.display = 'block';
            this.container.style.opacity = '1';
            this.container.style.visibility = 'visible';
        }
    }

    hide() {
        if (this.container) {
            this.container.style.display = 'none';
        }
    }
}

// SINGLETON: Create one global instance
export const globalUIManager = new UIManager();
