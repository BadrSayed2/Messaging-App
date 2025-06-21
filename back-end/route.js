
import { Router } from 'express';
import user_router from './routers/user_routers.js';
import contacts_router from './routers/contacts_router.js';
// import message_router from './routers/message_router.js';
// import user_controller from './controllers/user_controller.js';
const router = Router();


router.use('/user' , user_router);
router.use('/contact',contacts_router);
// router.use('/message',message_router)

export default router;