import express from 'express';
import { Prisma, PrismaClient } from '@prisma/client'
import multer from 'multer'

const upload = multer({ dest: 'uploads/' })

const prisma = new PrismaClient()

const router = express.Router()

router.post(`/products`, async (req, res) => {
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

router.put('/products/:id/publish', async (req, res) => {
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

router.delete(`/products/:id`, async (req, res) => {
  try{
    const { id } = req.params
    const product = await prisma.product.delete({
      where: {
        id: Number(id),
      },
    })
  res.json(product)
  }catch (err){
    res.status(404).send(err.meta.cause)
  }
})

router.get('/users', async (req, res) => {
  try{
    const users = await prisma.user.findMany()
    res.json(users)
    }catch (err){
      res.status(401).send(err)
    }
})

router.delete(`/users/:id`, async (req, res) => {
  try{
    const { id } = req.params
    const user = await prisma.user.delete({
      where: {
        id: Number(id),
      },
    })
    res.status(204).send('Ok')
    }catch (err){
      res.status(404).send(err.meta.cause)
    }
})

router.get('/users/:id/drafts', async (req, res) => {
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

router.get(`/products/:id`, async (req, res) => {
  try{
    const { id } = req.params

    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    })
    res.json(product)
  }catch (err){
    res.status(401).send(err)
  }
})

router.get('/products', async (req, res) => {
 try{   const { searchString, skip, take, orderBy } = req.query
 
    const or  = searchString
      ? {
          OR: [
            { name: { contains: searchString } },
            { description: { contains: searchString } },
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
        updatedAt: orderBy,
      },
    })

    res.json(products)
  }catch (err){
    res.status(401).send(err)
  }
})

module.exports = router