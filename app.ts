import { Prisma, PrismaClient } from '@prisma/client'
import express from 'express'
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import config from 'config';
import cors from 'cors';
import multer from 'multer'


const upload = multer({ dest: 'uploads/' })
const {port,host} = config.get('App.appConfig');
const {secretToken,refreshLifetime} = config.get('App.client');
const prisma = new PrismaClient()
const app = express()

app.use(express.json())
app.use(cors())

app.post(`/login`, async (req, res) => {
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

app.post(`/signup`, async (req, res) => {

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

app.use(function(req, res, next) {
  console.log('req.url', req.url);
  res.status(401).send('Please login to get access');
});

app.get('/categories', async (req, res) => {
  try{

    const categories = await prisma.category.findMany()
    res.json(categories)
  }catch (err){
    res.status(401).send(err)
  }
})
app.post(`/categories`, async (req, res) => {
    try{  
      const { name, description } = req.body
        // check if category already exist
        // Validate if category exist in our database
        const takenCategory = await prisma.category.findUnique({where:{ name }});
    
        if (takenCategory) {
          return res.status(409).send("Category already exist.");
        }
      const result = await prisma.category.create({
        data: {
          name,
          description
        },
      })
      res.json(result)
    }catch (err){
      res.status(409).send(err)
    }
})
app.get(`/categories/:id`, async (req, res) => {
  const { id }: { id?: string } = req.params

  const category = await prisma.category.findUnique({
    where: { id: Number(id) },
  })
  res.json(category)
})

app.delete(`/categories/:id`, async (req, res) => {
  try{
    const { id } = req.params
    const user = await prisma.category.delete({
      where: {
        id: Number(id),
      },
    })
    res.status(204).send('Ok')
    }catch (err:any){
      res.status(404).send(err.meta.cause)
    }
})

app.post(`/products`, async (req, res) => {
  const { name, description, authorId,categoryId } = req.body
  const result = await prisma.product.create({
    data: {
      name,
      description,
      category: { connect: { id: categoryId } },
      author: { connect: { id: authorId } }
    },
  })
  res.json(result)
})

app.put('/products/:id/publish', async (req, res) => {
  const { id } = req.params

  try {
    const productData = await prisma.product.findUnique({
      where: { id: Number(id) },
      select: {
        published: true,
      },
    })

    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) || undefined },
      data: { published: !productData?.published },
    })
    res.json(updatedProduct)
  } catch (error) {
    res.json({ error: `Product with ID ${id} does not exist in the database` })
  }
})

app.delete(`/products/:id`, async (req, res) => {
  try{
    const { id } = req.params
    const product = await prisma.product.delete({
      where: {
        id: Number(id),
      },
    })
  res.json(product)
  }catch (err:any){
    res.status(404).send(err.meta.cause)
  }
})

app.get('/users', async (req, res) => {
  try{
    const users = await prisma.user.findMany()
    res.json(users)
    }catch (err){
      res.status(401).send(err)
    }
})

app.delete(`/users/:id`, async (req, res) => {
  try{
    const { id } = req.params
    const user = await prisma.user.delete({
      where: {
        id: Number(id),
      },
    })
    res.status(204).send('Ok')
    }catch (err:any){
      res.status(404).send(err.meta.cause)
    }
})

app.get('/users/:id/drafts', async (req, res) => {
  try{
    const { id } = req.params

    const drafts = await prisma.user
      .findUnique({
        where: {
          id: Number(id),
        },
      })
    .products({
      where: { published: false },
    })

  res.json(drafts)
  }catch (err){
    res.status(401).send(err)
  }
})

app.get(`/products/:id`, async (req, res) => {
  try{
    const { id }: { id?: string } = req.params

    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    })
    res.json(product)
  }catch (err){
    res.status(401).send(err)
  }
})

app.get('/products', async (req, res) => {
 try{   const { searchString, skip, take, orderBy } = req.query

    const or: Prisma.ProductWhereInput = searchString
      ? {
          OR: [
            { name: { contains: searchString as string } },
            { description: { contains: searchString as string } },
          ],
        }
      : {}

    const products = await prisma.product.findMany({
      where: {
        published: true,
        ...or,
      },
      include: { author: true },
      take: Number(take) || undefined,
      skip: Number(skip) || undefined,
      orderBy: {
        updatedAt: orderBy as Prisma.SortOrder,
      },
    })

    res.json(products)
  }catch (err){
    res.status(401).send(err)
  }
})

const server = app.listen(port, () =>
  console.log(`
🚀 Server ready at: ${host}:${port}
⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`),
)