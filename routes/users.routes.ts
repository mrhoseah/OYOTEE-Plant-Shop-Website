import * as controller from '../controllers/users.controller'
import { Router } from 'express';


const usershRouter = Router()

usershRouter.get(`/`,controller.list)
usershRouter.get(`/products/:id/likes`,controller.likes)
usershRouter.get(`/products/:id/earings`,controller.ratings)
usershRouter.get(`/profile/:id`,controller.profile)
usershRouter.put(`/update/:id`, controller.update)
usershRouter.put(`/profile/:id/update`, controller.updateProfile)
usershRouter.delete(`/:id`, controller.destroy)
  
 export default usershRouter;