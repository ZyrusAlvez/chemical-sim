import { Start } from './scenes/Start.js?v=QQQQQQ';
import { Stage2 } from './scenes/Stage2.js?v=QQQQQQ';
import { Tutorial } from './scenes/Tutorial.js?v=cache_bust_01';

// Listen for Game Ready event to remove Skeleton
window.addEventListener('game-ready', () => {
    if (window.startGameTransition) {
        window.startGameTransition();
    }
});

// Initialize Global Game Progress
window.gameProgress = window.gameProgress || {
    unlockedRecipes: [],
    discoveredRecipes: [],
    milestones: {
        bronze: false,
        silver: false,
        master: false
    }
};

// Determine start scene from URL query
const urlParams = new URLSearchParams(window.location.search);
const startWithTutorial = urlParams.get('scene') === 'tutorial';

const sceneList = startWithTutorial
    ? [Tutorial, Start, Stage2]
    : [Start, Stage2, Tutorial];

const config = {
    type: Phaser.AUTO,
    title: 'ChemSim - Interactive Chemistry Lab',
    description: 'Learn chemistry through interactive experiments',
    parent: 'game-container',
    width: 1856,
    height: 1044,
    backgroundColor: '#1a1a2e',
    pixelArt: false,
    scene: sceneList,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

new Phaser.Game(config);
