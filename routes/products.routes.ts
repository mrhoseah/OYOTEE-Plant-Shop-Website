import * as controller from '../controllers/products.controller'
import { productImageUpload } from '../middleware/handleUpload';
import { verifyToken } from '../middleware/auth';
import { Router } from 'express';


const productsRouter = Router()

productsRouter.get(`/`,[verifyToken],controller.listing)
productsRouter.post(`/create`,[productImageUpload,verifyToken],controller.create)
productsRouter.post(`/rating`,[verifyToken],controller.rate)
productsRouter.post(`/like`,[verifyToken],controller.like)
productsRouter.get(`/:id`,[verifyToken],controller.show)
productsRouter.put(`/:id/publish/`, [verifyToken],controller.publish)
productsRouter.put(`/:id/update/`, [productImageUpload,verifyToken],controller.update)
productsRouter.delete(`/destroy/:id`, [verifyToken],controller.destroy)
  
 export default productsRouter;