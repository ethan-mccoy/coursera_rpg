import { EnemyUIManager } from "./EnemyUIManager.js";

export class Enemy {
    constructor(scene, x, y, key, name, level, type, maxHealth) {
        this.scene = scene;
        this.sprite = scene.add.image(x, y, key).setScale(0.2).setInteractive();
        this.maxHealth = maxHealth;
        this.currentHealth = maxHealth;
        this.name = name;
        this.level = level;
        this.type = type;

        this.uiManager = new EnemyUIManager(scene, this);
        this.sprite.on('pointerdown', this.takeDamage, this);
    }

    takeDamage() {
        if (this.currentHealth === 0) {
            return;
        }
        this.currentHealth = Math.max(0, this.currentHealth - 10);
        this.uiManager.updateHealthBar();
        if (this.currentHealth === 0) {
            this.sprite.setTexture('enemy_dead');
            this.scene.triggerVictory(this);
        }
    }

    destroy() {
        this.sprite.destroy();
        this.uiManager.destroy();
    }
}