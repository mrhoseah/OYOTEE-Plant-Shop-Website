import * as jwt from "jsonwebtoken";
import config from 'config';
import {User, PrismaClient } from "@prisma/client";
import Joi, { any } from  'joi'
const prisma = new PrismaClient()

export function refreshToken(user:User) {
  const {refreshToken,refreshLifetime} = config.get('App.client');
  return jwt.sign({ user },  refreshToken,{ expiresIn:refreshLifetime})
}
export function generateToken(user:User) {
  const {secretToken,secretTokenLifetime} = config.get('App.client');
  return jwt.sign({ user },  secretToken,{ expiresIn:secretTokenLifetime})
}

export function verifyToken (req:any, res:any, next:any){
  
    const {secretToken} = config.get('App.client');

    if (req.headers['authorization'] == undefined || req.headers['authorization'] == null) {
      return res.status(403).send({message:"Auth failed"});
    }
    const token = req.headers['authorization'].replace("Bearer ", "")

    try {
    jwt.verify(token, secretToken, (err:any, decoded:any) => {
      if (err) {
        return res.status(401).send({message:"Unauthorized"})
      }
      req.user = decoded;
      return next();
    });
  } catch (error:any) {
    return res.sendStatus(401).json(error.message)
  }
};


export const validateUser = async (req:any, res:any, next:any) => {
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

  const data= JoiSchema.validate({email},options)

  try{
    if(data.error)
    {  
      return res.status(500).json(data.error.details)
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
    } catch(er:any){
      res.status(400).json(er.message)
    }
};
