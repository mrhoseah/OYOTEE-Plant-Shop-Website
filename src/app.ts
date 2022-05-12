import { Prisma, PrismaClient } from '@prisma/client'
import express from 'express'
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import "dotenv/config";

import multer from 'multer'
const upload = multer({ dest: 'uploads/' })

import { expressCspHeader, INLINE, NONE, SELF } from 'express-csp-header';
const prisma = new PrismaClient()
const app = express()

app.use(express.json())
app.use(expressCspHeader({
    directives: {
        'default-src': [SELF],
        'script-src': [SELF, INLINE, 'somehost.com'],
        'style-src': [SELF, 'mystyles.net'],
        'img-src': ['data:', 'images.com'],
        'worker-src': [NONE],
        'block-all-mixed-content': true
    }
}));

app.post(`/signup`, async (req, res) => {
  const { name, email,password, products,categoryId,authorId } = req.body

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
      'Secret',
      {
         expiresIn:  process.env.APP_AUTH__TOKEN_LIFETIME,
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
})
app.post(`/login`, async (req, res) => {
   const {email,password } = req.body
    const user = await prisma.user.findUnique({
        where: { email:email.toLowerCase()  },
    });
    if (!user) {
        throw new Error("Invalid credentials");
    }

    const valid = await bcrypt.compare(
        password,
        user.password,
        );
        if (!valid) {
            throw new Error("Invalid credentials");
        }
        
        const token = jwt.sign({ userId: user.id },  process.env.APP_AUTH_CLIENT_SECRET!,{ expiresIn:process.env.APP_TOKEN_LIFETIME});

  res.json({
            token,
            user,
        })
})


app.get('/categories', async (req, res) => {
  const categories = await prisma.category.findMany()
  res.json(categories)
})
app.post(`/categories`, async (req, res) => {
  const { name, description } = req.body
  const result = await prisma.category.create({
    data: {
      name,
      description
    },
  })
  res.json(result)
})
app.get(`/categories/:id`, async (req, res) => {
  const { id }: { id?: string } = req.params

  const category = await prisma.category.findUnique({
    where: { id: Number(id) },
  })
  res.json(category)
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
  const { id } = req.params
  const product = await prisma.product.delete({
    where: {
      id: Number(id),
    },
  })
  res.json(product)
})

app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany()
  res.json(users)
})

app.delete(`/users/:id`, async (req, res) => {
  const { id } = req.params
  const user = await prisma.user.delete({
    where: {
      id: Number(id),
    },
  })
  res.json(204)
})

app.get('/users/:id/drafts', async (req, res) => {
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
})

app.get(`/products/:id`, async (req, res) => {
  const { id }: { id?: string } = req.params

  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
  })
  res.json(product)
})

app.get('/products', async (req, res) => {
  const { searchString, skip, take, orderBy } = req.query

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
})

const server = app.listen(process.env.APP_PORT, () =>
  console.log(`
🚀 Server ready at: http://localhost:3030
⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`),
)