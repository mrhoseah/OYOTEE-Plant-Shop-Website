import { Router } from 'express';
import { validateUser,verifyToken } from '../middleware/auth';
import* as controller from '../controllers/auth.controller'
import { userAvatarUpload } from '../middleware/handleUpload';


const authRouter = Router()

authRouter.post(`/signin`,controller.signin)

authRouter.post(`/signup`, [userAvatarUpload,validateUser],controller.signup)
authRouter.post(`/forgot-password`,controller.forgotPassword)
authRouter.post(`/reset-password/:token`,controller.resetPassword)
authRouter.post(`/signout`,[verifyToken],controller.signout)
  
 export default authRouter;