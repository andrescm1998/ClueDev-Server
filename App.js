const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
// const github = require('./Middleware/github');

const logRoutes = require('./Middleware/logger');
const userRouter = require('./routes/userRoutes')

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




