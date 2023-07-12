import { Router } from 'express';
import * as controller from '../controllers/categories.controller'
import { requireuser } from '../utils/auth';


const categoriesRouter = Router()

categoriesRouter.get(`/`,controller.listing)
categoriesRouter.post(`/`,[requireuser],controller.create)
categoriesRouter.get(`/:id`,controller.show)
categoriesRouter.put(`/update/:id`, [requireuser],controller.update)
categoriesRouter.delete(`/:id`, [requireuser],controller.destroy)
  
 export default categoriesRouter;