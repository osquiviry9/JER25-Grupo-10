import Phaser from 'phaser';

export default class MainMenuScene extends Phaser.Scene {
    constructor() {
        super('MainMenuScene');
    }

    preload() {

        //Click sound
        this.load.audio('clickSound', 'assets/sound/click.mp3');

        // Background
        this.load.image('menuBackground', 'assets/Backgrounds/StartingMenu.JPG');
        
        // Frame
        this.load.image('Frame', 'assets/Elements/GreenFrame.PNG');

        // Buttons
        // Play button
        this.load.image('bttnPlay', 'assets/Buttons/playbttn.png');
        this.load.image('bttnPlayHover', 'assets//Buttons/playbttn_hover.png');

        // Settings button
        this.load.image('bttnSettings', 'assets/Buttons/settingsbttn.png');
        this.load.image('bttnSettingsHover', 'assets/Buttons/settingsbttn_hover.png');

        // Credit button
        this.load.image('bttnCredits', 'assets/Buttons/creditsbttn.png');
        this.load.image('bttnCreditsHover', 'assets/Buttons/creditsbttn_hover.png');

        // Story button
        this.load.image('bttnStory', 'assets/Buttons/loreBttn.PNG');
        this.load.image('bttnStoryHover', 'assets/Buttons/loreBttn_hover.PNG');


    }

    create() {

        this.music = this.sound.add('clickSound', {
        });

        const { width, height } = this.scale;

        this.cameras.main.setBackgroundColor('#000000');

        const bg = this.add.image(width / 2, height / 2, 'menuBackground');
        bg.setOrigin(0.5);
        bg.setScale(0.8);

        // Frame
        this.add.image(width / 2, height / 2, 'Frame').setDepth(3).setScale(0.8);

        // Button list
        const buttons = [
            { x: width * 0.5, y: height * 0.2, key: 'bttnPlay', hover: 'bttnPlayHover', action: () => this.scene.start('CharacterSelectScene'), scale: 0.9 },
            { x: width * 0.84, y: height * 0.8, key: 'bttnSettings', hover: 'bttnSettingsHover', action: () => this.scene.start('SettingsScene', { previousScene: this.scene.key }), scale: 1 },
            { x: width * 0.24, y: height * 0.35, key: 'bttnCredits', hover: 'bttnCreditsHover', action: () => this.scene.start('CreditsScene'), scale: 0.7 },
            { x: width * 0.17, y: height * 0.8, key: 'bttnStory', hover: 'bttnStoryHover', action: () => this.scene.start('StoryScene'), scale: 0.75},
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

            //Exit hover
            button.on('pointerout', () => {
                button.setTexture(btn.key);
                button.setScale(btn.scale);
            });

            // Click + sound
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

        // Adjust total volume of Phaser Sound
        this.sound.volume = this.game.volumeLevel / 10;

        // Defines starting controls, so they can be changed in Settings Menu
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
    }
}
