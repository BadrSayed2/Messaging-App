import { PrismaClient } from '@prisma/client'
const message_controller = {};

const {
    scryptSync, randomBytes
} = await import('node:crypto');
const prisma = new PrismaClient()

message_controller.get_messages = async (req , res)=>{
    const chat_id = req.params.chat;
    const messages =  await prisma.message.findMany({where : {chat_id},
        orderBy : {sent_in : 'desc'} , take : 20})
    res.json(messages);
}

export default message_controller;