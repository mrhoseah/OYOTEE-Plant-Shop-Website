import * as controller from '../controllers/products.controller'
import { verifyToken } from '../middleware/auth';
import { Router } from 'express';


const productsRouter = Router()

productsRouter.get(`/`,[verifyToken],controller.listing)
productsRouter.post(`/create`,[verifyToken],controller.create)
productsRouter.post(`/:id/rating`,[verifyToken],controller.rate)
productsRouter.get(`/:id`,[verifyToken],controller.show)
productsRouter.put(`/:id/publish/`, [verifyToken],controller.publish)
productsRouter.put(`/update/:id/`, [verifyToken],controller.update)
productsRouter.delete(`/destroy/:id`, [verifyToken],controller.destroy)
  
 export default productsRouter;