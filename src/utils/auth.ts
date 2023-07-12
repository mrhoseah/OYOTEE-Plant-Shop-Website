import * as jwt from "jsonwebtoken";
import type{User } from "@prisma/client";
import Joi, { any } from  'joi'
import dotenv from 'dotenv';
import prisma from "./db";
import {Request,Response,NextFunction} from 'express'
import { CustomRequest } from "./types";

dotenv.config();


export function refreshToken(user:User) {
  return jwt.sign({ user },  process.env.SECRET_REFRESH_TOKEN as string,{ expiresIn:'86400'})
}
export function generateToken(user:User) {
  return jwt.sign({ user }, process.env.SECRET_TOKEN as string,{ expiresIn: '86400'})
}

export function requireuser (req:Request, res:Response, next:NextFunction){

    if (req.headers['authorization'] == undefined || req.headers['authorization'] == null) {
      return res.status(403).send({message:"Auth failed"});
    }
    const token = req.headers['authorization'].replace("Bearer ", "")

    try {
    jwt.verify(token, process.env.SECRET_TOKEN as string, (err, decoded) => {
      if (err) {
        return res.status(401).send({message:"Unauthorized"})
      }
      (req as CustomRequest).user = decoded;
      return next();
    });
  } catch (error:any) {
    return res.sendStatus(401).json(error.message)
  }
};


export const validateUser = async (req:Request, res:Response, next:NextFunction) => {
  const{email,name,password,avatar} = req.body
  const options = {
    errors: {
      wrap: {
        label: ''
      }
    }
  };
  const JoiSchema = Joi.object().keys({
      email: Joi.string().email().required(),
      name: Joi.string().min(3).required(),
      password: Joi.string().required(),
      avatar: Joi.string()
  }).options({ abortEarly: false });

  const data= JoiSchema.validate({email,name,password,avatar},options)

  try{
    if(data.error)
    {  
      return res.status(409).json(data.error.details)
    }else{
      const user = await prisma.user.findUnique({
        where: {
          email
        }
      })
      if (user) {
        throw new Error("User Already Exist. Please Login");
      }
          return next();
    }
    } catch(er){
    return res.status(400).json((er as Error).message)
    }
};
