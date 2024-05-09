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
        this.infoText = scene.add.text(x, y + this.sprite.displayHeight / 1.5, `${this.name}\nLevel ${this.level} ${this.type}`, {
            fontSize: '14px', color: '#ffffff', align: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)'
        }).setOrigin(0.5).setInteractive();

        this.updateHealthBar();

        this.sprite.on('pointerdown', this.takeDamage, this);
        this.infoText.on('pointerdown', () => this.scene.showEnemyPopup(this));
    }

    takeDamage() {
        if (this.currentHealth === 0) {
            return;
        }
        this.currentHealth = Math.max(0, this.currentHealth - 10);
        this.updateHealthBar();
        if (this.currentHealth === 0) {
            this.sprite.setTexture('enemy_dead');
            this.scene.triggerVictory(this);
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

class UIElement {
    constructor(scene, x, y, width, height) {
        this.scene = scene;
        this.container = scene.add.container(x, y).setSize(width, height);
    }
    static fromImage(scene, x, y, imageKey, scale = 1) {
        const image = scene.add.image(0, 0, imageKey).setScale(scale);
        const { width, height } = image.getBounds();
        const uiElement = new UIElement(scene, x, y, width, height);
        uiElement.container.add(image);
        return uiElement;
    }

    setVisible(visible) {
        this.container.setVisible(visible);
    }

}

class Button extends UIElement {
    constructor(scene, x, y, imageKey, scale = 1, text = '', callback = () => { }) {
        const uiElement = UIElement.fromImage(scene, x, y, imageKey, scale);
        const { width, height } = uiElement.container;
        super(scene, x, y, width, height);

        const image = scene.add.image(0, 0, imageKey).setScale(scale);
        this.container.add(image);

        if (text) {
            const textObj = scene.add.text(0, 0, text, {
                fontSize: '24px',
                color: '#ffffff',
                fontStyle: 'bold'
            });
            textObj.setOrigin(0.5);
            this.container.add(textObj);
        }

        this.container.setSize(width, height)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', callback);
    }
}


class PlayerInfo extends UIElement {
    constructor(scene, x, y, key, scale, playerName, playerLevel) {
        const element = UIElement.fromImage(scene, 0, 0, key, scale);
        const { width, height } = element.container.getBounds();
        super(scene, x, y, width, height);

        // Image
        this.container.add(element.container);

        // Name
        this.playerNameText = scene.add.text(0, -height / 5, `Name: ${playerName}`, {
            fontSize: '16px',
            fill: '#000000',
        }).setOrigin(0.5);
        this.container.add(this.playerNameText);

        // Level
        this.playerLevelText = scene.add.text(0, height / 5, `Level: ${playerLevel}`, {
            fontSize: '16px',
            fill: '#000000',
        }).setOrigin(0.5);
        this.container.add(this.playerLevelText);

        // Close button
        const closeButton = scene.add.text(width / 2 - 50, -height / 2 + 50, 'X', {
            fontSize: '30px',
            fill: '#000000',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        closeButton.setInteractive({ useHandCursor: true }).on('pointerdown', () => {
            this.setVisible(false);
        });

        this.container.add(closeButton);
    }

    updatePlayerInfo(playerName, playerLevel) {
        this.playerNameText.setText(`Name: ${playerName}`);
        this.playerLevelText.setText(`Level: ${playerLevel}`);
    }
}


class VictoryInfo extends UIElement {
    constructor(scene, x, y, key, scale, xp, gold) {
        const element = UIElement.fromImage(scene, 0, 0, key, scale);
        const { width, height } = element.container.getBounds();
        super(scene, x, y, width, height);

        // Image
        this.container.add(element.container);

        this.victoryText = scene.add.text(0, -150, `Victory!`, {
            fontSize: '32px',
            fill: '#000000',
        }).setOrigin(0.5);
        this.container.add(this.victoryText);

        // Xp
        this.xpText = scene.add.text(0, -20, `XP: ${xp}`, {
            fontSize: '16px',
            fill: '#000000',
        }).setOrigin(0.5);
        this.container.add(this.xpText);

        // Gold
        this.goldText = scene.add.text(0, 20, `Gold: ${gold}`, {
            fontSize: '16px',
            fill: '#000000',
        }).setOrigin(0.5);
        this.container.add(this.goldText);

        // Close button
        const closeButton = scene.add.text(0, 150, 'Continue', {
            fontSize: '30px',
            fill: '#000000',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        closeButton.setInteractive({ useHandCursor: true }).on('pointerdown', () => {
            this.setVisible(false);
            scene.spawnNewEnemy();
        });

        this.container.add(closeButton);
    }

    updatePlayerInfo(playerName, playerLevel) {
        this.playerNameText.setText(`Name: ${playerName}`);
        this.playerLevelText.setText(`Level: ${playerLevel}`);
    }
}



class GameScene extends Phaser.Scene {
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
            { key: 'hero', path: 'dog.jpg' },
            { key: 'enemy', path: 'cat.jpg' },
            { key: 'enemy_dead', path: 'cat_dead.png' },
            { key: 'background', path: 'bg_grass.jpg' },
            { key: 'button', path: 'button.png' },
            { key: 'scroll', path: 'scroll.png' }
        ]);
    }

    loadImages(images) {
        images.forEach(image => this.load.image(image.key, chrome.runtime.getURL(image.path)));
    }

    create() {
        this.add.image(this.scale.width, this.scale.height / 3, 'background').setScale(0.5).setScrollFactor(0);

        const playerInfo = new PlayerInfo(this, 200, 650, 'scroll', 0.5, 'Ethan', 1);
        playerInfo.setVisible(false);
        this.add.existing(playerInfo.container);

        const playerInfoButton = new Button(this, 200, 825, 'button', 0.25, 'Player Info', () => {
            playerInfo.setVisible(true);
        });
        this.add.existing(playerInfoButton.container);



        this.player = new Player(this);
        this.spawnNewEnemy();
    }

    showEnemyPopup(enemy) {
        const textContent = `Name: ${enemy.name}\nLevel: ${enemy.level}\nType: ${enemy.type}\nHealth: ${enemy.currentHealth}/${enemy.maxHealth}`;
        this.enemyInfo.setText(textContent);
        this.enemyInfo.setVisible(true);
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
