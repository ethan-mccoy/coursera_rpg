import { Enemy } from "./Enemy.js";
import { Button } from "../ui/UIElement.js";
import { EnemyInfo } from "../ui/EnemyInfo.js";

export class EnemyUIManager {
    constructor(scene, enemy) {
        this.scene = scene;
        this.enemy = enemy;
        this.createHealthBar();
        this.createInfoButton();
    }

    createHealthBar() {
        this.barWidth = this.enemy.sprite.displayWidth;
        this.barHeight = 20;
        this.barX = this.enemy.sprite.x - this.barWidth / 2;
        this.barY = this.enemy.sprite.y + this.enemy.sprite.displayHeight / 2 + 100;

        this.healthBar = this.scene.add.graphics();
        this.hpText = this.scene.add.text(0, 0, '', { fontSize: '12px', color: '#ffffff' }).setOrigin(0.5);

        this.updateHealthBar();
    }

    updateHealthBar() {
        const healthPercentage = this.enemy.currentHealth / this.enemy.maxHealth;

        this.healthBar.clear();
        this.healthBar.fillStyle(0x000000, 1);
        this.healthBar.fillRect(this.barX, this.barY, this.barWidth, this.barHeight);
        this.healthBar.fillStyle(0xFF0000, 1);
        this.healthBar.fillRect(this.barX, this.barY, this.barWidth * healthPercentage, this.barHeight);
        this.healthBar.setDepth(1);

        this.hpText.setText(`${this.enemy.currentHealth} / ${this.enemy.maxHealth}`);
        this.hpText.setPosition(this.enemy.sprite.x, this.barY + this.barHeight / 2);
        this.hpText.setDepth(1);
    }

    createInfoButton() {
        const x = this.enemy.sprite.x;
        const y = this.enemy.sprite.y + 200;
        const infoButton = new Button(this.scene, x, y, 'button', 0.35, `${this.enemy.name} \nLevel ${this.enemy.level} ${this.enemy.type}`, 16, '#000000', () => {
            this.enemyInfo.setVisible(true);
        });
        this.scene.add.existing(infoButton);

        this.enemyInfo = new EnemyInfo(this.scene, 200, 200, 'scroll', 0.5, this.enemy.name, this.enemy.level, this.enemy.type);
        this.enemyInfo.setVisible(false);
        this.scene.add.existing(this.enemyInfo);
    }

    destroy() {
        this.healthBar.destroy();
        this.hpText.destroy();
        this.enemyInfo.destroy();
    }
}