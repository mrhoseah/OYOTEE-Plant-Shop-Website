import { Router } from 'express';
import * as controller from '../controllers/categories.controller'
import { verifyToken } from '../middleware/auth';


const categoriesRouter = Router()

categoriesRouter.get(`/`,controller.listing)
categoriesRouter.post(`/`,[verifyToken],controller.create)
categoriesRouter.get(`/:id`,controller.show)
categoriesRouter.put(`/update/:id`, [verifyToken],controller.update)
categoriesRouter.delete(`/destroy/:id`, [verifyToken],controller.destroy)
  
 export default categoriesRouter;