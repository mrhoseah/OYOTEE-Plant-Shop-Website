import { Router } from 'express';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const categoriesRouter = Router()

categoriesRouter.get('/', async (req, res) => {
  try{

    const categories = await prisma.category.findMany()
    res.json(categories)
  }catch (err:any){
    res.status(401).send(err)
  }
})
categoriesRouter.post(`/`, async (req, res) => {
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
      res.json(result)
    }catch (err:any){
      res.status(409).send(err)
    }
})
categoriesRouter.get(`/:id`, async (req, res) => {
  const { id } = req.params

  const category = await prisma.category.findUnique({
    where: { id: Number(id) },
  })
  res.json(category)
})

categoriesRouter.delete(`/:id`, async (req, res) => {
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
})

export default categoriesRouter;