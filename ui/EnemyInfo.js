import { UIElement } from "./UIElement.js";

export class EnemyInfo extends UIElement {
    constructor(scene, x, y, key, scale, enemyName, enemyLevel, enemyType) {
        const element = UIElement.fromImage(scene, 0, 0, key, scale);
        const { width, height } = element.container.getBounds();
        super(scene, x, y, width, height);

        // Image
        this.container.add(element.container);

        // Name
        this.enemyNameText = scene.add.text(0, -height / 5, `${enemyName} \n Level ${enemyLevel} ${enemyType} `, {
            fontSize: '16px',
            fill: '#000000',
        }).setOrigin(0.5);
        this.container.add(this.enemyNameText);

        // Level
        this.enemyLevelText = scene.add.text(0, height / 5, `Level: ${enemyLevel}`, {
            fontSize: '16px',
            fill: '#000000',
        }).setOrigin(0.5);
        this.container.add(this.enemyLevelText);

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

}