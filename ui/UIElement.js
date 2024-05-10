export class UIElement {
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

    destroy() {
        this.container.destroy();
    }
}


export class Button extends UIElement {
    constructor(scene, x, y, imageKey, scale = 1, text = '', fontSize = '24px', color = '#000000', callback = () => { }) {
        const uiElement = UIElement.fromImage(scene, x, y, imageKey, scale);
        const { width, height } = uiElement.container;
        super(scene, x, y, width, height);

        const image = scene.add.image(0, 0, imageKey).setScale(scale);
        this.container.add(image);

        if (text) {
            const textObj = scene.add.text(0, 0, text, {
                fontSize: fontSize,
                color: color,
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