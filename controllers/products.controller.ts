import { Prisma, PrismaClient } from '@prisma/client'
import multer from 'multer'

const prisma = new PrismaClient()

const upload = multer({ dest: 'uploads/' })


export const listing= async (req:any, res:any) => {
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
}

export const create= async (req:any, res:any) => {
  try {
    const { id } = req.params
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
    if(!updatedProduct)res.status(404).send(`Product with ID ${req.body.id} does not exist in the database`)
    res.json(updatedProduct)
  } catch (error:any) {
    res.json({ error: error.meta.cause })
  }
}
export const update= async (req:any, res:any) => {
  try {
    const { id,name,description,image } = req.params
    const productData = await prisma.product.findUnique({
      where: { id: Number(id) },
    })

    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) || undefined },
      data: { published: !productData?.published },
    })
    if(!updatedProduct)res.status(404).send(`Product with ID ${req.body.id} does not exist in the database`)
    res.json(updatedProduct)
  } catch (error:any) {
    res.json({ error: error.meta.cause })
  }
}
export const publish= async (req:any, res:any) => {
  try {
    const { id } = req.params
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
    if(!updatedProduct)res.status(404).send(`Product with ID ${req.body.id} does not exist in the database`)
    res.json(updatedProduct)
  } catch (error:any) {
    res.json({ error: error.meta.cause })
  }
}
export const drafts= async (req:any, res:any) => {
  try{
     const drafts = await prisma.product
      .findMany({
        where: {
         published: false ,
        },
      })

    res.json(drafts)
  }catch (err){
    res.status(400).send(err)
  }
}

export const destroy = async (req:any, res:any) => {
  try{
    const { id } = req.params
    const product = await prisma.product.delete({
      where: {
        id: Number(id),
      },
    })
  res.status(204).send('Ok')
  }catch (err:any){
    res.status(404).send(err.meta.cause)
  }
}

export const show=async (req:any, res:any) => {
  try{
    const { id } = req.params

    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    })
    res.json(product)
  }catch (err:any){
    res.status(404).send(err)
  }
}

export const search = async (req:any, res:any) => {
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
}