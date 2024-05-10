import { GameScene } from './game/GameScene.js';

const config = {
    type: Phaser.AUTO,
    parent: 'gameCanvas',
    scene: GameScene,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

const game = new Phaser.Game(config);