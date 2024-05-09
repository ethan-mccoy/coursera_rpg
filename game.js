class Enemy {
    constructor(scene, x, y, key, name, level, type, maxHealth) {
        this.scene = scene;
        this.sprite = scene.add.image(x, y, key).setScale(0.2).setInteractive();
        this.maxHealth = maxHealth;
        this.currentHealth = maxHealth;
        this.name = name;
        this.level = level;
        this.type = type;
        this.healthBar = scene.add.graphics();
        this.infoText = scene.add.text(
            this.sprite.x,
            this.sprite.y + this.sprite.displayHeight / 2 + 30,
            `${this.name}\nLevel ${this.level} ${this.type}`,
            { fontSize: '14px', color: '#ffffff', align: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)' }
        ).setOrigin(0.5).setInteractive();

        this.updateHealthBar();
        this.updateInfoPosition();

        this.sprite.on('pointerdown', this.takeDamage, this);
        this.infoText.on('pointerdown', () => this.scene.showEnemyPopup(this));
    }

    takeDamage() {
        this.currentHealth = Math.max(0, this.currentHealth - 10);
        this.updateHealthBar();
        if (this.currentHealth === 0) {
            this.sprite.setTexture('enemy_dead');
            this.scene.showVictoryPopup(this);
        }
    }

    updateHealthBar() {
        const barWidth = this.sprite.displayWidth;
        const barHeight = 20;
        const barX = this.sprite.x - barWidth / 2;
        const barY = this.sprite.y + this.sprite.displayHeight / 2 + 5;

        const healthPercentage = this.currentHealth / this.maxHealth;

        this.healthBar.clear();
        this.healthBar.fillStyle(0x000000, 1);
        this.healthBar.fillRect(barX, barY, barWidth, barHeight);
        this.healthBar.fillStyle(0xFF0000, 1);
        this.healthBar.fillRect(barX, barY, barWidth * healthPercentage, barHeight);
    }

    updateInfoPosition() {
        this.infoText.setPosition(this.sprite.x, this.sprite.y + this.sprite.displayHeight / 2 + 30);
    }

    destroy() {
        this.sprite.destroy();
        this.healthBar.destroy();
        this.infoText.destroy();
    }
}

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.currentEnemy = null;
        this.enemyList = [
            { key: 'enemy', name: 'Blazing Cat', level: 45, type: 'Fire Elemental', maxHealth: 100 },
            { key: 'enemy', name: 'Frost Cat', level: 35, type: 'Ice Elemental', maxHealth: 80 },
            { key: 'enemy', name: 'Storm Cat', level: 50, type: 'Electric Elemental', maxHealth: 120 },
            { key: 'enemy', name: 'Stone Cat', level: 60, type: 'Earth Elemental', maxHealth: 150 }
        ];
    }

    preload() {
        this.load.image('hero', chrome.runtime.getURL('dog.jpg'));
        this.load.image('enemy', chrome.runtime.getURL('cat.jpg'));
        this.load.image('enemy_dead', chrome.runtime.getURL('cat_dead.png'));
    }

    create() {
        this.createPopupGroups();
        this.spawnNewEnemy();
    }

    createPopupGroups() {
        this.popupGroup = this.add.container().setVisible(false).setDepth(1);
        this.victoryPopupGroup = this.add.container().setVisible(false).setDepth(1);

        this.createPopup(this.popupGroup, 'popupText', 'closeButton', this.hidePopup.bind(this));
        this.createPopup(this.victoryPopupGroup, 'victoryText', 'continueButton', this.hideVictoryPopup.bind(this));
    }

    createPopup(group, textKey, buttonKey, closeCallback) {
        const background = this.add.graphics();
        background.fillStyle(0x000000, 0.8);
        background.fillRect(0, 0, 200, 150);
        group.add(background);

        this[textKey] = this.add.text(20, 20, '', { fontSize: '18px', color: '#ffffff' });
        group.add(this[textKey]);

        this[buttonKey] = this.add.text(160, 10, 'X', { fontSize: '24px', color: '#ff0000' });
        this[buttonKey].setInteractive().on('pointerdown', closeCallback);
        group.add(this[buttonKey]);
    }

    hidePopup() {
        this.popupGroup.setVisible(false);
    }

    hideVictoryPopup() {
        this.victoryPopupGroup.setVisible(false);
        this.spawnNewEnemy();
    }

    showEnemyPopup(enemy) {
        const popupWidth = 200;
        const popupHeight = 150;
        const popupX = enemy.sprite.x - popupWidth / 2;
        const popupY = enemy.sprite.y;

        this.popupGroup.setPosition(popupX, popupY);
        this.popupText.setText(`Name: ${enemy.name}\nLevel: ${enemy.level}\nType: ${enemy.type}\nHealth: ${enemy.currentHealth}/${enemy.maxHealth}`);

        this.popupGroup.setVisible(true);
    }

    showVictoryPopup(enemy) {
        const popupWidth = 200;
        const popupHeight = 150;
        const popupX = enemy.sprite.x - popupWidth / 2;
        const popupY = enemy.sprite.y;

        this.victoryPopupGroup.setPosition(popupX, popupY);
        this.victoryText.setText(`Victory!\nExp: 100\nGold: 15`);

        this.victoryPopupGroup.setVisible(true);
    }

    spawnNewEnemy() {
        if (this.currentEnemy) {
            this.currentEnemy.destroy();
        }

        const randomEnemy = this.enemyList[Math.floor(Math.random() * this.enemyList.length)];

        this.currentEnemy = new Enemy(
            this, 200, 300, randomEnemy.key,
            randomEnemy.name, randomEnemy.level,
            randomEnemy.type, randomEnemy.maxHealth
        );
    }

    update() {
        if (this.currentEnemy) {
            this.currentEnemy.updateInfoPosition();
        }
    }
}

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
