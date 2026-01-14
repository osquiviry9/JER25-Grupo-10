import Phaser from 'phaser';

export default class LobbyScene extends Phaser.Scene {
    constructor() {
        super('LobbyScene');
    }

    init(data) {
        this.ws = data.ws;
        this.currentMode = 'menu'; // menu, waiting, input
    }

    create() {
        const { width, height } = this.scale;

        // Background and frame
        this.add.rectangle(0, 0, width, height, 0x000000, 0.85).setOrigin(0);
        this.add.image(width / 2, height / 2, 'Frame').setScale(0.8);

    
        this.titleText = this.add.text(width / 2, height / 2 - 180, 'ONLINE LOBBY', {
            fontFamily: 'Arial Black', fontSize: '52px', color: '#ff69b4', stroke: '#ffffff', strokeThickness: 6
        }).setOrigin(0.5).setDepth(10);

        this.menuContainer = this.add.container(0, 0);
        
        // --- BUTTONS ---
        const btnQuick = this.createButton(width / 2, height / 2 - 30, 'QUICK MATCH', () => {
            this.showWaiting("Searching for opponent...");
            this.ws.send(JSON.stringify({ type: 'joinQueue' }));
        });

        const btnCreate = this.createButton(width / 2, height / 2 + 50, 'CREATE PRIVATE', () => {
            this.showWaiting("Creating room...");
            this.ws.send(JSON.stringify({ type: 'createPrivateRoom' }));
        });

        const btnJoin = this.createButton(width / 2, height / 2 + 130, 'JOIN PRIVATE', () => {
            this.showInput();
        });

        const btnBack = this.createButton(width / 2, height / 2 + 230, 'BACK', () => {
            this.leaveLobby();
        }, '#ffaaaa');

        this.menuContainer.add([btnQuick, btnCreate, btnJoin, btnBack]);

        // --- WAITING UI ---
        this.statusText = this.add.text(width / 2, height / 2, '', {
            fontFamily: 'Arial Black', fontSize: '32px', color: '#ffffff', align: 'center'
        }).setOrigin(0.5).setVisible(false).setDepth(20);

        this.cancelBtn = this.add.text(width / 2, height / 2 + 120, 'CANCEL', {
            fontFamily: 'Arial', fontSize: '28px', color: '#ffaaaa', stroke: '#000000', strokeThickness: 4
        }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setVisible(false).setDepth(20);
        
        this.cancelBtn.on('pointerdown', () => {
            this.ws.send(JSON.stringify({ type: 'leaveQueue' }));
            this.resetToMenu();
        });

        // Listeners of the Socket
        this.setupSocketListeners();
    }

    // --- BUTTON HELPER ---
    createButton(x, y, text, callback, color = '#ffffff') {
        const btn = this.add.text(x, y, text, {
            fontFamily: 'Arial Black', fontSize: '32px', color: color, stroke: '#000000', strokeThickness: 5
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        btn.on('pointerover', () => btn.setScale(1.1));
        btn.on('pointerout', () => btn.setScale(1));
        btn.on('pointerdown', () => {
            this.sound.play('clickSound'); 
            callback();
        });
        return btn;
    }

    // --- WAITING STATE ---
    showWaiting(message) {
        this.menuContainer.setVisible(false);
        this.cleanupInput(); 
        
        this.titleText.setVisible(false); 
        this.statusText.setText(message).setVisible(true);
        this.cancelBtn.setVisible(true);
    }

    resetToMenu() {
        this.menuContainer.setVisible(true);
        this.titleText.setVisible(true);
        this.statusText.setVisible(false);
        this.cancelBtn.setVisible(false);
        this.cleanupInput();
    }

    cleanupInput() {
        if(this.inputContainer) {
            this.inputContainer.destroy();
            this.inputContainer = null;
        }
        if (this.keyHandler) {
            this.input.keyboard.off('keydown', this.keyHandler);
            this.keyHandler = null;
        }
    }

    // --- CODE INPUT ---
    showInput(errorMessage = "") {
        this.menuContainer.setVisible(false);
        this.statusText.setVisible(false); // IMPORTANT!! ASI ESTA PERFECTO NO TRUE PARA NO MOLESTAR CAGARRO HISTÓRICO DE ERROR!!!
        this.cancelBtn.setVisible(false);
        this.cleanupInput();
        
        this.inputContainer = this.add.container(0, 0);
        const { width, height } = this.scale;

        const title = this.add.text(width/2, height/2 - 120, "ENTER ROOM CODE:", {
            fontFamily: 'Arial Black', fontSize: '36px', color: '#ffffff', stroke: '#000000', strokeThickness: 4
        }).setOrigin(0.5);

        const inputBox = this.add.rectangle(width/2, height/2, 300, 70, 0x222222)
            .setStrokeStyle(4, 0xff69b4);

        const codeText = this.add.text(width/2, height/2, "", {
            fontFamily: 'Arial Black', fontSize: '48px', color: '#ff69b4'
        }).setOrigin(0.5);

        const instruction = this.add.text(width/2, height/2 + 60, "Type 4 letters & Press ENTER", {
            fontFamily: 'Arial', fontSize: '20px', color: '#aaaaaa'
        }).setOrigin(0.5);

        // --- ERROR ---
        this.feedbackText = this.add.text(width/2, height/2 + 110, errorMessage, {
            fontFamily: 'Arial Black', fontSize: '24px', color: '#ffaa00', stroke: '#000000', strokeThickness: 4
        }).setOrigin(0.5);

        if (errorMessage) {
            //hansi FLICK effect 
            this.tweens.add({
                targets: this.feedbackText,
                alpha: 0.5,
                duration: 300,
                yoyo: true,
                repeat: 3
            });
        }

        const backBtn = this.createButton(width/2, height/2 + 180, "CANCEL", () => {
            this.resetToMenu();
        }, '#ffaaaa');

        this.inputContainer.add([title, inputBox, codeText, instruction, backBtn, this.feedbackText]);

        let currentCode = "";
        
        this.keyHandler = (event) => {
            if(this.feedbackText.text !== "") this.feedbackText.setText("");

            if (event.keyCode === 8 && currentCode.length > 0) { // Backspace
                currentCode = currentCode.slice(0, -1);
            } else if (event.keyCode === 13 && currentCode.length > 0) { // Enter
                this.ws.send(JSON.stringify({ type: 'joinPrivateRoom', payload: { roomCode: currentCode } }));
                this.showWaiting(`Joining room ${currentCode}...`);
            } else if (event.key.length === 1 && currentCode.length < 4) { 
                if (/[a-zA-Z0-9]/.test(event.key)) {
                    currentCode += event.key.toUpperCase();
                }
            }
            codeText.setText(currentCode);
        };

        this.input.keyboard.on('keydown', this.keyHandler);
    }

    setupSocketListeners() {
        this.ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);

            switch (msg.type) {
                case 'queueJoined':
                    break;

                case 'matchFound':
                    this.startMatch(msg.payload);
                    break;

                case 'privateRoomCreated':
                    this.statusText.setText(`WAITING FOR OPPONENT\n\nSHARE CODE:\n${msg.payload.roomId}`);
                    break;

                case 'joinError':
                    this.showInput("ERROR:" + msg.payload.message.toUpperCase());
                    break;
            }
        };
    }

    startMatch(payload) {
        this.cleanupInput();
        this.scene.start('OnlineSelectScene', {
            ws: this.ws,
            roomId: payload.roomId,
            role: payload.role
        });
    }

    leaveLobby() {
        this.cleanupInput();
        this.ws.close(); 
        this.scene.start('MainMenuScene');
    }
}