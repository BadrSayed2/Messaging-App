const contacts_controller = {}
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken';
import { configDotenv } from 'dotenv';
configDotenv();

const {
    scryptSync, randomBytes
} = await import('node:crypto');
const prisma = new PrismaClient()
//test these apis 
//complete the application
contacts_controller.get_contacts = async (req , res) =>{
    try{

        const user_id =req?.user_id;
        const {l , of } = req?.query;
        const limit = (parseInt(l))? parseInt(l) : 10;
        const offset = (parseInt(of))? parseInt(of) : 0; 
        
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
            } ,
            take : limit , 
            skip : offset,
        });
        
        res.status(200).json({chats});    
    } catch(e){
        console.log(e.message)
        res.status(500).json({err : "internal server error"})
    }
}

// notifications to be added
contacts_controller.add_contact = async (req , res) =>{
    const user_id =req?.user_id;
    const contact_id = req?.body?.contact_id;
    
    if(!contact_id || !user_id){
        res.status(401).json({err : "you need to log in"})
        return;
    }
    if(user_id == contact_id){
        res.status(400).json({err : "you can't send request to yourself"})
        return;

    }
    try{
        const existing_chat = await prisma.chat.findFirst(
            { where : {OR : [{ AND:[{first_user : user_id} , {second_user : contact_id}] },
            { AND:[{first_user : contact_id},{second_user : user_id}]}]} }
        );

        if(existing_chat){
            res.status(400).json({err : "this is already your friend"});
        } else{
            await prisma.contactRequest.create( {data : {senderId : user_id , receiverId : contact_id}} )
            res.status(200).json({message : "your request was sent successfully" })
            // throw new Error('you need to create a chat');
        }
    } catch (e){
        console.log(e.message)
        res.status(500).json({err : "internal server error"})
        // await prisma.chat.create();
        //issue a notification and store it if the user is connected ('on')
    
    }

}

// notification to be added
contacts_controller.reply_request = async (req,res)=>{
    const user_id =req?.user_id;
    const contact_id = req?.body?.contact_id;
    const type = req?.params?.type;
    
    if(!contact_id || (type != 'accept' && type != 'reject')){
        res.status(400).json({err : "unknown reply type "})
        return;
    }
    try{
        const request = await prisma.contactRequest.findFirst({where : {AND : [
            {senderId : contact_id},
            {receiverId : user_id}
        ]}})

        if(!request){
            res.status(404).json({err:"couldn't find the request you are trying to reply to"})
            return
        }
        
        if(type == "accept"){
            await prisma.$transaction([
                prisma.contactRequest.delete({where : {id : request.id}}),
                prisma.chat.create({data :{
                    first_user : user_id,
                    second_user : contact_id
                }}) 
            ])
            res.status(200).json({message : "your acceptance reply was sent successfully"})
        }else if (type == 'reject'){
            await prisma.contactRequest.delete({where : {id : request.id}})
            res.status(200).json({message : "your rejection reply was sent successfully"})
        }
        return;
    }catch(e){
        console.log(e.message);
        res.status(500).json({err : "server error please refresh the page"})
    }
}

contacts_controller.search_chats = async (req,res)=>{
    const user_id =req?.user_id;
    const search_text = req?.query?.search_text;

    
    if(!search_text){
        res.status(200).json({});
        return;
    }
    try{

        const chats = await prisma.chat.findMany({
            where : {OR : [
                {first_user : user_id , secondUser : {OR: [
                    { email: { startsWith: search_text, mode: "insensitive" } },
                    { username: { startsWith: search_text, mode: "insensitive" } },
                    { phone_number: { startsWith: search_text, mode: "insensitive" } }
                ]}},
                {firstUser : {OR: [
                    { email: { startsWith: search_text, mode: "insensitive" } },
                    { username: { startsWith: search_text, mode: "insensitive" } },
                    { phone_number: { startsWith: search_text, mode: "insensitive" } }
                ]} , second_user : user_id}
            ]},select : {
                id : true,
                firstUser :{select : {
                    id:true,
                    username: true,
                    phone_number : true
                }},
                secondUser :{select : {
                    id:true,
                    username: true,
                    phone_number : true
                }}
            }
        })
        res.status(200).json({chats});
    }catch(e){
        console.log(e.message);
        res.status(500).json({err : "server error please refresh the page"})
    }

}

contacts_controller.search_contacts = async (req,res)=>{
    const search_text = req?.query?.search_text;
    
    if(!search_text){
        res.status(200).json({});
        return;
    }
    try{

        const contacts = await prisma.user.findMany({where:{ AND : [{OR:[
                { email: { startsWith: search_text, mode: "insensitive" } },
                { username: { startsWith: search_text, mode: "insensitive" } },
                {phone_number: { startsWith: search_text, mode: "insensitive" } }
            ]} ,{id : {not : req?.user_id} }
        ]},select : {
                id:true,
                username : true,
                phone_number : true
            }
        })
        res.json({contacts});
    }catch(e){
        console.log(e.message);
        res.status(500).json({err : "server error please refresh the page"})
    }

}


export default contacts_controller;