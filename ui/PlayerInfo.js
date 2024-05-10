import { UIElement, Button } from "./UIElement.js";

export class PlayerInfo extends UIElement {
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

        // Player Info Button
        const playerInfoButton = new Button(scene, 200, 825, 'button', 0.25, 'Player Info', () => {
            this.setVisible(true); 
        });
        scene.add.existing(playerInfoButton.container);

        this.setVisible(false);
    }

    updatePlayerInfo(playerName, playerLevel) {
        this.playerNameText.setText(`Name: ${playerName}`);
        this.playerLevelText.setText(`Level: ${playerLevel}`);
    }
}