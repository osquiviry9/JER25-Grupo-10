import Phaser from 'phaser';
import { connectionManager } from '@client/services/ConnectionManager.js'; // Asegúrate que la ruta sea correcta según tu proyecto

export default class MainMenuScene extends Phaser.Scene {
    constructor() {
        super('MainMenuScene');
    }

    preload() { /* IN BootScene.js */ }

    create() {
        const nickname = localStorage.getItem('nickname') ?? 'NoUserName';
        const userId = localStorage.getItem('userId');

        // BACKGROUND MUSIC
        if (this.game.windSound) this.game.windSound.stop();

        // Evitar que la música se solape si ya está sonando
        if (!this.game.bgchMusic || !this.game.bgchMusic.isPlaying) {
            this.game.bgchMusic = this.sound.add('selectionSong', {
                loop: true,
                volume: (this.game.musicLevel ?? 5) / 10
            });
            this.game.bgchMusic.play();
        }

        this.music = this.sound.add('clickSound', {});

        const { width, height } = this.scale;

        this.cameras.main.setBackgroundColor('#000000');
        this.cameras.main.fadeIn(1000, 0, 0, 0);

        const bg = this.add.image(width / 2, height / 2, 'menuBackground');
        bg.setOrigin(0.5);
        bg.setScale(0.8);

        // FRAME
        this.add.image(width / 2, height / 2, 'Frame')
            .setDepth(3)
            .setScale(0.8);

        // =====================
        // USER INFO DISPLAY 
        // =====================

        this.userInfoText = this.add.text(
            width / 2,
            height / 2 + 260,
            `Player: ${nickname}\nFavorite pony: —`,
            {
                fontFamily: 'Arial Black',
                fontSize: '28px',
                color: '#ffffff',
                align: 'center',
                stroke: '#000000',
                strokeThickness: 5
            }
        ).setOrigin(0.5).setDepth(10);
        
        // =====================
        // ONLINE USERS COUNTER 
        // =====================

        const frame = this.add.image(width / 2, height / 2, 'Frame')
            .setDepth(3)
            .setScale(0.8);
            
        // Posicionamiento relativo al marco
        const frameWidth = frame.width * frame.scaleX;
        const frameHeight = frame.height * frame.scaleY;
        const paddingX = 40;
        const paddingY = 30;
        const onlineX = frame.x + frameWidth / 2 - paddingX;
        const onlineY = frame.y - frameHeight / 2 + paddingY;

        this.connectedText = this.add.text(
            onlineX,
            onlineY,
            "Online: ...",
            {
                fontFamily: "Arial",
                fontSize: "36px",
                color: "#ffffff",
                align: "right",
                stroke: "#000000",
                strokeThickness: 6,
                shadow: { offsetX: 2, offsetY: 2, blur: 4, fill: true }
            }
        )
        .setOrigin(1, 0)
        .setDepth(10);

        // Escuchar actualizaciones del ConnectionManager (Polling REST)
        connectionManager.addListener((data) => {
            if (this.connectedText.active) {
                this.connectedText.setText("Online: " + data.count);
            }
        });

        // =====================
        // BUTTONS
        // =====================
        
        // PLAY
        const playAction = () => {
            this.cameras.main.fadeOut(600, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                 this.scene.start('CharacterSelectScene'); 
                 // Nota: No paramos la música aquí para que siga en la selección
            });
        };

        const buttons = [
            // Botón central grande (PLAY)
            { 
                x: width * 0.5, 
                y: height * 0.2, 
                key: 'bttnPlay', 
                hover: 'bttnPlayHover', 
                action: playAction, 
                scale: 0.9 
            },
            /* BOTON DE JUGAR ONLINE NO AÑADIR
            { 
                x: width * 0.72, 
                y: height * 0.35, 
                key: 'bttnPlay', 
                hover: 'bttnPlayHover', 
                action: playAction, 
                scale: 0.75 
            },*/
            { x: width * 0.84, y: height * 0.8, key: 'bttnSettings', hover: 'bttnSettingsHover', action: () => { this.scene.start('SettingsScene', { previousScene: this.scene.key }); }, scale: 1 },
            { x: width * 0.24, y: height * 0.35, key: 'bttnCredits', hover: 'bttnCreditsHover', action: () => { this.scene.start('CreditsScene'); }, scale: 0.7 },
            { x: width * 0.17, y: height * 0.8, key: 'bttnStory', hover: 'bttnStoryHover', action: () => { this.scene.start('StoryScene'); }, scale: 0.75 },
            { x: width * 0.85, y: height * 0.35, key: 'bttnExit', hover: 'bttnExitHover', action: () => { this.time.delayedCall(50, () => { this.game.destroy(true); }); }, scale: 0.75 }
        ];

        buttons.forEach(btn => {
            const button = this.add.image(btn.x, btn.y, btn.key)
                .setInteractive({ useHandCursor: true })
                .setScale(btn.scale);

            button.on('pointerover', () => {
                button.setTexture(btn.hover);
                button.setScale(btn.scale * 1.05);
            });

            button.on('pointerout', () => {
                button.setTexture(btn.key);
                button.setScale(btn.scale);
            });

            button.on('pointerdown', () => {
                this.music.play();
                btn.action();
            });
        });

        if (this.game.volumeLevel === undefined) {
            const savedVolume = localStorage.getItem('gameVolume');
            this.game.volumeLevel = savedVolume ? parseInt(savedVolume) : 5;
        }
        this.sound.volume = this.game.volumeLevel / 10;

        if (!this.registry.get('controls')) {
            this.registry.set('controls', {
                jumpTop: 'W',
                jumpBottom: 'UP',
                accelTop: 'S',
                accelBottom: 'I',
                slowTop: 'NUMPAD_EIGHT',
                slowBottom: 'NUMPAD_TWO'
            });
        }

        this.updateUserInfo();
    }

    updateUserInfo() {
        const userId = localStorage.getItem('userId');
        const nickname = localStorage.getItem('nickname');

        if (!userId || !this.userInfoText) return;

        fetch(`/api/users/${userId}`)
            .then(res => {
                if (!res.ok) throw new Error("User not found");
                return res.json();
            })
            .then(user => {
                const fav = user.favoritePony ?? '—';
                this.userInfoText.setText(
                    `Player: ${nickname}\nFavorite pony: ${fav}`
                );
            })
            .catch((err) => {
                console.log("Error fetching user info:", err);
            });
    }
}