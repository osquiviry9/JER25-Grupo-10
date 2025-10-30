import Phaser from 'phaser';

export default class MainMenuScene extends Phaser.Scene {
    constructor() {
        super('MainMenuScene');
    }

    create() {
        const { width, height } = this.scale;

        const title = this.add.text(width / 2, height * 0.25, 'PONYNG AROUND', {
            fontFamily: 'Arial',
            fontSize: '64px',
            fontStyle: 'bold',
            color: '#ff69b4', 
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        this.tweens.add({
            targets: title,
            scale: { from: 1, to: 1.05 },
            yoyo: true,
            repeat: -1,
            duration: 800
        });

        const menuItems = [
            { label: 'JUGAR', scene: 'GameScene' },
            { label: 'AJUSTES', action: () => console.log('Abrir ajustes') },
            { label: 'CRÉDITOS', action: () => console.log('Mostrar créditos') }
        ];

        let startY = height * 0.45;

        menuItems.forEach((item, i) => {
            const button = this.add.text(width / 2, startY + i * 70, item.label, {
                fontFamily: 'Arial',
                fontSize: '40px',
                color: '#ffffff'
            })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

            button.on('pointerover', () => {
                button.setColor('#ff69b4');
                button.setScale(1.15);
            });

            button.on('pointerout', () => {
                button.setColor('#ffffff');
                button.setScale(1);
            });

            button.on('pointerdown', () => {
                if (item.scene) {
                    this.scene.start(item.scene);
                } else if (item.action) {
                    item.action();
                }
            });
        });
    }
}
