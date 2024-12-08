import { Router } from "express";
import contacts_controller from "../controllers/contacts_controller";

const contacts_router = Router();

contacts_router.get('/:user_id',contacts_controller.get_contacts);
contacts_router.post('/add/:user_id',contacts_controller.add_contact);

export default contacts_router