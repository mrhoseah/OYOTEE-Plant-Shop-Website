import { Router } from 'express';
import * as controller from '../controllers/coupon.controller'
import { requireuser } from '../utils/auth';


const couponRouter = Router()

couponRouter.get(`/`,[requireuser],controller.listing)
couponRouter.post(`/`,[requireuser],controller.create)
couponRouter.get(`/:id`,[requireuser],controller.show)
couponRouter.put(`/update/:id`, [requireuser],controller.update)
couponRouter.delete(`/destroy/:id`, [requireuser],controller.destroy)
  
 export default couponRouter;