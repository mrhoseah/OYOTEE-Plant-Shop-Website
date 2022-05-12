import * as jwt from "jsonwebtoken";
import config from 'config';
import {User, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()
import * as bcrypt from "bcryptjs";

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
    let token = req.headers["x-access-token"];
    if (!token) {
      return res.status(403).send("No token provided!");
    }
    jwt.verify(token, secretToken, (err:any, decoded:any) => {
      if (err) {
        return res.status(401).send({
          message: "Unauthorized!"
        });
      }
      refreshToken(req.user)
      req.userId = decoded.id;
      next();
    });
  } catch (error:any) {
    return res.status(401).send(error)
  }
};

export const checkDuplicateEmail = async (req:any, res:any, next:any) => {
  try{
    const{email} = req.body
        await prisma.user.findUnique({
          where: {
            email
          }
        }).then(user => {
          if (user) {
            return res.status(409).send({"message":"User Already Exist. Please Login"});
          }
          next();
        });
  }catch(er){
    res.status(400).send(er)
  }
};
export const checkEmptyFields = async (req:any, res:any, next:any) => {
  try{
    const{email,name,password} = req.body
        // Validate user input
        if (!(email && password && name )) {
          res.status(400).send("All input is required");
        }
  }catch(er:any){
    res.status(400).send(er.meta.cause)
  }
};
