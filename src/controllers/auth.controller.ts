import prisma from "../utils/db";
import { generateToken } from '../utils/auth';
import 'dotenv/config'
import Joi from  'joi'
import { sendMail } from "./mail.controller";
import { Request, Response } from "express";
import * as bcrypt from "bcryptjs";
import { getTokenByUserId, getTokenByPasswordToken, createUser, getUserByEmail, createAccessToken, updateUserById, deleteTokenAfterUse, deleteAccessTokens } from "../models/user.model";

const options = {
    errors: {
      wrap: {
        label: ''
      },
      abortEarly: false
    }
  };
  export const signup =async (req:Request, response:Response) => {
  
      const {name,email,password} = req.body
       try {
      // Save User to Database  
          const newUser = await createUser(name,email,password);
        return response.status(201).json(newUser);
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
        const user = await getUserByEmail(email)
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
        const accessToken = await createAccessToken(user,token)
        return response.status(200).json(accessToken.token);
  } catch (error) {
    return response.status(403).json((error as Error).message)
  }
};
export const forgotPassword = async (req:any,res:any) => {
    try {
      const schema = Joi.object({ email: Joi.string().email().required() });
      const { error } = schema.validate(req.body);
      if (error) return res.status(400).send(error.details[0].message);

      const user = await getUserByEmail(req.body.email);
      if (!user)
          throw new Error("user with given email doesn't exist");

      const  token = await getTokenByUserId(user.id);
      if (!token) {
           throw new Error("Invalid token")
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
    const {token}=req.body
    if (error) return res.status(400).send(error.details[0].message);

    const userToken = await getTokenByPasswordToken(token);
    if (!userToken)throw new Error("Invalid link or expired");

    const updatePassword = await updateUserById(userToken.userId,req.body.password)
    await deleteTokenAfterUse(userToken.id)
    return res.status(200).json({message:"Password reset succesfully"});
  } catch (error:any) {
      return res.status(403).json({message:error.message});
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
    await deleteAccessTokens(userToken.userId)
    res.status(200).json({"message":"Logged out"})
    return next();
  } catch(error:any){
    res.status(401).json({message:error.message})
  }

}
