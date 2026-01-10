import Phaser from 'phaser';

export default class OnlineSelectScene extends Phaser.Scene {
    constructor() {
        super('OnlineSelectScene');
        
        this.mySelection = { index: 0, confirmed: false };
        this.rivalSelection = { index: 0, confirmed: false };

        this.ponies = [
            { key: 'Ache', path: 'assets/ponis/Ache/Ache_Complete.png' },
            { key: 'Haiire', path: 'assets/ponis/Haire/Haire_Complete.png' },
            { key: 'Domdomdadom', path: 'assets/ponis/Dod/Dom_Complete.png' },
            { key: 'Kamil', path: 'assets/ponis/Kamil/Kamil_Complete.png' },
            { key: 'Beersquiviry', path: 'assets/ponis/Beersquiviri/Beer_Complete.png' },
        ];
    }

    init(data) {
        this.ws = data.ws;
        this.roomId = data.roomId;
        this.role = data.role; 
        
        this.mySide = (this.role === 'player1') ? 'p1' : 'p2';
        this.rivalSide = (this.role === 'player1') ? 'p2' : 'p1';
        
        console.log(`SelectScene Online. Soy ${this.role} (${this.mySide})`);
    }

    preload() { /* IN BOOT SCENE */}

    create() {
        const { width, height } = this.scale;
        this.music = this.sound.add('clickSound');
        
        this.setupSocketListeners();

        this.cameras.main.setBackgroundColor('#000000');
        this.add.image(width / 2, height / 2, 'pinkBackground').setOrigin(0.5);
        this.add.image(width / 2, height / 2, 'Frame').setDepth(10);
        
        this.add.text(width / 2, 100, 'Online Selection', {
            fontSize: '50px',
            fontFamily: 'Arial Black',
            color: '#ff69b4',
            stroke: '#ffffff',
            strokeThickness: 6
        }).setOrigin(0.5);

        // Paneles
        this.createCharacterPanel('p1', width * 0.29, height * 0.55);
        this.createCharacterPanel('p2', width * 0.71, height * 0.55);

        this.statusText = this.add.text(width / 2, height - 100, 'Waiting for players...', {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#ffffff',
            backgroundColor: '#00000088'
        }).setOrigin(0.5).setDepth(20);

        // Teclado
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        this.updatePanelVisuals('p1', 0);
        this.updatePanelVisuals('p2', 0);
    }

    createCharacterPanel(side, x, y) {
        this[`img_${side}`] = this.add.image(x, y - 40, 'Ache_static')
            .setOrigin(0.5).setScale(0.5);
            
        this[`name_${side}`] = this.add.text(x, y - 380, 'Ache', {
            fontSize: '28px', fontFamily: 'Arial Black', color: '#000'
        }).setOrigin(0.5);

        this[`status_${side}`] = this.add.text(x, y + 320, 'SELECTING', {
            fontSize: '32px', fontFamily: 'Arial Black', color: '#ffffff', backgroundColor: '#555555'
        }).setOrigin(0.5);

        if (side === this.mySide) {
            
            // Flecha Izquierda
            const leftBtn = this.add.image(x - 300, y, 'arrowIzq')
                .setInteractive({ useHandCursor: true })
                .setScale(0.4);

            leftBtn.on('pointerover', () => { leftBtn.setTexture('arrowIzqOn'); leftBtn.setScale(0.45); });
            leftBtn.on('pointerout', () => { leftBtn.setTexture('arrowIzq'); leftBtn.setScale(0.4); });
            leftBtn.on('pointerdown', () => {
                this.changeSelection(-1); 
            });

            const rightBtn = this.add.image(x + 300, y, 'arrowDer')
                .setInteractive({ useHandCursor: true })
                .setScale(0.4);

            rightBtn.on('pointerover', () => { rightBtn.setTexture('arrowDerOn'); rightBtn.setScale(0.45); });
            rightBtn.on('pointerout', () => { rightBtn.setTexture('arrowDer'); rightBtn.setScale(0.4); });
            rightBtn.on('pointerdown', () => {
                this.changeSelection(1); 
            });
            
            const confirmBtn = this[`btnConfirm_${side}`] = this.add.text(x, y + 200, 'CONFIRM (W)', {
                fontSize: '28px', fontFamily: 'Arial Black', backgroundColor: '#ff69b4', color: '#fff', padding: { x: 10, y: 5 }
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });

            confirmBtn.on('pointerdown', () => this.confirmSelection());
        }
    }

