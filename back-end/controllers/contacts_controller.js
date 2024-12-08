const contacts_controller = {}
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken';
import { configDotenv } from 'dotenv';
configDotenv();

const {
    scryptSync, randomBytes
} = await import('node:crypto');
const prisma = new PrismaClient()

contacts_controller.get_contacts = async (req , res) =>{
    const user_id =req.params.user_id;
    const chats = await prisma.chat.findMany({
        where: {
            OR: [
                { first_user: user_id },
                { second_user: user_id }
            ]
        },
        include: {
            firstUser: {select :{
                id : true,
                username : true,
                phone_number : true
                
            }},  
            secondUser: {select :{
                id : true,
                username : true,
                phone_number : true
                
            }}
        }
    });

    res.json({chats});    
}

contacts_controller.add_contact = async (req , res) =>{
    const user_id = req.params.user_id;
    const contact_id = req.body.contact;
    try{
        await prisma.chat.findFirstOrThrow(
            {where : {OR : [{AND:[{first_user : user_id} , {second_user : contact_id}]},
            {AND:[{first_user : contact_id},{second_user : user_id}]}]}}
        );

        res.json({user_already_exist : true});
    } catch (e){
        await prisma.chat.create({data : {first_user : user_id , second_user : contact_id}});
    }

    
    const chats = await prisma.chat.findMany({
        where: {
            OR: [
                { first_user: user_id },
                { second_user: user_id }
            ]
        },
        include: {
            firstUser: {select :{
                id : true,
                username : true,
                phone_number : true
                
            }},  
            secondUser: {select :{
                id : true,
                username : true,
                phone_number : true
                
            }}
        }
    });
    res.json({chats});
}


export default contacts_controller;