import { Router } from "express";
import message_controller from "../controllers/message_controller.js";

const message_router = Router();

message_router.get("/:chat",message_controller.get_messages);

export default message_router;