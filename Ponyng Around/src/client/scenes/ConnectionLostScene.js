import Phaser from 'phaser';
import { connectionManager } from '@client/services/ConnectionManager.js';

export default class ConnectionLostScene extends Phaser.Scene {
    constructor() {
        super('ConnectionLostScene');
        this.reconnectInterval = null;
        this.reconnectAttempts = 0;
        this.maxAttempts = 5; // for avoinidng loops
    }

    create() {
        const { width, height } = this.scale;

        // Semi-transparent dark overlay
        this.add.rectangle(0, 0, width, height, 0x000000, 0.7)
            .setOrigin(0)
            .setDepth(1);

        this.statusText = this.add.text(
            width / 2,
            height / 2 - 60,
            "Connection Lost\nReconnecting...",
            {
                fontFamily: "Arial",
                fontSize: "48px",
                align: "center",
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 6
            }
        ).setOrigin(0.5).setDepth(2);

        this.retryButton = this.add.text(
            width / 2,
            height / 2 + 120,
            "Return to Menu",
            {
                fontFamily: "Arial",
                fontSize: "40px",
                color: "#ffcccc",
                stroke: "#000000",
                strokeThickness: 4
            }
        )
        .setOrigin(0.5)
        .setDepth(2)
        .setInteractive({ useHandCursor: true })
        .setVisible(false);

        this.retryButton.on('pointerdown', () => {
            this.scene.stop();
            this.scene.start('MainMenuScene');
        });

        // Start reconnection attempts
        this.startReconnectionLoop();
    }

    startReconnectionLoop() {
        if (this.reconnectInterval) return;

        this.reconnectInterval = setInterval(async () => {
            this.reconnectAttempts++;

            this.statusText.setText(
                `Connection Lost\nReconnecting... (${this.reconnectAttempts})`
            );

            const result = await connectionManager.checkConnection();

            if (result.success) {
                // Reconnected!
                this.closeOverlay();
            }

            if (this.reconnectAttempts >= this.maxAttempts) {
                this.statusText.setText("Connection Lost\nUnable to reconnect.");
                this.retryButton.setVisible(true);
                clearInterval(this.reconnectInterval);
            }
        }, 2000);
    }

    async checkConnection() {
    try {
        const response = await fetch('/api/connected', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId: this.sessionId })
        });

        const data = await response.json();

        // Update internal state
        this.connected = true;
        this.connectedCount = data.connected;

        return { success: true };
    } catch (e) {
        this.connected = false;
        return { success: false };
    }
}


    closeOverlay() {
        clearInterval(this.reconnectInterval);
        this.reconnectInterval = null;

        // Return to whatever scene was underneath
        this.scene.stop(); // close this overlay scene
    }
}
