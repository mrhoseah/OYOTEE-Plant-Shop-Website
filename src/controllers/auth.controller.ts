import * as bcrypt from "bcryptjs";
import {PrismaClient } from "@prisma/client";
import { generateToken } from '../middleware/auth';
import crypto from "crypto";
import config from 'config'
import { getLocalStorageMock } from '@shinshin86/local-storage-mock';
import Joi from  'joi'
import { sendMail } from "./mail.controller";
const {baseurl,port} = config.get('App.appConfig');

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
  export const signup =async (req:any,res:any) => {
  
      const {name,email,password,products} = req.body
      const user ={name,email,password};
       try {
          // const productData = products?.map((product: Prisma.ProductCreateInput) => {
          //   return { name: product?.name, description: product?.description,categoryId: product?.category ,authorId: product?.author }
          // }) 
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

        return res.status(201).send(newUser);
    } catch (error:any) {
        res.status(500).send(error.message );
    }
};
export const signin = async(req:any, response:any) => {
  const {email,password} = req.body
  
  const user ={email,password};

  const JoiSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(5).required()
  }).options({ abortEarly: false });

  const data= JoiSchema.validate(user,options)

  try {
      if(data.error)
      {  
        return response.json(response.error.details)
      }
      else{
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
        response.status(200).json({"accessToken":accessToken.token,user:{
            id:user.id,
            name:user.name,
            email:user.email,
            profile_photo_url:user.profile
        } });
      }
  } catch (error:any) {
    response.status(401).json(error.message)
  }
};
export const forgotPassword = async (req:any,res:any) => {
    try {
      const schema = Joi.object({ email: Joi.string().email().required() });
      const { error } = schema.validate(req.body);
      if (error) return res.status(400).send(error.details[0].message);

      const user = await prisma.user.findUnique({ where:{email: req.body.email} });
      if (!user)
          return res.status(400).send("user with given email doesn't exist");

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

      const link = `${baseurl}:${port}/auth/reset-password/${token.token}`;
      await sendMail(user.email, "Password reset - Oyotee Tree Shop", link);

      res.send("password reset link sent to your email account");
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

    const userToken = await prisma.passwordToken.findFirst({
      where:{
        token: req.query.token,
      },select:{
        id:true,
        token:true,
        userId:true
      }
    });
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