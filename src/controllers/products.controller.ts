import Joi from  'joi'
import {
  browseProducts,
  createProduct, createProductLikesByProductIdByUserId, createProductReview, deleteProductLikesByProductIdByUserId,
  getProductById, getProductLikesByProductId,
  getProductReviewsByProductId,
  publishProduct,
  updateProduct
} from "../models/product.model";
import {Request, Response} from "express";
import prisma from "../utils/db";
import {Prisma} from "@prisma/client";


export const listing= async (req:Request,res:Response) => {
  const products = await browseProducts();
  products.forEach(function (element) {
    element.rating=element._count.reviews>0?(element.reviews.map(({ rateValue }) => rateValue).reduce((a,b)=>a+b,0))/element._count.reviews:0
  });
  res.status(200).json(products)
}

export const create= async (req:Request,res:Response) => {
  const { name, description,price,image_url, authorId,categoryId ,quantity} = req.body
  const options = {
    errors: {
      wrap: {
        label: ''
      }
    }
  };
  //TO BE MOVED TO utils/validation.ts
  const JoiSchema = Joi.object().keys({
      price: Joi.number().required(),
      name: Joi.string().min(3).required(),
      description: Joi.string().required(),
      quantity: Joi.number().required(),
    categoryId: Joi.number().required()
  }).options({ abortEarly: false });

  const data= JoiSchema.validate({name,description,price,categoryId,quantity},options)
  try {
        if(data.error){
          return res.status(400).json(data.error.details);
        }
        const result = await createProduct({name, description, price, quantity, image_url, categoryId, authorId});
          return res.status(201).json({data:result})
      } catch (error) {
        return res.status(400).json({error: (error as Error).message})
      }
}

export const update=  async (req:Request,res:Response) => {
  try {
    const { id,name,description,price,quantity,categoryId,image_url } = req.params
    const productData = await getProductById(Number(id))
    if(!productData) {
      throw new Error(`Product with ID ${req.body.id} does not exist in the database`)
    }
    const updatedProduct = await updateProduct({productId:Number(id),name,description,price:Number(price),quantity:Number(quantity),image_url,categoryId:Number(categoryId)})
    
    return res.status(200).json({message:"success"})
  } catch (error) {
    return res.json({ error: (error as Error).cause })
  }
}
export const publish= async (req:Request,res:Response) => {
  try {
    const { id } = req.params
    const productData = await getProductById(Number(id))

    const updatedProduct = await publishProduct(Number(id));
    if(!updatedProduct)return res.status(404).send(`Product with ID ${req.body.id} does not exist in the database`)
    return res.status(201).json(updatedProduct)
  } catch (error) {
    return res.status(400).json({error:(error as Error).message  })
  }
}
export const drafts= async (req:Request,res:Response) => {
  try{
     const drafts = await prisma.product
      .findMany({
        where: {
         published: false ,
        },
      })

    return res.json(drafts)
  }catch (error){
    return res.status(400).json({error:(error as Error).message  })
  }
}

export const destroy = async (req:Request,res:Response) => {
  try{
    const { id } = req.params
    const product = await prisma.product.delete({
      where: {
        id: Number(id),
      },
    })
  res.status(204).send('Ok')
  }catch (err){
    res.status(404).send((err as Error).cause)
  }
}

export const show=async (req:Request, res:Response) => {
  try{
    const { productId } = req.params
    const averageReviews = await getProductReviewsByProductId(Number(productId))
    const product = await getProductById(Number(productId))
    return res.json({...product,avg_review:averageReviews})
  }catch (err){
    return res.status(400).json({error:( err as Error).message  })
  }
}

export const search = async (req:Request, res:Response) => {
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

    return res.json(products)
  }
  catch(err){
    return res.status(400).json({error:(err as Error).message  })
  }
}

export const like =async (req:Request,res:Response) => {
  const { productId,userId } = req.body
      try{
        const liked  = await getProductLikesByProductId(productId);
        if(!liked){
          await createProductLikesByProductIdByUserId(productId,userId);
        }else{
          await deleteProductLikesByProductIdByUserId(productId,userId);
        }
        return res.status(201).json({liked})
      }catch(err){
        return res.status(400).json({error:(err as Error).message  })
      }
}
export const review =async (req:Request, res:Response) => {
  const { productId,userId,content,rating } = req.body
      try{
        const rated = await getProductReviewsByProductId(productId);
        if(rated){
          throw new Error ("You have already reviewed this product")
        }else{
          await createProductReview(userId,productId,content,rating);
        }
        return res.status(201).json({message:'success'})
      }catch(err){
        res.status(500).json({error:(err as Error).message  })
      }
}