import Phaser from 'phaser';


export default class LobbyScene extends Phaser.Scene {
    constructor() {
        super('LobbyScene');
    }

    init(data) {
        this.ws = data.ws;
        console.log("LobbyScene iniciada. WebSocket state:", this.ws.readyState);
    }

    create() {
        const { width, height } = this.scale;

        this.add.rectangle(0, 0, width, height, 0x000000, 0.6)
            .setOrigin(0);

        this.add.image(width / 2, height / 2, 'Frame')
            .setScale(0.8);

        this.statusText = this.add.text(
            width / 2,
            height / 2 - 40,
            'Waiting for opponent...',
            {
                fontFamily: 'Arial Black',
                fontSize: '48px',
                color: '#ffffff',
                align: 'center',
                stroke: '#000000',
                strokeThickness: 6
            }
        ).setOrigin(0.5);

        // Subtexto
        this.subText = this.add.text(
            width / 2,
            height / 2 + 40,
            'Searching online match',
            {
                fontFamily: 'Arial',
                fontSize: '28px',
                color: '#dddddd'
            }
        ).setOrigin(0.5);

        // Cancel button
        const cancelBtn = this.add.text(
            width / 2,
            height / 2 + 140,
            'Cancel',
            {
                fontFamily: 'Arial',
                fontSize: '36px',
                color: '#ffaaaa',
                stroke: '#000000',
                strokeThickness: 4
            }
        )
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

        cancelBtn.on('pointerdown', () => {
            this.leaveLobby();
            this.scene.start('MainMenuScene'); 
        });

        this.joinQueue();

        this.setupSocketListeners();
    }

    joinQueue() {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            console.error("LobbyScene: El WebSocket no está abierto. Estado:", this.ws ? this.ws.readyState : 'No WS');
            return;
        }

        console.log("Enviando 'joinQueue' al servidor...");
        this.ws.send(JSON.stringify({
            type: 'joinQueue'
        }));
    }

    setupSocketListeners() {
        this.ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            
            // ---  DEBUG LOG ---
            console.log('Mensaje recibido en Lobby:', msg); 
            // --------------------

            switch (msg.type) {

                case 'queueJoined':
                    this.statusText.setText('Waiting for opponent...');
                    break;

                case 'matchFound':
                    console.log('¡PARTIDA ENCONTRADA! Datos:', msg.payload);
                    console.log('Intentando iniciar RaceScene...');
                    this.startMatch(msg.payload);
                    break;

                case 'queueLeft':
                    this.scene.start('MainMenuScene');
                    break;
            }
        };
    }

    startMatch(payload) {
        // payload = { roomId, role }
        try {
            this.scene.start('OnlineSelectScene', {
                ws: this.ws,
                roomId: payload.roomId,
                role: payload.role
            });
            console.log("Iniciando selección de personaje...");
        } catch (e) {
            console.error("ERROR AL INICIAR SELECCIÓN:", e);
        }
    }

    leaveLobby() {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type: 'leaveQueue' }));
        }
    }
}