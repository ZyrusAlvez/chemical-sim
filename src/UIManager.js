export class UIManager {
    constructor(scene) {
        this.scene = scene;
        this.buttons = {};
        this.activeMenu = null;
        this.styleId = 'bookmark-ui-styles';
        this.resizeListener = null;
        this.injectStyles();

        // AUTO-CLEANUP ON SCENE SHUTDOWN
        // This ensures that when switching to Tutorial (which stops this scene), the UI is removed.
        if (this.scene && this.scene.events) {
            this.scene.events.on('shutdown', this.destroy, this);
            this.scene.events.on('destroy', this.destroy, this);
        }
    }

    injectStyles() {
        if (document.getElementById(this.styleId)) return;

        const css = `
            /* BOOKMARK STICKER THEME - GAME CLIPPED */
            .nav-ui-bar {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1030;
                pointer-events: none;
                user-select: none;
                font-family: 'Verdana', 'Arial', sans-serif;
                
                /* HIDE INITIALLY TO PREVENT CHAOS */
                opacity: 0;
                transition: opacity 0.3s ease-out; /* Smooth Fade-In */
            }

            .nav-ui-group {
                position: absolute;
                top: 60px;
                display: flex;
                flex-direction: column;
                gap: 15px;
                pointer-events: auto;
            }

            .nav-ui-group.left {
                left: 0;
            }

            .nav-ui-group.right {
                right: 0;
                align-items: flex-end;
            }

            /* CHUNKY BOOKMARK BUTTON */
            .friendly-btn {
                background: #cccccc;
                border: 3px solid #999999;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 10px;
                height: 55px;
                color: #ffffff;
                font-size: 16px;
                font-weight: bold;
                text-transform: uppercase;
                transition: transform 0.1s ease-out;
                pointer-events: auto;
                box-shadow: 0 4px 0 rgba(0,0,0,0.2);
                position: relative;
            }

            .friendly-btn svg {
                width: 24px;
                height: 24px;
                fill: currentColor;
                filter: drop-shadow(0 1px 1px rgba(0,0,0,0.2));
                min-width: 24px;
            }

            /* LEFT EDGE STICKERS (Exit) */
            .nav-ui-group.left .friendly-btn {
                border-radius: 0 20px 20px 0;
                border-left: none;
                padding: 0 25px 0 15px;
                margin-left: 0;
            }

            /* RIGHT EDGE STICKERS (Menus) */
            .nav-ui-group.right .friendly-btn {
                border-radius: 20px 0 0 20px;
                border-right: none;
                padding: 0 20px 0 25px;
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

            .nav-ui-group.left .friendly-btn:hover {
                transform: translateX(10px) scale(1.05);
            }
            .nav-ui-group.right .friendly-btn:hover {
                transform: translateX(-10px) scale(1.05);
            }

            .friendly-btn:active, .friendly-btn.active {
                transform: scale(0.95);
                box-shadow: 0 2px 0 rgba(0,0,0,0.2);
            }
        `;

        const style = document.createElement('style');
        style.id = this.styleId;
        style.textContent = css;
        document.head.appendChild(style);
    }

    createNavbar(options = {}) {
        document.querySelectorAll('.nav-ui-bar').forEach(el => el.remove());
        this.closeAllMenus();

        const bar = document.createElement('div');
        bar.className = 'nav-ui-bar';
        bar.style.opacity = '0';
        this.container = bar;

        // --- GAME DIMENSION SYNC ---
        this.updateLayout = () => {
            if (!this.scene || !this.scene.game || !this.scene.game.canvas) return;
            const canvas = this.scene.game.canvas;

            if (canvas.width > 0 && canvas.height > 0) {
                const rect = canvas.getBoundingClientRect();
                if (rect.width > 0 && rect.height > 0) {
                    bar.style.top = `${rect.top}px`;
                    bar.style.left = `${rect.left}px`;
                    bar.style.width = `${rect.width}px`;
                    bar.style.height = `${rect.height}px`;
                    bar.style.opacity = '1';
                }
            }
        };

        this.startLayoutSync();

        window.removeEventListener('resize', this.updateLayout);
        window.addEventListener('resize', this.updateLayout);
        this.resizeListener = this.updateLayout;
        // ---------------------------

        const leftGroup = document.createElement('div');
        leftGroup.className = 'nav-ui-group left';

        const rightGroup = document.createElement('div');
        rightGroup.className = 'nav-ui-group right';

        // 1. EXIT (Left)
        if (options.onExit) {
            leftGroup.appendChild(this.createButton({
                label: 'EXIT',
                svg: '<path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>',
                onClick: () => {
                    this.closeAllMenus();
                    options.onExit();
                },
                type: 'btn-exit'
            }));
        }

        // 2. JOURNAL (Right)
        if (options.onJournal) {
            const btn = this.createButton({
                label: 'JOURNAL',
                svg: '<path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>',
                onClick: () => {
                    this.handleToggle(btn, options.onJournal);
                },
                type: 'btn-journal'
            });
            this.buttons.journal = btn;
            rightGroup.appendChild(btn);
        }

        // 3. TUTORIAL (Right)
        if (options.onTutorial) {
            rightGroup.appendChild(this.createButton({
                label: 'TUTORIAL',
                svg: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>',
                onClick: () => {
                    this.closeAllMenus();
                    options.onTutorial();
                },
                type: 'btn-tutorial'
            }));
        }

        // 4. RECIPES (Right)
        if (options.onRecipes) {
            const btn = this.createButton({
                label: 'RECIPES',
                svg: '<path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12zM12 5.5v9l6-4.5z"/>',
                onClick: () => {
                    this.handleToggle(btn, options.onRecipes);
                },
                type: 'btn-recipes'
            });
            this.buttons.recipes = btn;
            rightGroup.appendChild(btn);
        }

        bar.appendChild(leftGroup);
        bar.appendChild(rightGroup);
        document.body.appendChild(bar);
    }

    startLayoutSync() {
        this.updateLayout();
        const intervals = [50, 100, 200, 400, 800, 1200, 2000];
        intervals.forEach(ms => {
            setTimeout(() => this.updateLayout(), ms);
        });
    }

    createButton({ label, svg, onClick, type }) {
        const btn = document.createElement('button');
        btn.className = `friendly-btn ${type}`;
        btn.innerHTML = `
            <svg viewBox="0 0 24 24">${svg}</svg>
            <span>${label}</span>
        `;

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
    }

    destroy() {
        if (this.resizeListener) {
            window.removeEventListener('resize', this.resizeListener);
        }
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
        // Remove listeners
        if (this.scene && this.scene.events) {
            this.scene.events.off('shutdown', this.destroy, this);
            this.scene.events.off('destroy', this.destroy, this);
        }
    }
}
