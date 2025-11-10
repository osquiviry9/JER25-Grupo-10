import Phaser from 'phaser';

export default class PauseScene extends Phaser.Scene {
    constructor() {
        super('PauseScene');
    }

    preload() {

        // Fondo base
        this.load.image('ColorBackground', 'assets/Backgrounds/fondoPlano.jpeg');

        // Botón reanudar
        this.load.image('bttnBack', 'assets/Buttons/BackTemp.png');
        this.load.image('bttnBackHover', 'assets/Buttons/BackTemp.png');

        // Botón salir al menú principal
        this.load.image('bttnExit', 'assets/Buttons/exitbttn.png');
        this.load.image('bttnExitHover', 'assets/Buttons/exitbttn_hover.png');
    }

    create() {
        const { width, height } = this.scale;

        // Traer esta escena al frente por si acaso se pilla con el depth
        this.scene.bringToTop();

        // Overlay semitransparente aunque lo podemos cambiar!!!
        this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.6)
            .setDepth(10);

        // Fondo decorativo suave
        this.add.image(width / 2, height / 2, 'ColorBackground')
            .setAlpha(0.3)
            .setDepth(9);

        // Título
        this.add.text(width / 2, height * 0.25, 'PAUSA', {
            fontFamily: 'Arial Black',
            fontSize: '64px',
            color: '#ff69b4',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5).setDepth(11);

        // ----------- BOTÓN REANUDAR -----------
        const resumeBtn = this.add.image(width / 2 - 300, height / 2 + 50, 'bttnBack')
            .setInteractive({ useHandCursor: true })
            .setScale(1)
            .setDepth(11);

        // Hover reanudar
        resumeBtn.on('pointerover', () => {
            resumeBtn.setTexture('bttnBackHover');
            resumeBtn.setScale(1.05);
        });
        resumeBtn.on('pointerout', () => {
            resumeBtn.setTexture('bttnBack');
            resumeBtn.setScale(1);
        });
        resumeBtn.on('pointerdown', () => {
            this.scene.stop();               // cierra la escena de pausa
            this.scene.resume('RaceScene');  // reanuda la carrera!!!!
        });

        // ----------- BOTÓN MENÚ PRINCIPAL -----------
        const menuBtn = this.add.image(width / 2 + 300, height / 2 + 50, 'bttnExit')
            .setInteractive({ useHandCursor: true })
            .setScale(1)
            .setDepth(11);

        // Hover menú principal
        menuBtn.on('pointerover', () => {
            menuBtn.setTexture('bttnExitHover');
            menuBtn.setScale(1.05);
        });
        menuBtn.on('pointerout', () => {
            menuBtn.setTexture('bttnExit');
            menuBtn.setScale(1);
        });
        menuBtn.on('pointerdown', () => {
            // Detiene todo y vuelve al menú principal
            this.scene.stop('PauseScene');     // cierra la pausa
            this.scene.stop('RaceScene');      // detiene la carrera
            this.scene.start('MainMenuScene'); // va al menú principal
        });

        // Resume with "esc"??? podemos sino quitarlo 
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.stop();
            this.scene.resume('RaceScene');
        });

        const margin = 0.8;
        const zoomX = (width * margin) / width;
        const zoomY = (height * margin) / height;
        const zoom = Math.min(zoomX, zoomY);
        this.cameras.main.setZoom(zoom);
        this.cameras.main.centerOn(width / 2, height / 2);
    }
}
