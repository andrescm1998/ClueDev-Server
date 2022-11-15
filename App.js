require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { createServer } = require('http');
const { Server } = require('socket.io')

const logRoutes = require('./Middleware/logger');
const userRouter = require('./routes/userRoutes')
const wsRouter = require('./routes/wsRoutes');
const repoRouter = require('./routes/repoRoutes');
const counterRouter = require('./routes/counterRoutes');
const folderRouter = require('./routes/folderRoutes');

const app = express();
const httpServer = createServer(app);
const options = {
    cors: {
        origin: 'http://localhost:5173',
    }
};
const io = new Server(httpServer, options)

io.on('connection', (socket) => {
    console.log('User connected')

    socket.on('create', (room) => {
        socket.join(room)
        socket.to(room).emit('test', 'testPayload')
    })

    socket.on('disconnect', () => {
        console.log('User disconnected')
    })
});

// credentials: true allows the server to send and receive cookies, origin: true is needed when credentials is set to true
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser())
app.use(logRoutes);

app.get('/', (req, res) => {
    res.status(200).send('Welcome to the ClueDev API!')
})

app.use('/users', userRouter);
app.use('/workspace', wsRouter);
app.use('/repo', repoRouter);
app.use('/counter', counterRouter);
app.use('/folder', folderRouter);

// module.exports = httpServer;

const PORT = process.env.PORT

httpServer.listen(PORT, () => {
    console.log(`Server listening on PORT ${PORT}....`)
})


