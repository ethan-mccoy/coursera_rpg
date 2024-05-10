import { UIElement } from "./UIElement.js";

export class VictoryInfo extends UIElement {
    constructor(scene, x, y, key, scale, xp, gold) {
        const element = UIElement.fromImage(scene, 0, 0, key, scale);
        const { width, height } = element.container.getBounds();
        super(scene, x, y, width, height);

        // Image
        this.container.add(element.container);
        this.container.setDepth(1);

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

}