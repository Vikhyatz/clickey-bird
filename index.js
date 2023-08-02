// server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path')

const app = express();
const server = http.createServer(app);
const io = socketIO(server);



app.use(express.static(__dirname + '/client'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'game.html'));
})


let Players = 0;

io.on("connection", (socket) => {
    console.log('user connected generally');

    socket.on('joinRoom', (room) => {
        socket.join(room);
        Players++;

        console.log(`User joined room: ${room}, player: ${Players}`);

        if (Players === 2) {
            console.log('start');
            io.in(room).emit('startCountdown');
        }

        socket.on('disconnect', () => {
            Players--;
            console.log(`User left room: ${room}, players remaining: ${Players}`);
        });

        socket.on('counterUpdate', (counterValue) => {
            socket.to(room).emit('counterUpdate', counterValue);
        });
    });

});


server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
