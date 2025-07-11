import express from 'express';
import cors from 'cors';
import router from './route.js';
import { configDotenv } from 'dotenv';
import cookieParser from 'cookie-parser';
import user_schedular from './schedualrs/otp_schedualr.js';
// import setupSocket from './socket/socket.js';
// import socketIo from 'socket.io';

const app = express();
configDotenv()

// const corsOptions = {
//     origin: 'http://localhost:3000', // Adjust this to your client origin
//     methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
//     allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
// };
// app.use(cors(corsOptions));
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(router);

user_schedular.remove_expired_otp()

const PORT = process?.env?.SERVER_PORT || 8080

// const server = http.createServer(app);
// const io = socketIo(server);

// setupSocket(io);

app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`));
