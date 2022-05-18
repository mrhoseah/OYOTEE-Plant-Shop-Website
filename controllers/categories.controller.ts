import { PrismaClient } from '@prisma/client'
import {validateCategory} from '../helpers/validator'
const prisma = new PrismaClient()


export const listing=async (req:any, res:any) => {
  try{
    const categories = await prisma.category.findMany({
      select:{
        id:true,
        name:true,
        description:true,
        products:{
          select:{
            id:true,
            name:true
          },
        }
      }
    })
    res.status(200).json(categories)
  }catch (error:any){
    res.status(404).send(error.message)
  }
}

export const create =async (req:any, res:any) => {
  const { name, description } = req.body

        const data = { name, description };

        // check if category already exist
        // Validate if category exist in our database
        const response =validateCategory(data)
      try{
        if(response.error)
        {  
          res.status(500).send(response.error.details)
        }
        else
        {
          const takenCategory = await prisma.category.findUnique({where:{ name:response.value.name }});
        
          if (takenCategory) {
            return res.status(409).json({message:"Category already exist."});
          }
          const result = await prisma.category.create({
            data: {
              name:response.value.name,
              description:response.value.description
            },
          })
          return res.status(201).json({message:"Ok"})
        }
      }catch(err:any){
        return res.status(500).json(err.message)
      }
}

export const update= async (req:any, res:any) => {
  try {
    const { id } = req.params

    const category = await prisma.category.findUnique({
      where: { id: Number(id) },
    })
    res.status(200).json(category)
  } catch (error:any) {
    res.send(error.message)
  }
};
export const show= async (req:any, res:any) => {
  try {
    const { id } = req.params

    const category = await prisma.category.findUnique({
      where: { id: Number(id) },
    })
    res.status(200).json(category)
  } catch (error:any) {
    res.send(error.messagee)
  }
};

export const destroy = async (req:any, res:any) => {
  try{
    const { id } = req.params
    const user = await prisma.category.delete({
      where: {
        id: Number(id),
      },
    })
    res.status(204).send('Ok')
    }catch (err:any){
      res.status(404).send(err.message)
    }
}