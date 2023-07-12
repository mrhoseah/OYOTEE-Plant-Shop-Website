import * as bcrypt from "bcryptjs";
import {PrismaClient } from "@prisma/client";
import { generateToken } from '../middleware/auth';
import crypto from "crypto";
import 'dotenv/config'
import { getLocalStorageMock } from '@shinshin86/local-storage-mock';
import Joi from  'joi'
import { sendMail } from "./mail.controller";
import { Request, Response } from "express";

const window = {
  localStorage: getLocalStorageMock(),
};
const prisma = new PrismaClient()
const options = {
    errors: {
      wrap: {
        label: ''
      },
      abortEarly: false
    }
  };
  export const signup =async (req:Request, response:Response) => {
  
      const {name,email,password,products} = req.body
       try {
      // Save User to Database  
          const newUser = await prisma.user.create({
            data:{
              name,
              email,
              password: bcrypt.hashSync(password, 10),
              profile: {
                create:{
                    bio:`${name}'s bio`
                  }
              },
            },
            select:{
              id:true,
              name:true,
              email:true
            }
        })

        return response.status(201).send(newUser);
    } catch (error) {
        return response.status(500).send((error as Error).message );
    }
};
export const signin = async(req:Request, response:Response) => {
  const {email,password} = req.body
  
  const user ={email,password};

  const JoiSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(5).required()
  }).options({ abortEarly: false });

  const data= JoiSchema.validate(user,options)

  try {
        const user = await prisma.user.findUnique({
          where: {
            email
          },
          select:{
            id:true,
            password:true,
            name:true,
            email:true,
            profile:{
              select:{
                avatar:true
              }
            }
          }
        })
        if (!user) {
          throw new Error("Failed!, Invalid credentials!");
        }
        const passwordIsValid = bcrypt.compareSync(
          password,
          user.password
        );
        if (!passwordIsValid) {
          throw new Error("Failed!, Invalid credentials!");
        }
        const  token =generateToken(user)
        const accessToken = await prisma.accessToken.create({
          data:{
            user:{
              connect:{
                id:user.id
              }
            },
            token
          }, select:{
            token:true
          }
        })
        response.status(200).json({"accessToken":accessToken.token});
  } catch (error) {
    return response.status(401).json((error as Error).message)
  }
};
export const forgotPassword = async (req:any,res:any) => {
    try {
      const schema = Joi.object({ email: Joi.string().email().required() });
      const { error } = schema.validate(req.body);
      if (error) return res.status(400).send(error.details[0].message);

      const user = await prisma.user.findUnique({ where:{email: req.body.email} });
      if (!user)
          throw new Error("user with given email doesn't exist");

      let token = await prisma.passwordToken.findFirst({ 
        where:{
          userId:user.id
        },select:{
          token:true
        }
      });
      if (!token) {
          token = await prisma.passwordToken.create({
              data:{
                user:{connect:{id:user.id}},
                token: crypto.randomBytes(32).toString("hex"),
              }
          });
      }

      const link = `${process.env.APP_BASEURL}:${process.env.APP_PORT}/auth/reset-password/${token.token}`;
      await sendMail(user.email, "Password reset - Oyotee Tree Shop", link);

      return res.send("password reset link sent to your email account");
  } catch (error) {
      res.send("An error occured");
      console.log(error);
  }
}

export const resetPassword =async (req:any,res:any)=>{
  try {
    const schema = Joi.object({ password: Joi.string().required() });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);


    if (!userToken)throw new Error("Invalid link or expired");

    await prisma.user.update({
      where:{
        id:userToken.userId
      },
      data:{
        password: bcrypt.hashSync(req.body.password,10)
      }
    })
    await prisma.passwordToken.delete({
      where:{
        id:userToken.id
      }
    })

    return res.status(200).json({message:"Password reset succesfully"});
  } catch (error:any) {
      res.status(403).json({message:error.message});
  }
}
export const signout = async(req:any,res:any,next:any)=>{
  try{
    const token = req.headers['authorization'].replace("Bearer ", "")
    const userToken= await prisma.accessToken.findFirst({
      where:{token}
    })
    if(!userToken){
      throw new Error("Invalid token")
    }
    await prisma.accessToken.deleteMany({
      where:{
        id:userToken.id
      }
    })
    res.status(200).json({"message":"Logged out"})
    return next();
  } catch(error:any){
    res.status(401).json({message:error.message})
  }

}