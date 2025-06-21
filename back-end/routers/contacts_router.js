import { Router } from "express";
import contacts_controller from "../controllers/contacts_controller.js";
import user_controller from "../controllers/user_controller.js";
const contacts_router = Router();

contacts_router.use(user_controller.verify_login);

// get your contacts
contacts_router.get('/', contacts_controller.get_contacts);

// make a add freind request
contacts_router.post('/add', contacts_controller.add_contact);

// type can have the values of accept or reject only
contacts_router.post('/reply/:type', contacts_controller.reply_request);

// search among your friends
contacts_router.get('/search_chat', contacts_controller.search_chats);

// search users who are NOT your friends
contacts_router.get('/search_contact', contacts_controller.search_contacts);


export default contacts_router