// socket.js
// const socketIo = require('socket.io');
import socketIo from 'socket.io';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

function setupSocket(io) {
  io.on('connection', (socket) => {

    socket.on('join-chat',(data)=>{
        socket.join(data.id);
    });

    socket.on('sendMessage', async (data) => {
    const message = await prisma.message.create({data:{
        chat_id :data.conv_id , sender_id : data.sender_id
        ,content : data.message
    }})

     socket.to(data.conv_id).emit('messageReceived', message );

      
    });

    // عند disconnect
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
}

export default setupSocket;
