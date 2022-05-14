import { Router } from 'express';
import { validateUser,verifyToken } from '../middleware/auth';
import* as controller from '../controllers/auth.controller'


const authRouter = Router()

authRouter.post(`/signin`,controller.signin)

authRouter.post(`/signup`, [validateUser],controller.signup)
authRouter.post(`/signout`,controller.signout)
  
 export default authRouter;