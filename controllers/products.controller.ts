import { Prisma, PrismaClient } from '@prisma/client'
import multer from 'multer'
import { getLocalStorageMock } from '@shinshin86/local-storage-mock';
import Joi, { any } from  'joi'
import { unlink, unlinkSync } from 'fs';
const window = {
  localStorage: getLocalStorageMock(),
};
const prisma = new PrismaClient()

export const listing= async (req:any, res:any) => {
  const result = await prisma.product.findMany({
    select:{
      id:true,
      name:true,
      description:true,
      price:true,
      image:true,
      _count:{
        select:{
          ratings:true,
          likes:true
        }
      }
    }
  })
  res.status(200).json(result)
}
export const create= async (req:any, res:any) => {
  const { name, description,price,image, authorId,category } = req.body
  const options = {
    errors: {
      wrap: {
        label: ''
      }
    }
  };
  const JoiSchema = Joi.object().keys({
      price: Joi.number().required(),
      name: Joi.string().min(3).required(),
      description: Joi.string().required(),
      image: Joi.string().required(),
      category: Joi.number().required()
  }).options({ abortEarly: false });

  const data= JoiSchema.validate({name,description,image,price,category},options)
  try {
    console.log(req.file.path)
        if(data.error){
          return res.status(400).json(data.error.details);
        }
        const result = await prisma.product.create({
          data: {
              name,
              description,
              price,
              image:req.file.path,
              category: { connect: { id: category } },
              author: { connect: { id: authorId } }
            }
          });
          return res.status(201).json({id:result.id,name:result.name,description:result.description,image:result.image,price:result.price})
      } catch (error:any) {
        return res.status(400).json(error.message)
      }
}

export const update=  async (req:any, res:any) => {
  try {
   console.log( req.file.path)
    const { id,name,description,image,price } = req.params
    const productData = await prisma.product.findUnique({
      where: { id: Number(id) },
    })

    if(req.file){
      unlinkSync('public/../'+productData?.image);
    }
    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) || undefined },
      data: { description,name,image:req.file&&req.file.path,price},
    })
    if(!updatedProduct) throw new Error(`Product with ID ${req.body.id} does not exist in the database`)
    res.status(200).json({message:"success"})
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

export const rate =async (req:any, res:any) => {
  const { productId,userId } = req.body
      try{
        const rated = await prisma.rating.findUnique({
          where: {
            ratedById_productId:{
              ratedById:userId,
              productId
            }
          }  
        });
        if(rated) {
          throw new Error("You have already rated this product")
        }
        await prisma.rating.create({
          data: {
                ratedBy:{
                  connect:{id:userId}
                },
                product:{
                  connect:{id:userId}
                }
            },
        });
        const product = await prisma.product.findUnique({
          where:{id:productId},
          select:{
            id:true,
            name:true,
            description:true,
            price:true,
            image:true,
            _count:{
              select:{
                ratings:true,
                likes:true
              }
            }
          }
        })
        return res.status(201).json({product})
      }catch(err:any){
        return res.status(500).json({message:err.message})
      }
}
export const like =async (req:any, res:any) => {
  const { productId,userId } = req.body
      try{
        const liked = await prisma.like.findUnique({
          where: {
            likedById_productId:{
              likedById:userId,
              productId
            }
          }  
        });
        if(!liked){
          const like = await prisma.like.create({
            data: {
                  likedBy:{
                    connect:{id:userId}
                  },
                  product:{
                    connect:{id:userId}
                  }
              },
          });
        }else{
          await prisma.like.delete({
            where: {
              likedById_productId:{
                likedById:userId,
                productId
              }
            }  
          });
        }
        const product = await prisma.product.findUnique({
          where:{id:productId},
          select:{
            id:true,
            name:true,
            description:true,
            price:true,
            image:true,
            _count:{
              select:{
                ratings:true,
                likes:true
              }
            }
          }
        })
        return res.status(201).json({product})
      }catch(err:any){
        return res.status(500).json(err.message)
      }
}