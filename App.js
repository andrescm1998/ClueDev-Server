require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { createServer } = require('http');
const { Server } = require('socket.io');
const fetch = require('node-fetch');

const logRoutes = require('./Middleware/logger');
const userRouter = require('./routes/userRoutes')
const wsRouter = require('./routes/wsRoutes');
const repoRouter = require('./routes/repoRoutes');
const counterRouter = require('./routes/counterRoutes');
const folderRouter = require('./routes/folderRoutes');

const { addCounter, deleteCounter, getCounters } = require('./controllers/counterController');
const { getUsername } = require('./controllers/userController');

const app = express();
const httpServer = createServer(app);
const options = {
    cors: {
        origin: 'http://localhost:5173',
        credentials: true,
    }
};
const io = new Server(httpServer, options)

io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('create', async (room) => {
        socket.join(room)
        // console.log(`User joined room ${room}`)
        // socket.to(room).emit('test', 'testPayload')
        // socket.on('fileLoaded', async () => {
        //     const counters = await getCounters(room);
        //     socket.to(room).emit('updateCounters', counters)
        // })
        const counters = await getCounters(room);
        io.in(room).emit('updateCounters', counters)

        socket.on('addCounter', async (data) => {
            // Add the counter and return a boolean for conflicts
            const conflicts = await addCounter(data);

            // Get all counters in the room
            const counters = await getCounters(room);

            // Update the counters
            io.in(room).emit('updateCounters', counters)

            // Resolve conflict notifications
            if (conflicts.length > 1) {
                // Send notifications to the client app
                io.in(room).emit('notification', conflicts)

                // Get the names of conflicted developers
                const users = await Promise.all(conflicts.map(async (conflict) => {
                    const user = await getUsername(conflict.userId);
                    return user;
                }));
                
                // Prepare notification data
                const conflictData = { "text": `${users.join(' and ')} are working in the same file.`}

                // Post to slack webhook url
                await fetch('https://hooks.slack.com/services/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', 
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(conflictData)
                })
            }
        });
        socket.on('deleteCounter', async (data) => {
            await deleteCounter(data)
            const counters = await getCounters(room);
            io.in(room).emit('updateCounters', counters)
        });
    });

    // socket.on('addCounter', async (data) => {
    //     // Add function to take sha and add to the counter database
    //     const conflicts = await addCounter(data);
    //     if (conflicts) {
    //         socket.emit('alert', 'Merge conflict pending...')
    //     }
    //     console.log(conflicts)
        

    //     // Filter the db and check if there is more than one token

    //     // If there are more than one send notifications to client
    // })

    socket.on('disconnect', () => {
        console.log('User disconnected')
    })
});

  

///////////////// CLUEDEV API ///////////////////

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
