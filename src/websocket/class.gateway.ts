import socket from "../config/socket";

export class ClassGateway {
    connect() {
        if (!socket.connected) {
            socket.connect()
        }
    }

    disconnect() {
        if (socket.connected) {
            socket.disconnect()
        }
    }

    // Main connect

    off(event: string) {
        socket.off(event)
    }
}