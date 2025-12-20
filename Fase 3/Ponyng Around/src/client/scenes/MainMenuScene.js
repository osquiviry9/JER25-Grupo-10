import Phaser from 'phaser';
import { connectionManager } from '@client/services/ConnectionManager.js';


export default class MainMenuScene extends Phaser.Scene {
    constructor() {
        super('MainMenuScene');
    }

    preload() { /* IN BootScene.js */ }

    create() {
        const nickname = localStorage.getItem('nickname') ?? 'NoUserName';
        const userId = localStorage.getItem('userId');



        // BACKGROUND MUSIC
        this.game.windSound.stop();

        this.game.bgchMusic = this.sound.add('selectionSong', {
            loop: true,
            volume: (this.game.musicLevel ?? 5) / 10
        });
        this.game.bgchMusic.play();

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

        
        // ONLINE USERS COUNTER  FUCK THIS SHIT no puedo más poner bien lo de online

        const frame = this.add.image(width / 2, height / 2, 'Frame')
            .setDepth(3)
            .setScale(0.8);

        const frameWidth = frame.width * frame.scaleX;
        const frameHeight = frame.height * frame.scaleY;

        // Supuesta posicion pero no funciona AAAAAA
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

        // Listen for connection updates
        connectionManager.addListener((data) => {
            this.connectedText.setText("Online: " + data.count);
        });
        // BUTTONS
        const buttons = [
            { x: width * 0.5, y: height * 0.2, key: 'bttnPlay', hover: 'bttnPlayHover', action: () => { this.scene.start('CharacterSelectScene'); this.game.bgchMusic.stop(); this.cameras.main.fadeOut(600, 0, 0, 0); }, scale: 0.9 },
            { x: width * 0.84, y: height * 0.8, key: 'bttnSettings', hover: 'bttnSettingsHover', action: () => { this.scene.start('SettingsScene', { previousScene: this.scene.key }); this.game.bgchMusic.stop() }, scale: 1 },
            { x: width * 0.24, y: height * 0.35, key: 'bttnCredits', hover: 'bttnCreditsHover', action: () => { this.scene.start('CreditsScene'); this.game.bgchMusic.stop() }, scale: 0.7 },
            { x: width * 0.17, y: height * 0.8, key: 'bttnStory', hover: 'bttnStoryHover', action: () => { this.scene.start('StoryScene'); this.game.bgchMusic.stop() }, scale: 0.75 },
            { x: width * 0.85, y: height * 0.35, key: 'bttnExit', hover: 'bttnExitHover', action: () => { this.time.delayedCall(50, () => { this.game.destroy(true); }); this.game.bgchMusic.stop() }, scale: 0.75 },
            { x: width * 0.72, y: height * 0.35, key: 'bttnPlay', hover: 'bttnPlayHover', action: () => { this.startOnlineLobby(); }, scale: 0.75 }

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
                btn.action();
                this.music.play();
            });
        });

        // Defines starting volume
        if (this.game.volumeLevel === undefined) {
            const savedVolume = localStorage.getItem('gameVolume');
            this.game.volumeLevel = savedVolume ? parseInt(savedVolume) : 5;
        }

        this.sound.volume = this.game.volumeLevel / 10;

        // Default controls
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

    startOnlineLobby() {
        const ws = new WebSocket(`ws://${window.location.host}`);
        ws.onopen = () => {
            this.game.bgchMusic.stop();
            this.scene.start('LobbyScene', { ws });
        };
    }

    updateUserInfo() {
        const userId = localStorage.getItem('userId');
        const nickname = localStorage.getItem('nickname');

        if (!userId || !this.userInfoText) return;

        fetch(`/users/${userId}`)
            .then(res => res.json())
            .then(user => {
                const fav = user.favoritePony ?? '—';
                this.userInfoText.setText(
                    `Player: ${nickname}\nFavorite pony: ${fav}`
                );
            })
            .catch(() => { });
    }
}