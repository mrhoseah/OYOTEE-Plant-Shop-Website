import { Prisma, PrismaClient } from '@prisma/client'
import { Router } from 'express';

const prisma = new PrismaClient()

const usershRouter = Router()

usershRouter.get('/users', async (req, res) => {
  try{
    const users = await prisma.user.findMany()
    res.json(users)
    }catch (err){
      res.status(401).send(err)
    }
})

usershRouter.delete(`/users/:id`, async (req, res) => {
  try{
    const { id } = req.params
    const user = await prisma.user.delete({
      where: {
        id: Number(id),
      },
    })
    res.status(204).send('Ok')
    }catch (err:any){
      res.status(404).send(err.meta.cause)
    }
})

usershRouter.get('/users/:id/drafts', async (req, res) => {
  try{
    const { id } = req.params

    const drafts = await prisma.user
      .findUnique({
        where: {
          id: Number(id),
        },
      })
    .products({
      where: { published: false },
    })

  res.json(drafts)
  }catch (err){
    res.status(401).send(err)
  }
})
  
 export default usershRouter;