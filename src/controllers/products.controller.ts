import { Prisma, PrismaClient } from '@prisma/client'
import { getLocalStorageMock } from '@shinshin86/local-storage-mock';
import Joi from  'joi'
import {  existsSync, unlink } from 'fs';
import path from 'path';
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
      categoryId:true,
      image_path:true,
      _count:{
        select:{
          reviews:true,
          likes:true,

        }
      }
    }
  })

  res.status(200).json(result)
}
export const create= async (req:any, res:any) => {
  const { name, description,price,image, authorId,category ,quantity} = req.body
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
      quantity: Joi.number().required(),
      category: Joi.number().required()
  }).options({ abortEarly: false });

  const data= JoiSchema.validate({name,description,price,category,quantity},options)
  try {
        if(data.error){
          return res.status(400).json(data.error.details);
        }
        const result = await prisma.product.create({
          data: {
              name,
              description,
              price:Number(price),
              quantity:Number(quantity),
              image:req.file.filename,
              image_path:req.file.path.split('\\').slice(1).join('\\'),
              category: { connect: { id: Number(category) } },
              author: { connect: { id: Number(authorId) } }
            }
          });
          return res.status(201).json({id:result.id,name:result.name,description:result.description,image:result.image,price:result.price})
      } catch (error:any) {
        return res.status(400).json({Error:error.message})
      }
}

export const update=  async (req:any, res:any) => {
  try {
    const { id,name,description,price,quantity } = req.params
    const productData = await prisma.product.findUnique({
      where: { id: Number(id) },
    })
    if(!productData) {
      throw new Error(`Product with ID ${req.body.id} does not exist in the database`)
    }
    const oldImage =path.resolve(__dirname, '../', 'public/products/')
    if(existsSync(oldImage+productData?.image)){
      unlink(oldImage+productData?.image,(err)=>{
        if(err){
          throw new Error(err.message)
        }
      });
    }
    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) || undefined },
      data: { description,name,image:req.file&&req.file.filename,image_path:req.file&&req.file.path.split('\\').slice(1).join('\\'),price,quantity},
    })
    
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
    res.status(201).json(updatedProduct)
  } catch (error:any) {
    res.status(400).json({error:error.message  })
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
  }catch (error:any){
    res.status(400).json({error:error.message  })
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
    const averagereviews = await prisma.review.aggregate({
      where:{
        productId:id
      }
    })
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
      select:{
        id:true,
        name:true,
        description:true,
        price:true,
        image_path:true,
        _count:{
          select:{
            reviews:true,
            likes:true
          }
        }
      }
    })
    res.json({...product,avg_review:averagereviews})
  }catch (err:any){
    res.status(400).json({error:err.message  })
  }
}

// export const search = async (req:any, res:any) => {
//   try{
//   const { searchString, skip, take, orderBy } = req.query

//   const or: Prisma.ProductWhereInput = searchString
//     ? {
//         OR: [
//           { name: { contains: searchString as string } },
//           { description: { contains: searchString as string } },
//         ],
//       }
//     : {}

//   const products = await prisma.product.findMany({
//     where: {
//       published: true,
//       ...or,
//     },
//     include: { author: true },
//     take: Number(take) || undefined,
//     skip: Number(skip) || undefined,
//     orderBy: {
//       updatedAt: orderBy as Prisma.SortOrder,
//     },
//   })

//     res.json(products)
//   }
//   catch(err:any){
//     res.status(400).json({error:err.message  })
//   }
// }

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
          await prisma.like.create({
            data: {
                  likedBy:{
                    connect:{id:userId}
                  },
                  product:{
                    connect:{id:productId}
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
            _count:{
              select:{
                likes:true
              }
            }
          }
        })
        return res.status(201).json({product})
      }catch(err:any){
        res.status(500).json({error:err.message  })
      }
}