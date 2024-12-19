// index.js
const { Server } = require('socket.io');

const io = new Server(8000, {
    cors: {
        origin: "*",
    }
});

const users = {};

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('new-user-joined', (name) => {
        console.log("New user", name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', (message) => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });

    socket.on('disconnect', () => {
        const name = users[socket.id];
        delete users[socket.id];
        socket.broadcast.emit('user-left', name);
    });
});
