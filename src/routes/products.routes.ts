import * as controller from '../controllers/products.controller'
import { productImageUpload } from '../middleware/handleUpload';
import { requireuser } from '../utils/auth';
import { Router } from 'express';


const productsRouter = Router()

productsRouter.get(`/`,controller.listing)
productsRouter.post(`/create`,[productImageUpload,requireuser],controller.create)
productsRouter.post(`/like`,controller.like)
productsRouter.post(`/review/`, [requireuser],controller.review)
productsRouter.get(`/:id`,controller.show)
productsRouter.put(`/:id/publish/`, [requireuser],controller.publish)
productsRouter.put(`/:id/update/`, [productImageUpload,requireuser],controller.update)
productsRouter.delete(`/destroy/:id`, [requireuser],controller.destroy)
  
 export default productsRouter;