import * as controller from '../controllers/products.controller'
import { productImageUpload } from '../middleware/handleUpload';
import { verifyToken } from '../utils/auth';
import { Router } from 'express';


const productsRouter = Router()

productsRouter.get(`/`,controller.listing)
productsRouter.post(`/create`,[productImageUpload,verifyToken],controller.create)
productsRouter.post(`/like`,controller.like)
productsRouter.post(`/review/`, [verifyToken],controller.review)
productsRouter.get(`/:id`,controller.show)
productsRouter.put(`/:id/publish/`, [verifyToken],controller.publish)
productsRouter.put(`/:id/update/`, [productImageUpload,verifyToken],controller.update)
productsRouter.delete(`/destroy/:id`, [verifyToken],controller.destroy)
  
 export default productsRouter;