import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()


export const listing=async (req:any, res:any) => {
  try{

    const categories = await prisma.category.findMany()
    res.json(categories)
  }catch (error:any){
    res.status(401).send({"message":error.meta.cuase})
  }
}
export const create =async (req:any, res:any) => {
    try{  
      const { name, description } = req.body
        // check if category already exist
        // Validate if category exist in our database
        const takenCategory = await prisma.category.findUnique({where:{ name }});
    
        if (takenCategory) {
          return res.status(409).send("Category already exist.");
        }
      const result = await prisma.category.create({
        data: {
          name,
          description
        },
      })
      res.status(201).send(result)
    }catch (error:any){
      res.status(409).send({"message":error.meta.cuase})
    }
}

export const update= async (req:any, res:any) => {
  try {
    const { id } = req.params

    const category = await prisma.category.findUnique({
      where: { id: Number(id) },
    })
    res.json(category)
  } catch (error:any) {
    res.status(404).send({"message":error.meta.cuase})
  }
};
export const show= async (req:any, res:any) => {
  try {
    const { id } = req.params

    const category = await prisma.category.findUnique({
      where: { id: Number(id) },
    })
    res.json(category)
  } catch (error:any) {
    res.status(404).send({"message":error.meta.cuase})
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
      res.status(404).send(err.meta.cause)
    }
}