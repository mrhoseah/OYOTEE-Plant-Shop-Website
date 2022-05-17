import * as bcrypt from "bcryptjs";
import {User,Prisma, PrismaClient } from "@prisma/client";
import { generateToken } from '../middleware/auth';
import { getLocalStorageMock } from '@shinshin86/local-storage-mock';
import Joi from  'joi'

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
  
      const {name,email,password,avatar,products} = req.body
      const user ={name,email,password,avatar};
       try {
          const productData = products?.map((product: Prisma.ProductCreateInput) => {
            return { name: product?.name, description: product?.description,categoryId: product?.category ,authorId: product?.author }
          }) 
      // Save User to Database  
          const newUser = await prisma.user.create({
            data:{
              name,
              email,
              avatar,
              password: bcrypt.hashSync(password, 10),
              products: {
                create: productData,
              },
            }
        })

        return res.status(201).send({
          "id": newUser.id ,
          "email": newUser.email ,
          "name": newUser.name,
          "avatar": newUser.avatar
      });
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
        const  accessToken =generateToken(user)
      
        const publicUser = {
          id:user.id,
          name:user.name,
          email:user.email,
          profile_photo_url:user.avatar
        }
        response.status(200).json({"accessToken":accessToken,user:publicUser });
      }
  } catch (error:any) {
    response.status(401).json(error.message)
  }
};
export const signout = async(req:any,res:any,next:any)=>{
  res.status(200).json({"message":"Ok"})
  return next();
}