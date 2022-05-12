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
  try {
    const {secretToken} = config.get('App.client');
    const token = req.header('authorization');

    if (!token) {
      return res.status(403).send({"message":"Access denied!"});
    }
    const validToken =token.replace("Bearer ", "")
    jwt.verify(validToken, secretToken, (err:any, decoded:any) => {
      if (err) {
        return res.status(401).send({
          message: "Unauthorized!"
        });
      }
      refreshToken(req.user)
      req.user = decoded.user;
      next();
    });
  } catch (error:any) {
    return res.status(401).send(error.message)
  }
};

export const checkDuplicateEmail = async (req:any, res:any, next:any) => {
  try{
    const{email} = req.body
    const user = await prisma.user.findUnique({
          where: {
            email:req.body.email
          }
        })
        if (user) {
          res.status(409).send({"message":"User Already Exist. Please Login"});
        }
        next();
    } catch(er:any){
      res.status(400).send(er.message)
    }
};
export const checkEmptyFields = async (req:any, res:any, next:any) => {
  try{
    const{email,name,password} = req.body
        // Validate user input
        if (!(email && password && name )) {
          res.status(400).send("All input is required");
        }
        next();
  }catch(er:any){
    res.status(400).send(er.meta.cause)
  }
};
