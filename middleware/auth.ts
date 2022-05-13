import * as jwt from "jsonwebtoken";
import config from 'config';
import {User, PrismaClient } from "@prisma/client";
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
    const token = req.headers['authorization'].replace("Bearer ", "")
 
    if (!token) {
      return res.status(403).send({"message":"Failed,Access denied"});
    }

    try {
    // const validToken =token.replace("Bearer ", "")
    jwt.verify(token, secretToken, (err:any, decoded:any) => {
      if (err) {
        return res.status(401).send({"message":"A token is required for authentication"})
      }
      // refreshToken(req.user)
      req.user = decoded;
      return next();
    });
  } catch (error:any) {
    return res.sendStatus(401).json(error.message)
  }
};

export const checkDuplicateEmail = async (req:any, res:any, next:any) => {
  try{
    const{email} = req.body
    const user = await prisma.user.findUnique({
          where: {
            email
          }
        })
        if (user) {
          throw new Error("User Already Exist. Please Login");
        }
        return next();
    } catch(er:any){
      res.status(400).json(er.message)
    }
};
export const checkEmptyFields = async (req:any, res:any, next:any) => {
  try{
    const{email,name,password} = req.body
        // Validate user input
        if (!(email && password && name )) {
          throw new Error("All input is required");
        }
        return next();
  }catch(er:any){
    res.status(400).json(er.message)
  }
};
