class Player {
    constructor(scene, xp = 0, level = 1, gold = 0) {
        this.scene = scene;
        this.xp = xp;
        this.level = level;
        this.gold = gold;
    }

    addXp(amount) {
        this.xp += amount;
        this.checkLevelUp();
    }

    checkLevelUp() {
        const xpNeeded = this.level * 100;
        if (this.xp >= xpNeeded) {
            this.level += 1;
            this.xp -= xpNeeded;
        }
    }

    addGold(amount) {
        this.gold += amount;
    }

    getInfo() {
        return `Level: ${this.level}\nXP: ${this.xp}/${this.level * 100}\nGold: ${this.gold}`;
    }
}

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
        this.hpText = scene.add.text(0, 0, '', { fontSize: '12px', color: '#ffffff' }).setOrigin(0.5);
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

        this.hpText.setText(`${this.currentHealth} / ${this.maxHealth}`);
        this.hpText.setPosition(this.sprite.x, barY + barHeight / 2);


    }

    updateInfoPosition() {
        this.infoText.setPosition(this.sprite.x, this.sprite.y + this.sprite.displayHeight / 2 + 50);
    }

    destroy() {
        this.sprite.destroy();
        this.healthBar.destroy();
        this.hpText.destroy();
        this.infoText.destroy();
    }
}

// PopupManager.js
class PopupManager {
    constructor(scene) {
        this.scene = scene;
        this.popups = {};

        // Initialize popups
        this.createPopup('defaultPopup', 200, 150, () => { });
        this.createVictoryPopup(() => scene.spawnNewEnemy());
        this.createPopup('playerInfoPopup', 250, 200, () => { });
    }

    createPopup(key, width, height, closeCallback) {
        const container = this.scene.add.container().setVisible(false).setDepth(1);
        const background = this.createPopupBackground(width, height);
        const text = this.scene.add.text(20, 20, '', { fontSize: '18px', color: '#ffffff' });
        const closeButton = this.createCloseButton(() => {
            closeCallback();
            this.hidePopup(key);
        });

        container.add([background, text, closeButton]);
        this.popups[key] = { container, text };
    }

    createPopupBackground(width, height) {
        const background = this.scene.add.graphics();
        background.fillStyle(0x000000, 0.8);
        background.fillRect(0, 0, width, height);
        return background;
    }

    createCloseButton(callback) {
        const closeButton = this.scene.add.text(160, 10, 'X', { fontSize: '24px', color: '#ff0000' });
        closeButton.setInteractive().on('pointerdown', callback);
        return closeButton;
    }

    createVictoryPopup(closeCallback) {
        this.createPopup('victoryPopup', 200, 150, closeCallback);
    }

    showPopup(key, textContent, position) {
        const { x, y, width, height } = position;
        const { container, text } = this.popups[key];
        container.setPosition(x - width / 2, y);
        text.setText(textContent);
        container.setVisible(true);
    }

    hidePopup(key) {
        this.popups[key].container.setVisible(false);
    }

    showDefaultPopup(textContent, position) {
        this.showPopup('defaultPopup', textContent, position);
    }

    showVictoryPopup(textContent, position) {
        this.showPopup('victoryPopup', textContent, position);
    }

    showPlayerInfoPopup(textContent, position) {
        this.showPopup('playerInfoPopup', textContent, position);
    }
}

// PlayerInfoButton.js
class PlayerInfoButton {
    constructor(scene, callback) {
        const buttonWidth = 200;
        const buttonHeight = 50;
        const buttonX = (scene.scale.width / 2) - (buttonWidth / 2);
        const buttonY = scene.scale.height - buttonHeight - 20;

        const background = scene.add.graphics();
        background.fillStyle(0x000000, 1);
        background.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

        const buttonText = scene.add.text(buttonX + 10, buttonY + 10, 'Player Info', {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0);

        buttonText.setInteractive({ useHandCursor: true })
            .on('pointerdown', callback);

        this.buttonContainer = scene.add.container().add([background, buttonText]);
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
        this.loadImages([
            { key: 'hero', path: 'dog.jpg' },
            { key: 'enemy', path: 'cat.jpg' },
            { key: 'enemy_dead', path: 'cat_dead.png' },
            { key: 'background', path: 'bg_grass.jpg' }
        ]);
    }

    loadImages(images) {
        images.forEach(image => this.load.image(image.key, chrome.runtime.getURL(image.path)));
    }

    create() {
        this.add.image(this.scale.width, this.scale.height / 3, 'background').setScale(0.5).setScrollFactor(0);
        this.popupManager = new PopupManager(this);
        this.playerInfoButton = new PlayerInfoButton(this, this.showPlayerInfoPopup.bind(this));
        this.player = new Player(this);

        this.spawnNewEnemy();
    }

    showPlayerInfoPopup() {
        const textContent = this.player.getInfo();
        const popupWidth = 250;
        const popupHeight = 200;
        const popupX = this.scale.width / 2;
        const popupY = this.scale.height - popupHeight - 20;

        this.popupManager.showPlayerInfoPopup(textContent, {
            x: popupX,
            y: popupY,
            width: popupWidth,
            height: popupHeight
        });
    }

    showEnemyPopup(enemy) {
        const textContent = `Name: ${enemy.name}\nLevel: ${enemy.level}\nType: ${enemy.type}\nHealth: ${enemy.currentHealth}/${enemy.maxHealth}`;
        this.popupManager.showDefaultPopup(textContent, {
            x: enemy.sprite.x,
            y: enemy.sprite.y,
            width: 200,
            height: 150
        });
    }
    showVictoryPopup(enemy) {
        const textContent = `Victory!\nExp: 100\nGold: 15`;
        this.popupManager.showVictoryPopup(textContent, {
            x: enemy.sprite.x,
            y: enemy.sprite.y,
            width: 200,
            height: 150
        });
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
