import express from 'express';
import { Prisma, PrismaClient } from '@prisma/client'
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import config from 'config';
import multer from 'multer'

const upload = multer({ dest: 'uploads/' })

const {secretToken,refreshLifetime} = config.get('App.client');
const prisma = new PrismaClient()

const router = express.Router()

router.post(`/login`, async (req, res) => {
    try{

   
    const {email,password } = req.body
    const user = await prisma.user.findUnique({
        where: { email:email.toLowerCase()  },
    });
    if (!user) {
      return res.status(401).send("Invalid credentials");
    }

    const valid = await bcrypt.compare(
        password,
        user.password,
        );
        if (!valid) {
          return res.status(401).send("Invalid credentials");
        }
        
        const token = await jwt.sign({ userId: user.id },  secretToken,{ expiresIn:refreshLifetime});

      res.json({
                token,
            user,
        }) 
    } catch (err){
      res.status(401).send(err)
    }
})

router.post(`/signup`, async (req, res) => {

  try{

    const { name, email,password, products} = req.body
        // Validate user input
        if (!(email && password && name )) {
          res.status(400).send("All input is required");
        }
    
        // check if user already exist
        // Validate if user exist in our database
        const registeredUser = await prisma.user.findUnique({where:{ email }});
    
        if (registeredUser) {
          return res.status(409).send("User Already Exist. Please Login");
        }
    
  const productData = products?.map((product: Prisma.ProductCreateInput) => {
    return { name: product?.name, description: product?.description,categoryId: product?.category ,authorId: product?.author }
  })
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = await bcrypt.hash(password, salt)
  const userData = await prisma.user.create({
    data: {
      name,
      email:email.toLowerCase(),
      password:hashedPassword,
      products: {
        create: productData,
      },
    },
  })
  const token = jwt.sign(
      { user_id: userData.id, email },
      secretToken,
      {
         expiresIn:  refreshLifetime,
      }
    );
    const user = {
    "id": userData.id ,
    "email": userData.email ,
    "name": userData.name,
    "avatar": userData.avatar
}


  // return new user
  res.status(201).json({ user,token  });
 } catch (err){
    res.status(401).send(err)
  }
  })
  
  module.exports = router