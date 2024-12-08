import { Router } from "express";
import user_controller from '../controllers/user_controller.js'

const user_router = Router();

user_router.post('/sign_up' , user_controller.sign_up_handler );
user_router.post('/login' , user_controller.login_handler );


export default user_router