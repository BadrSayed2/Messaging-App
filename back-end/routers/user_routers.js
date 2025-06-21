import { Router } from "express";
import user_controller from '../controllers/user_controller.js'

const user_router = Router();

user_router.post('/sign_up' , user_controller.sign_up_handler );

user_router.post('/login' , user_controller.login_handler );

user_router.post('/logout' , user_controller.logout_handler );

user_router.post('/verify_otp' , user_controller.verify_otp );

user_router.get('/test' , user_controller.verify_login , (req , res)=>{
    res.status(200).json({message : "you are a loggedin user"})
});


export default user_router