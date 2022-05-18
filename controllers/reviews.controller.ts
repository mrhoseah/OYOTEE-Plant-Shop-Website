import { PrismaClient } from '@prisma/client'
import {validateReview} from '../helpers/validator'
const prisma = new PrismaClient()


export const listing =async (req:any,res:any) => {
    try {
        await prisma.review.findMany({
            select:{
                id:true,
                name:true,
                description:true,
                reviewedBy:{select:{id:true,name:true,avatar:true}},
                products:{
                    select:{
                      id:true,
                      name:true
                    },
                  }
            }
        })
    } catch (error:any) {
        return res.status(404).json({message:error.message})
    }
}
export const show =async (req:any,res:any) => {
    const {id}= req.body
    try {

        const data = {id};

        // check if Review exist
        // Validate if Review exist in our database
        const response =validateReview(data)
        if(response.error)
        {  
            return res.status(500).send(response.error.details)
        }
        const reviewFound = await prisma.review.findUnique({where:{ id}});
        
        if (!reviewFound) {
            throw new Error(`Review with ID ${id} does not exist`);
        }
         const review = await prisma.review.findUnique({
            where:{ id},
            select:{
                id:true,
                name:true,
                description:true,
                reviewedBy:{
                  select:{
                    id:true,name:true,avatar:true
                  }
                },
                products:{
                    select:{
                      id:true,
                      name:true
                    },
                  }
            }
        })
        res.status(200).json(review)
    } catch (error:any) {
        return res.status(404).json({message:error.message})
    }
}
export const create =async (req:any,res:any) => {
    const{name,description,userId,productId}=req.body
    try {
        const data = {name,description,userId,productId};

        // check if Review already exist
        // Validate if Review exist in our database
        const response =validateReview(data)
        if(response.error)
        {  
          return res.status(500).send(response.error.details)
        }
        const isReviewCreated = await prisma.review.findUnique({where:{ productId,userId}});
        
        if (isReviewCreated) {
          throw new Error("Your review on this product already exist.");
        }
        await prisma.review.create({
          data: {
            name,
            description
          },
        })
        return res.status(201).json({message:"Review created"})
    } catch (error:any) {
        return res.status(400).json({message:error.message})
    }
}
export const update =async (req:any,res:any) => {
    const{id,name,description,userId,productId}=req.body
    try {
        const data = {id,name,discount,startDate,expiryDate,code,productId};

        // check if Review already exist
        // Validate if Review exist in our database
        const response =validateReview(data)
        if(response.error)
        {  
          return res.status(500).send(response.error.details)
        }
        const review = await prisma.review.findUnique({where:{ id}});
        
        if (!review) {
          throw new Error(`Review with ID ${id} does not exist`);
        }
        await prisma.review.update({
            where:{
                id
            },
          data: {
            name,
            description,
            product:{connect:{id:productId}},
            reviewedBy:{connect:{id:userId}},
          },
        })
        return res.status(201).json({message:"Review updated"})
    } catch (error:any) {
        return res.status(400).json({message:error.message})
    }
}
export const destroy =async (req:any,res:any) => {
    const{id}=req.body
    try {
        const data = {id};

        // check if Review already exist
        // Validate if Review exist in our database
        const response =validateReview(data)
        if(response.error)
        {  
          return res.status(500).send(response.error.details)
        }
        const review = await prisma.review.findUnique({where:{ id}});
        
        if (!review) {
          throw new Error(`Review with ID ${id} does not exist`);
        }
        await prisma.review.delete({
            where:{
                id
            }
        })
        return res.status(204).json({message:"Review deleted"})
    } catch (error:any) {
        return res.status(400).json({message:error.message})
    }
}
