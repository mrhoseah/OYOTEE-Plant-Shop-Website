import * as controller from '../controllers/users.controller'
import { Router } from 'express';
import { userAvatarUpload } from '../middleware/handleUpload';
import { requireuser } from '../utils/auth';


const usershRouter = Router()

usershRouter.get(`/`,[requireuser],controller.list)
usershRouter.get(`/products/:id/likes`,[requireuser],controller.likes)
usershRouter.get(`/products/:id/earings`,[requireuser],controller.ratings)
usershRouter.get(`/profile/:id`,[requireuser],controller.profile)
usershRouter.put(`/:id/update`,[requireuser], controller.updateUser)
usershRouter.put(`/:id/profile/update`,[requireuser,userAvatarUpload], controller.updateProfile)
usershRouter.delete(`/:id`,[requireuser], controller.destroy)
  
 export default usershRouter;