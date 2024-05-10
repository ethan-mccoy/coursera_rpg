import { Player } from "./Player.js";
import { Enemy } from "./Enemy.js";
import { PlayerInfo } from "../ui/PlayerInfo.js";
import { VictoryInfo } from "../ui/VictoryInfo.js";

export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.currentEnemy = null;
        this.enemyList = [
            { key: 'enemy', name: 'Blazing Cat', level: 45, type: 'Fire Elemental', maxHealth: 90 },
            { key: 'enemy', name: 'Frost Cat', level: 35, type: 'Ice Elemental', maxHealth: 110 },
            { key: 'enemy', name: 'Storm Cat', level: 50, type: 'Electric Elemental', maxHealth: 80 },
            { key: 'enemy', name: 'Stone Cat', level: 60, type: 'Earth Elemental', maxHealth: 120 }
        ];
    }

    preload() {
        this.loadImages([
            { key: 'hero', path: '../assets/dog.jpg' },
            { key: 'enemy', path: '../assets/cat.jpg' },
            { key: 'enemy_dead', path: '../assets/cat_dead.png' },
            { key: 'background', path: '../assets/bg_grass.jpg' },
            { key: 'button', path: '../assets/button.png' },
            { key: 'scroll', path: '../assets/scroll.png' }
        ]);
    }

    loadImages(images) {
        images.forEach(image => this.load.image(image.key, chrome.runtime.getURL(image.path)));
    }

    create() {
        this.add.image(this.scale.width, this.scale.height / 3, 'background').setScale(0.5).setScrollFactor(0);

        new PlayerInfo(this, 200, 650, 'scroll', 0.5, 'Ethan', 1);



        this.player = new Player(this);
        this.spawnNewEnemy();
    }

    triggerVictory(enemy) {
        this.player.addXp(enemy.level * 10);
        this.player.addGold(enemy.level * 5);

        const victoryInfo = new VictoryInfo(this, 200, 500, 'scroll', 0.5, enemy.level * 10, enemy.level * 5);
        this.add.existing(victoryInfo.container);
        victoryInfo.setVisible(true);
    }

    spawnNewEnemy() {
        if (this.currentEnemy) {
            this.currentEnemy.destroy();
        }

        const randomEnemy = this.enemyList[Math.floor(Math.random() * this.enemyList.length)];

        this.currentEnemy = new Enemy(
            this, 200, 200, randomEnemy.key,
            randomEnemy.name, randomEnemy.level,
            randomEnemy.type, randomEnemy.maxHealth
        );
    }

    update() {

    }
}


