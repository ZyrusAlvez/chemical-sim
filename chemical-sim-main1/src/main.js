import { Start } from './scenes/Start.js?v=QQQQQQ';
import { Stage2 } from './scenes/Stage2.js?v=QQQQQQ';

const config = {
    type: Phaser.AUTO,
    title: 'ChemSim - Interactive Chemistry Lab',
    description: 'Learn chemistry through interactive experiments',
    parent: 'game-container',
    width: 1856,
    height: 1044,
    backgroundColor: '#1a1a2e',
    pixelArt: false,
    scene: [
        Start,
        Stage2
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

new Phaser.Game(config);
