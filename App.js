const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
// const github = require('./Middleware/github');

const logRoutes = require('./Middleware/logger');
const userRouter = require('./routes/userRoutes')
const wsRouter = require('./routes/wsRoutes');
const repoRouter = require('./routes/repoRoutes');
const counterRouter = require('./routes/counterRoutes');
const folderRouter = require('./routes/folderRoutes');

const app = express();

app.use(cors({ origin: true, credentials: true }));
// credentials: true allows the server to send and receive cookies, origin: true is needed when credentials is set to true
app.use(express.json());
app.use(cookieParser())
app.use(logRoutes);
// app.use(github.setHeaders)


app.get('/', (req, res) => {
    res.status(200).send('Welcome to the ClueDev API!')
})

app.use('/users', userRouter);
app.use('/workspace', wsRouter);
app.use('/repo', repoRouter);
app.use('/counter', counterRouter);
app.use('/folder', folderRouter);

module.exports = app;


// app.post("/sse", (req, res) => {
//     res.writeHead(200, {
//       Connection: "keep-alive",
//       "Content-Type": "text/event-stream",
//       "Cache-Control": "no-cache",
//     });
//     setInterval(() => {
//         // if(counter has been moved){

//             res.write(
//                 `data: {"time": "${getTime()}"}`
//               );
//               res.write("\n\n");
//         // }
//     }, 1000);
// });




