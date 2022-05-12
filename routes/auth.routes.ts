import {  PrismaClient } from '@prisma/client'
import config from 'config';
import multer from 'multer'
import { Router } from 'express';
import { checkDuplicateEmail, checkEmptyFields } from '../middleware/auth';
import {signin, signup} from '../controllers/auth.controller'

const upload = multer({ dest: 'uploads/' })

const {secretToken,refreshLifetime} = config.get('App.client');
const prisma = new PrismaClient()

const authRouter = Router()

authRouter.post(`/signin`,signin)

authRouter.post(`/signup`, [checkDuplicateEmail,checkEmptyFields],signup)
  
 export default authRouter;