    // --- UNIFY LOGIC ---
    changeSelection(direction) {
        if (this.mySelection.confirmed) return; 
        
        this.music.play();
        const total = this.ponies.length;
        this.mySelection.index = (this.mySelection.index + direction + total) % total;
        
        this.updatePanelVisuals(this.mySide, this.mySelection.index);
        this.sendUpdate();
    }

    confirmSelection() {
        if (this.mySelection.confirmed) return;
        
        this.music.play();
        this.mySelection.confirmed = true;
        this.updateReadyState(this.mySide, true);
        
        if (this[`btnConfirm_${this.mySide}`]) this[`btnConfirm_${this.mySide}`].setVisible(false);

        this.sendUpdate(); 
        this.checkGameStart(); 
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.cursors.left) || Phaser.Input.Keyboard.JustDown(this.keyA)) {
            this.changeSelection(-1);
        }
        if (Phaser.Input.Keyboard.JustDown(this.cursors.right) || Phaser.Input.Keyboard.JustDown(this.keyD)) {
            this.changeSelection(1);
        }
        if (Phaser.Input.Keyboard.JustDown(this.cursors.up) || 
            Phaser.Input.Keyboard.JustDown(this.keyW) || 
            Phaser.Input.Keyboard.JustDown(this.keyEnter)) {
            this.confirmSelection();
        }
    }

    setupSocketListeners() {
        this.ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            
            if (msg.type === 'characterSelectUpdate') {
                const { from, charIndex, confirmed } = msg.payload;
                if (from !== this.role) {
                    this.rivalSelection.index = charIndex;
                    this.rivalSelection.confirmed = confirmed;
                    this.updatePanelVisuals(this.rivalSide, charIndex);
                    this.updateReadyState(this.rivalSide, confirmed);
                    this.checkGameStart();
                }
            } 
            else if (msg.type === 'startGameSignal') {
                this.startGame();
            }
            else if (msg.type === 'opponentDisconnected') {
                this.scene.start('MainMenuScene');
            }
        };
    }

    updatePanelVisuals(side, index) {
        const pony = this.ponies[index];
        if(this[`img_${side}`]) this[`img_${side}`].setTexture(`${pony.key}_static`);
        if(this[`name_${side}`]) this[`name_${side}`].setText(pony.key);
    }

    updateReadyState(side, confirmed) {
        const textObj = this[`status_${side}`];
        if (confirmed) {
            textObj.setText("READY!");
            textObj.setStyle({ backgroundColor: '#00aa00' });
        } else {
            textObj.setText("SELECTING");
            textObj.setStyle({ backgroundColor: '#555555' });
        }
    }

    sendUpdate() {
        if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({
                type: 'characterSelect',
                payload: {
                    roomId: this.roomId,
                    charIndex: this.mySelection.index,
                    confirmed: this.mySelection.confirmed
                }
            }));
        }
    }

    checkGameStart() {
        if (this.mySelection.confirmed && this.rivalSelection.confirmed) {
            this.statusText.setText("BOTH READY! STARTING...");
            if (this.role === 'player1') {
                this.time.delayedCall(1000, () => {
                     this.ws.send(JSON.stringify({
                        type: 'startGame',
                        payload: { roomId: this.roomId }
                    }));
                });
            }
        } else if (this.mySelection.confirmed) {
            this.statusText.setText("Waiting for opponent...");
        }
    }

    startGame() {
        const p1Index = (this.role === 'player1') ? this.mySelection.index : this.rivalSelection.index;
        const p2Index = (this.role === 'player2') ? this.mySelection.index : this.rivalSelection.index;

        this.registry.set('player1Character', this.ponies[p1Index]);
        this.registry.set('player2Character', this.ponies[p2Index]);

        // ==========ESTO NO FUNCIONA CREO QUE EL ERROR ESTÁ AQUI ME VOY A MATAR AAAA===//

        // --- SAVING THE PONI ---
        const userId = localStorage.getItem('userId');
        // PONI OF THE USER
        const myPony = this.ponies[this.mySelection.index];

        if (userId && myPony) {
             fetch(`/api/users/${userId}/pony`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pony: myPony.key })
            }).catch(e => console.error("Error saving stats:", e));
        }
       

        this.scene.start('RaceScene', {
            ws: this.ws,
            roomId: this.roomId,
            role: this.role,
            online: true
        });
    }
}