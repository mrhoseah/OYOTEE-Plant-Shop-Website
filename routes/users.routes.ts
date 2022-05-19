import * as controller from '../controllers/users.controller'
import { Router } from 'express';
import { userAvatarUpload } from '../middleware/handleUpload';
import { verifyToken } from '../middleware/auth';


const usershRouter = Router()

usershRouter.get(`/`,[verifyToken],controller.list)
usershRouter.get(`/products/:id/likes`,[verifyToken],controller.likes)
usershRouter.get(`/products/:id/earings`,[verifyToken],controller.ratings)
usershRouter.get(`/profile/:id`,[verifyToken],controller.profile)
usershRouter.put(`/:id/update`,[verifyToken,userAvatarUpload], controller.updateUser)
usershRouter.delete(`/:id`,[verifyToken], controller.destroy)
  
 export default usershRouter;