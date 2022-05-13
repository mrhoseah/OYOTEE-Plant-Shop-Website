import { Router } from 'express';
import { checkDuplicateEmail, checkEmptyFields,verifyToken } from '../middleware/auth';
import* as controller from '../controllers/auth.controller'


const authRouter = Router()

authRouter.post(`/signin`,controller.signin)

authRouter.post(`/signup`, [checkEmptyFields,checkDuplicateEmail],controller.signup)
authRouter.post(`/signout`,controller.signout)
  
 export default authRouter;