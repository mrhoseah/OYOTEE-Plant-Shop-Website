import * as bcrypt from "bcryptjs";
import {User,Prisma, PrismaClient } from "@prisma/client";
import { generateToken } from '../middleware/auth';

const prisma = new PrismaClient()

export const signup =async (req:any,res:any) => {
    try {
      const {name,email,password,products} = req.body
      
      const productData = products?.map((product: Prisma.ProductCreateInput) => {
        return { name: product?.name, description: product?.description,categoryId: product?.category ,authorId: product?.author }
      }) 
      // Save User to Database   
      const newUser:User= await prisma.user.create({
        data:{
          name,
          email,
          password: bcrypt.hashSync(password, 10),
          products: {
            create: productData,
          },
        }
    })

    res.status(201).send({
      "id": newUser.id ,
      "email": newUser.email ,
      "name": newUser.name,
      "avatar": newUser.avatar
  });
    } catch (error:any) {
        res.status(500).send({ message: error.meta.cause });
    }
};
export const signin = async(req:any, res:any) => {
  try {
     const {email,password} = req.body
    const user = await prisma.user.findUnique({
      where: {
        email
      }
    })
    if (!user) {
      return res.status(404).send({ message: "Failed!, Invalid credentials!"});
    }
    const passwordIsValid = bcrypt.compareSync(
      password,
      user.password
    );
    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Failed!, Invalid credentials!"
      });
    }
 
    res.status(200).send({
      id: user.id,
      name: user.name,
      email: user.email,
      accessToken: generateToken(user)
    });
  } catch (error:any) {
      res.status(500).send({ message: error.meta.cause});
  }

};
