import Phaser from 'phaser';

export default class SettingsScene extends Phaser.Scene {
    constructor() {
        super('SettingsScene');
    }

    preload() {

        //Click sound
        this.load.audio('clickSound', 'assets/sound/click.mp3');

        // Background color
        this.load.image('ColorBackground', 'assets/Backgrounds/fondoPlano.jpeg');

        // Buttons
        // Back button
        this.load.image('bttnBack', 'assets/Buttons/BackTemp.png');
        this.load.image('bttnBackHover', 'assets/Buttons/BackTemp.png');

        // Music button
        this.load.image('bttnMusic', 'assets/Buttons/soundbttn.png');
        this.load.image('bttnMusicHover', 'assets/Buttons/soundbttn_hover.png');
        
    }

    create() {

        this.music = this.sound.add('clickSound', {
            });

        const { width, height } = this.scale;

        // Volumen inicial (de 0 a 10)
        this.volumeLevel = this.game.volumeLevel ?? 5;
        this.maxVolume = 10;

        this.cameras.main.setBackgroundColor('#000000ff'); 

        // General color background
        this.add.image(width / 2, height / 2, 'ColorBackground');

        const title = this.add.text(width / 2, height * 0.25, 'SETTINGS (completar)', {
            fontFamily: 'Arial',
            fontSize: '64px',
            fontStyle: 'bold',
            color: '#ff69b4',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        // Guardamos la escena anterior
        this.previousScene = this.scene.settings.data.previousScene;

        // ----------- BOTÓN BACK -----------
        const backBtn = this.add.image((width / 2) - 800, (height / 2) - 300, 'bttnBack')
            .setInteractive({ useHandCursor: true })
            .setScale(1);

        // Hover
        backBtn.on('pointerover', () => {
            backBtn.setTexture('bttnBackHover');
            backBtn.setScale(1.05);
        });

        backBtn.on('pointerout', () => {
            backBtn.setTexture('bttnBack');
            backBtn.setScale(1);
        });

        // volver a la escena anterior
        backBtn.on('pointerdown', () => {
            
            this.music.play(); 
            this.scene.start(this.previousScene);

            
            //this.scene.stop('SettingsScene');                 // cierra la escena de opciones
            //this.scene.resume(this.previousScene); // vuelve a la escena que la abrió
        });


        //Button list
        const buttons = [
            { x: width * 0.5, y: height * 0.5, key: 'bttnMusic', hover: 'bttnMusicHover', action: () => console.log('On/off music'), scale: 1},
        ];

        buttons.forEach(btn => {
            const button = this.add.image(btn.x, btn.y, btn.key)
                .setInteractive({ useHandCursor: true })
                .setScale(btn.scale);
            // Hover
            button.on('pointerover', () => {
                button.setTexture(btn.hover);
                button.setScale(btn.scale * 1.05);
            });

            // Salir hover
            button.on('pointerout', () => {
                button.setTexture(btn.key);
                button.setScale(btn.scale);
            });

            // Click
            button.on('pointerdown', () => {
                btn.action();     
                this.music.play(); 
            });
        });

        // Posición base de la barra
        const barX = width * 0.5 - 150;
        const barY = height * 0.65;

        // Dibujar la barra inicial
        this.volumeBars = [];
        for (let i = 0; i < this.maxVolume; i++) {
          const bar = this.add.rectangle(barX + i * 30, barY, 20, 40, i < this.volumeLevel ? 0xff69b4 : 0x808080);
            this.volumeBars.push(bar);
        }
        
        // Botones de volumen
        const minusButton = this.add.text(barX - 60, barY, '–', {
            fontFamily: 'Arial',
         fontSize: '64px',
         color: '#ffffff'
        }).setInteractive({ useHandCursor: true }).setOrigin(0.5);

        const plusButton = this.add.text(barX + this.maxVolume * 30 + 40, barY, '+', {
          fontFamily: 'Arial',
           fontSize: '64px',
           color: '#ffffff'
        }).setInteractive({ useHandCursor: true }).setOrigin(0.5);

        // Eventos
        minusButton.on('pointerdown', () => {
            this.changeVolume(-1);
            this.music.play();
        });


        plusButton.on('pointerdown', () => {
            this.changeVolume(1);
            this.music.play();
        });

        // Zoom camera
        const margin = 0.8;
        const zoomX = (width * margin) / width;
        const zoomY = (height * margin) / height;
        const zoom = Math.min(zoomX, zoomY);

        this.cameras.main.setZoom(zoom);
        this.cameras.main.centerOn(width / 2, height / 2);
    }

    changeVolume(delta) {
    this.volumeLevel = Phaser.Math.Clamp(this.volumeLevel + delta, 0, this.maxVolume);

    // Actualiza visualmente la barra
    for (let i = 0; i < this.maxVolume; i++) {
        this.volumeBars[i].setFillStyle(i < this.volumeLevel ? 0xff69b4 : 0x808080);
    }

    // Ajusta volumen global del juego (si usas música o sonidos)
    this.sound.volume = this.volumeLevel / this.maxVolume;
    this.game.volumeLevel = this.volumeLevel;
    }

}

//PARA CAMBIAR ACCEDER AL VOLUMEN EN CUALQUIER ESCENA USAD ESTA LINEA DE CÓDIGO 
// this.sound.volume = (this.game.volumeLevel ?? 5) / 10; Inicializa todo el sonido que se reproduzca en la escena a los valores en predeterminados de los ajustes.
//Ponedlo junto con el código que useis para poner la música en cada escena, antes o después eso ya no sé no he probado :o
