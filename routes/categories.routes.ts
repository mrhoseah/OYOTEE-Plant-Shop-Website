import { Router } from 'express';
import * as controller from '../controllers/categories.controller'


const categoriesRouter = Router()

categoriesRouter.get(`/`,controller.listing)
categoriesRouter.post(`/create`,controller.create)
categoriesRouter.get(`/:id`,controller.show)
categoriesRouter.put(`/update/:id`, controller.update)
categoriesRouter.delete(`/destroy/:id`, controller.destroy)
  
 export default categoriesRouter;