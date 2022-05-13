import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()


export const listing=async (req:any, res:any) => {
  try{
    const categories = await prisma.category.findMany()
    res.status(200).json(categories)
  }catch (error:any){
    res.status(404).send(error.message)
  }
}
export const create =async (req:any, res:any) => {
    try{  
      const { name, description } = req.body
        // check if category already exist
        // Validate if category exist in our database
        const takenCategory = await prisma.category.findUnique({where:{ name }});
    
        if (takenCategory) {
          throw new Error("Category already exist.");
        }
      const result = await prisma.category.create({
        data: {
          name,
          description
        },
      })
      res.status(201).json({"message":"Ok"})
    }catch (error:any){
      res.send(error.message)
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