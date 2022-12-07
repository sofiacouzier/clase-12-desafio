let { Server: SocketIO } = require("socket.io");

class Socket {
    static instancia;
    constructor(http) {
        if (Socket.instancia) {
            return Socket.instancia;
        }
        Socket.instancia = this;
        this.io = new SocketIO(http);
        this.mensajes = [];
        this.usuarios = [];
    }

    init() {
        try {
            this.io.on("connection", socket => {
                this.io.sockets.emit("fillP", this.mensajes);
                console.log("usuario conectado");
                socket.emit("init", socket.id);
                socket.on("keyup", data => {
                    this.mensajes = data;
                    this.io.sockets.emit("fillP", data)
                })
            })
        } catch (error) {
            console.log(error)
        }
    }
}



module.exports = Socket;