import {validateCategory} from '../utils/validator'
import { createCategory, deleteCategoryById, getCategoryByName } from '../models/category.models'
import {Request,Response} from 'express'
import prisma from '../utils/db'

export const listing=async (req:Request, res:Response) => {
  try{
    const categories = await prisma.category.findMany({
      select:{
        id:true,
        name:true,
        description:true
      }
    })
    res.status(200).json(categories)
  }catch (error){
    res.status(404).send((error as Error).message)
  }
}

export const create =async (req:Request, res:Response) => {
  const { name, description } = req.body

        const data = { name, description };

        // check if category already exist
        // Validate if category exist in our database
        const response =validateCategory(data)
      try{
          const takenCategory = await getCategoryByName(name);
        
          if (takenCategory) {
            throw new Error("Category name already exist");
          }
          const result = await createCategory(name,description)
          return res.status(201).json({message:"created"})
      }catch(err){
        return res.status(403).json((err as Error).message)
      }
}

export const update= async (req:Request, res:Response) => {
  try {
    const { id } = req.params

    const category = await prisma.category.findUnique({
      where: { id: Number(id) },
    })
    return res.status(200).json(category)
  } catch (error) {
    return res.send((error as Error).message)
  }
};
export const show= async (req:Request, res:Response) => {
  try {
    const { id } = req.params

    const category = await prisma.category.findUnique({
      where: { id: Number(id) },
    })
    return res.status(200).json(category)
  } catch (error:any) {
    return res.send(error.messagee)
  }
};

export const destroy = async (req:Request, res:Response) => {
  try{
    const { id } = req.params
    const deletedCategory = await deleteCategoryById(Number(id))
    return res.status(204).send({message:'deleted'})
    }catch (err){
      return res.status(404).send((err as Error).message)
    }
}