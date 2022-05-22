import { PrismaClient } from '@prisma/client'
import {validateCoupon} from '../helpers/validator'
const prisma = new PrismaClient()


export const listing =async (req:any,res:any) => {
    try {
        await prisma.coupon.findMany({
            select:{
                id:true,
                name:true,
                code:true,
                discount:true,
                startDate:true,
                expiryDate:true,
                _count:{
                  select:{products:true}
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

        // check if coupon exist
        // Validate if coupon exist in our database
        const response =validateCoupon(data)
        if(response.error)
        {  
            return res.status(500).send(response.error.details)
        }
        const couponFound = await prisma.coupon.findUnique({where:{ id}});
        
        if (!couponFound) {
            throw new Error(`Coupon with ID ${id} does not exist`);
        }
         const coupon = await prisma.coupon.findUnique({
            where:{ id}
        })
        res.status(200).json(coupon)
    } catch (error:any) {
        return res.status(404).json({message:error.message})
    }
}
export const create =async (req:any,res:any) => {
    const{name,discount,startDate,expiryDate,code}=req.body
    try {
        const data = {name,discount,startDate,expiryDate,code};

        // check if coupon already exist
        // Validate if coupon exist in our database
        const response =validateCoupon(data)
        if(response.error)
        {  
          return res.status(500).send(response.error.details)
        }
        const isCouponCreated = await prisma.coupon.findFirst({where:{ code}});
        
        if (isCouponCreated) {
          throw new Error("Coupon already exist.");
        }

        await prisma.coupon.create({
          data:{
            name,
            discount,
            startDate,
            expiryDate,
            code
          }
        })
        return res.status(201).json({message:"Coupon created"})
    } catch (error:any) {
        return res.status(400).json({message:error.message})
    }
}
export const update =async (req:any,res:any) => {
    const{id,name,discount,startDate,expiryDate,code}=req.body
    try {
        const data = {id,name,discount,startDate,expiryDate,code};

        // check if coupon already exist
        // Validate if coupon exist in our database
        const response =validateCoupon(data)
        if(response.error)
        {  
          return res.status(500).send(response.error.details)
        }
        const coupon = await prisma.coupon.findUnique({where:{ id}});
       
        if (!coupon) {
          throw new Error(`Coupon with ID ${id} does not exist`);
        }
        await prisma.coupon.update({
            where:{
                id
            },
          data: {
            name,
            code,
            discount,
          },
        })
        return res.status(201).json({message:"Coupon updated"})
    } catch (error:any) {
        return res.status(400).json({message:error.message})
    }
}
export const destroy =async (req:any,res:any) => {
    const{id}=req.body
    try {
        const data = {id};

        // check if coupon already exist
        // Validate if coupon exist in our database
        const response =validateCoupon(data)
        if(response.error)
        {  
          return res.status(500).send(response.error.details)
        }
        const coupon = await prisma.coupon.findUnique({where:{ id}});
        
        if (!coupon) {
          throw new Error(`Coupon with ID ${id} does not exist`);
        }
        await prisma.coupon.delete({
            where:{
                id
            }
        })
        return res.status(204).json({message:"Coupon deleted"})
    } catch (error:any) {
        return res.status(400).json({message:error.message})
    }
}
