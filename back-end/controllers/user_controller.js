const user_controller = {}
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken';
import { configDotenv } from 'dotenv';
configDotenv();

const {
    scryptSync, randomBytes
} = await import('node:crypto');
const prisma = new PrismaClient()

user_controller.sign_up_handler = async (req , res , next) =>{
    const user = req.body;
    
    const salt = randomBytes(64).toString('hex')
    const key1 = scryptSync(user.password, salt, 128).toString('hex');
    try{
        

            await prisma.user.findFirstOrThrow({where: { 
                OR : [{email : user.email} , {username : user.username}]
            }
        })   
            res.json({user_already_exist : true});
        
    }  catch(e){
        try {
            await prisma.user.create({
                data: {
                    username: user.username,
                    password: hashedPassword,
                    email: user.email,
                    salt: salt,
                    phone_number: user.phone,
                },
            });

            return res.json({ success: true });
        } catch (error) {
            return res.status(500).json({ success: false, message: "An error occurred while creating the user." });
        }
    }
}

user_controller.login_handler = async (req,res)=>{
    const user = req.body;

    try{
        const found_user = await prisma.user.findFirstOrThrow({where: { 
                OR : [{email : user.username} , {phone_number : user.username}]
            }
         })   
    
         const key = scryptSync(user.password, found_user.salt, 128).toString('hex');
   
    if(key == found_user.password){
        const token = jwt.sign({id : found_user.id}, process.env.jwt_private_key)
        res.json({success : true ,token : token});
    }else{
        res.json({success : false,message : "password not correct"});
    }
    }catch(e){
        res.json({success : false,message : "email or phone not found"})
    }
}

user_controller.verify_login = async (req,res)=>{
    const cookie = res.params.token;
    const user = jwt.verify(cookie,process.env.jwt_public_key);
    try{
        await prisma.user.findFirstOrThrow({
            where : {
                id : user.id
            }
        })
        
        res.json(user);
    } catch(err){
        res.status(404).json({ success: false, message: "User not found" });
    }
}

export default user_controller