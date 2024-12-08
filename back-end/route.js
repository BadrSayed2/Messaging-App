
import { Router } from 'express';
import user_router from './routers/user_routers.js';
const router = Router();
import user_controller from './controllers/user_controller.js';
import contacts_router from './routers/contacts_router.js';
import message_router from './routers/message_router.js';

router.get('/verify_login/:token',user_controller.verify_login)

router.use('/user' , user_router);
router.use('/contacts',contacts_router);
router.use('/message',message_router)

export default router;