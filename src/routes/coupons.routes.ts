import { Router } from 'express';
import * as controller from '../controllers/coupon.controller'
import { verifyToken } from '../utils/auth';


const couponRouter = Router()

couponRouter.get(`/`,[verifyToken],controller.listing)
couponRouter.post(`/`,[verifyToken],controller.create)
couponRouter.get(`/:id`,[verifyToken],controller.show)
couponRouter.put(`/update/:id`, [verifyToken],controller.update)
couponRouter.delete(`/destroy/:id`, [verifyToken],controller.destroy)
  
 export default couponRouter;