const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
    },
});
const cors = require('cors');
const { urlencoded } = require('express');

const messages = [
    {
        id: 1,
        text: 'Envia tu mensaje, sos el primero.',
        author: 'Admin',
    },
];

app.use(express.static('public'));
app.use(express.json());
app.use(urlencoded({ extended: false }));
app.use(cors());

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.get('/api/messages', function (req, res) {
    res.json(messages);
});

app.post('/api/messages', function (req, res) {
    const { text, author } = req.body;
    console.log(req.body);
    messages.push({ text, author, id: Date.now() });
    res.send({ response: 'Sent.' });
});

io.on('connection', function (socket) {
    console.log(`Alguien se ha conectado con Sockets: ${socket.id}`);
    socket.emit('messages', messages);

    socket.on('newMessage', function (data) {
        messages.push(data);
        io.sockets.emit('messages', messages);
    });

    socket.on('clearAllMessages', function () {
        while (messages.length > 1) {
            const interval = setInterval(function () {
                messages.pop();
            }, 1000);
            if (messages.length === 1) {
                clearInterval(interval);
            }
        }
    });
});

server.listen(9000, () =>
    console.log('Servidor corriendo http://localhost:9000')
);
