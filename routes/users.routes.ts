import * as controller from '../controllers/users.controller'
import { Router } from 'express';
import { userAvatarUpload } from '../middleware/handleUpload';


const usershRouter = Router()

usershRouter.get(`/`,controller.list)
usershRouter.get(`/products/:id/likes`,controller.likes)
usershRouter.get(`/products/:id/earings`,controller.ratings)
usershRouter.get(`/profile/:id`,controller.profile)
usershRouter.put(`/profile/:id/update`,[userAvatarUpload], controller.updateProfile)
usershRouter.delete(`/:id`, controller.destroy)
  
 export default usershRouter;