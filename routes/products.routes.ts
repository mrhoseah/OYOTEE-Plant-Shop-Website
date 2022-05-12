import { Prisma, PrismaClient } from '@prisma/client'
import multer from 'multer'
import { Router } from 'express';

const prisma = new PrismaClient()

const productsRouter = Router()
const upload = multer({ dest: 'uploads/' })


productsRouter.post(`/products`, async (req, res) => {
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

productsRouter.put('/products/:id/publish', async (req, res) => {
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
  } catch (error:any) {
    res.json({ error: `Product with ID ${id} does not exist in the database` })
  }
})

productsRouter.delete(`/products/:id`, async (req, res) => {
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

productsRouter.get(`/products/:id`, async (req, res) => {
  try{
    const { id } = req.params

    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    })
    res.json(product)
  }catch (err:any){
    res.status(401).send(err)
  }
})

productsRouter.get('/feed', async (req, res) => {
  try{
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
  }
  catch(err:any){
    res.status(400).send(err)
  }
})

export default productsRouter;