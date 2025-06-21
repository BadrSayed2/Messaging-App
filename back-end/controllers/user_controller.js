const user_controller = {}
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken';
import { configDotenv } from 'dotenv';
import verify_user from '../utilities/verify_user.js';
import generate_code from '../utilities/get_random_code.js';
import fs from 'fs';
import bcrypt from 'bcrypt'
// Load keys from files
const privateKey = fs.readFileSync('private.pem', 'utf8');
const publicKey = fs.readFileSync('public.pem', 'utf8');

const authentication_cookie_name = "TF8lCwUtYqEwpQHHXbAV";
const verification_cookie_name = "6DMQRKBH9u7UaXg4OJ";


configDotenv();

const prisma = new PrismaClient()

user_controller.sign_up_handler = async (req , res ) =>{
    const user = req?.body;
    //validate data
    await verify_user(user);
    try {    
        
        if(user.err){
            res.status(400).json({err : user.err});
            return;
        }
        //validate data in db
        const u_exist = await prisma.user.findFirst({where:{username : user.username}})   
        const e_exist = await prisma.user.findFirst({where:{email : user.email} })   
        const p_exist =await prisma.user.findFirst({where:{phone_number : user.phone_number}})   
             
        const err = ( u_exist )? "this username already exists" : (
            ( e_exist )? "this email already exists" : (
                ( p_exist )? "this phone number already exists" : ""
            )
        )
        
        if(err){
            res.status(400).json({err});
            return;
        } else {
            throw new Error('user not in database')
        }
    }  catch(e){
        try {
            
            const user_code = "" + generate_code()
            const now = new Date();
            const expire_at = new Date(now.getTime() + 5 * 60 * 1000)
            const token = jwt.sign({phone_number : user.phone_number}, privateKey,{algorithm : 'RS256'})
            const cookieOptions = {
                httpOnly: true,
                secure: true,
                sameSite: 'Strict',
                maxAge: 3 * 60 * 1000, 
            };
            await prisma.$transaction(async (prisma) => {
                const n_user = await prisma.user.create({
                    data: {
                    username: user.username,
                    password: user.password,
                    email: user.email,
                    phone_number: user.phone_number,
                    },
                    select : {
                        phone_number : true,
                        id : true,

                    }
                });
                
                await prisma.oTP.create({
                    data: {
                    userId: n_user.id,
                    code: user_code,
                    expire_at: expire_at,
                    },
                });
                
                res.cookie(verification_cookie_name, token, cookieOptions);
            });
            
            //send email to user
            res.status(200).json({message : "Please check your email for verification code",
                code:user_code})
            // return res.status(200).json({ success: true });
        } catch (err) {
            console.log(err.message)
            return res.status(500).json({err: "A server error occurred please try again" });
        }
    }
}

user_controller.login_handler = async (req,res)=>{
    const user = req?.body;
    let found_user;
    let err = false;
    try{
        found_user = await prisma.user.findFirst({where: { OR : [
            {email : user.username}
            ,{phone_number : user.username}
        ]}})
        if(!found_user || !found_user?.verified){
            throw new Error('user not found')
        }
    }catch(e){
        console.log(e.message);
        res.status(400).json({err:"invalid email or password"});
        err=true;
    }

    if(err) return;
    
    try {
        const match = await bcrypt.compare(user.password, found_user.password);
        if (!match) {
            
            res.status(400).json({ err: "invalid email or password" });
            return;
        }
       
        const user_code = "" + generate_code()
        const now = new Date();
        const expire_at = new Date(now.getTime() + 3 * 60 * 1000)
        
        await prisma.oTP.create({
            data: {
            userId: found_user.id,
            code: user_code,
            expire_at: expire_at,
            },
        });
        const token = jwt.sign({phone_number : found_user.phone_number}, privateKey,{algorithm : 'RS256'})
        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            maxAge: 3 * 60 * 1000, 
        };
        res.cookie(verification_cookie_name, token, cookieOptions);
        res.status(200).json({ message: 'Please check your email for validation email' });
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ err: "server error, please try again" });
        return;
    }
    
}

user_controller.logout_handler = async (req,res)=>{
    res.clearCookie(""+authentication_cookie_name); // assuming your cookie is named 'token'
    res.clearCookie(""+verification_cookie_name); // assuming your cookie is named 'token'
    res.status(200).json({ message: 'Logged out successfully' });
}

user_controller.verify_otp = async (req,res)=>{
    const cookie = req?.cookies["" + verification_cookie_name]
    const code = req?.body?.code

    if(!cookie){
        res.status(401).json({err : "you need to login"});
        return;
    }

    try{
        const user = jwt.verify( cookie , publicKey);

        const found_user = await prisma.user.findFirstOrThrow( {where : {phone_number : user.phone_number}} );
        if(!found_user){
            res.status(401).json({err : "you need to login"})
            return
        }
        
        
        const code_obj = await prisma.oTP.findFirst({where : {userId : found_user?.id}})
       


        if (!(code_obj.code === code) || ! (code_obj.expire_at > new Date())) {
            res.status(400).json({err : "wrong code"})
            return
        }
        if(!found_user?.verified){
            await prisma.user.update({where : {id : found_user?.id} , data : {verified : true}})
        }
        await prisma.oTP.delete({where : {userId : found_user?.id}})
        const token = jwt.sign({id : found_user.id}, privateKey,{algorithm : 'RS256'})

        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            maxAge: 24 * 60 * 60 * 1000, 
        };

        res.cookie(authentication_cookie_name, token, cookieOptions);
        res.clearCookie(""+verification_cookie_name); 
        res.status(200).json({message : "you are verified"})
    } catch(e){
        res.status(401).json({err : "you need to login"});
    }
}

user_controller.verify_login = async (req,res,next)=>{
    // const cookie = res.params.token;
    const cookie = req?.cookies["" + authentication_cookie_name]
    
    if(!cookie){
        res.status(401).json({err : "you need to login"});
        return;
    }
    
    
    try{
        const user = jwt.verify( cookie , publicKey);
        await prisma.user.findFirstOrThrow( {where :  { AND : [ 
            { id : user.id} , 
            {verified : true}
        ] }} );
        
        req.user_id = user.id;
        next();
    } catch(e){
        res.status(401).json({err : "you need to login"});
    }
}

export default user_controller