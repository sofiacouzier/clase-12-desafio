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
                this.io.sockets.emit("init", this.mensajes);
                console.log("usuario conectado");
                socket.emit("init", socket.id);

                socket.on("mensaje", data => {
                    this.mensajes.push(data);
                    this.io.sockets.emit("listenserver", this.mensajes)
                });
                socket.on("addUser", data => {
                    console.log(data)
                    if (this.usuarios.length) {
                        let verificacion_user = false;
                        this.usuarios = this.usuarios.map(usuario => {
                            if (usuario.email == data.email) {
                                verificacion_user = true;
                                return {
                                    id: socket.id,
                                    ...data,
                                    active: true,
                                }
                            } else {
                                return usuario;
                            }

                        })
                        if (!verificacion_user) {
                            this.usuarios.push({
                                id: socket.id,
                                ...data,
                                active: true,
                            })
                        }
                    } else {
                        this.usuarios.push({
                            id: socket.id,
                            ...data,
                            active: true,
                        })
                    }
                    //this.mensajes.push(data);
                    this.io.sockets.emit("loadUsers", this.usuarios)
                });

                socket.on("disconnect", data => {
                    console.log("se desconecto", socket.id);
                    this.usuarios = this.usuarios.map(usuario => {
                        if (usuario.id == socket.id) {
                            delete usuario.active;
                            return {
                                ...usuario,
                                active: false,
                            }
                        } else {
                            return usuario;
                        }

                    });
                    this.io.sockets.emit("loadUsers", this.usuarios);
                })
                // socket.on("keyup", data => {
                //   this.mensajes = data;
                // this.io.sockets.emit("fillP", data)
                //   })
            })
        } catch (error) {
            console.log(error)
        }
    }
}



module.exports = Socket;