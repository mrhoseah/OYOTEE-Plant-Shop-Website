import { Router } from 'express';
import * as controller from '../controllers/reviews.controller'
import { verifyToken } from '../middleware/auth';


const reviewsRouter = Router()

reviewsRouter.get(`/`,controller.listing)
reviewsRouter.post(`/`,[verifyToken],controller.create)
reviewsRouter.get(`/:id`,controller.show)
reviewsRouter.put(`/update/:id`, [verifyToken],controller.update)
reviewsRouter.delete(`/destroy/:id`, [verifyToken],controller.destroy)
  
 export default reviewsRouter;