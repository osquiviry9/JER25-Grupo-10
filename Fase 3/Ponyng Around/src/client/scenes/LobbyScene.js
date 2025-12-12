import Phaser from 'phaser';

export default class LobbyScene extends Phaser.Scene {
    constructor() {
        super('LobbyScene');
    }

    init(data) {
        // Recibimos el websocket desde el menú
        this.ws = data.ws;
    }

    create() {
        const { width, height } = this.scale;

        // Fondo oscuro
        this.add.rectangle(0, 0, width, height, 0x000000, 0.6)
            .setOrigin(0);

        // Frame
        this.add.image(width / 2, height / 2, 'Frame')
            .setScale(0.8);

        // Texto principal
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

        // Entramos en la cola
        this.joinQueue();

        // Escuchar mensajes del servidor
        this.setupSocketListeners();
    }

    joinQueue() {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

        this.ws.send(JSON.stringify({
            type: 'joinQueue'
        }));
    }

    setupSocketListeners() {
        this.ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);

            switch (msg.type) {

                case 'queueJoined':
                    this.statusText.setText('Waiting for opponent...');
                    break;

                case 'matchFound':
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

        this.scene.start('RaceScene', {
            ws: this.ws,
            roomId: payload.roomId,
            role: payload.role,
            online: true
        });
    }

    leaveLobby() {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type: 'leaveQueue' }));
        }
    }
}
