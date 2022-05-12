import { Prisma, PrismaClient } from '@prisma/client'


const prisma = new PrismaClient()

export const list=async (req:any, res:any) => {
  try{
    const users = await prisma.user.findMany()
    res.json(users)
    }catch (err:any){
      res.status(401).send(err.message)
    }
}

export const likes = async (req:any,res:any) => {
  try{
    const { id } = req.params
    const user = await prisma.profile.delete({
      where: {
        id: Number(id),
      },
    })
    res.status(200).send(user)
    }catch (err:any){
      res.status(404).send(err.message)
    }
}
export const ratings = async (req:any,res:any) => {
  try{
    const { id } = req.params
    const user = await prisma.profile.delete({
      where: {
        id: Number(id),
      },
    })
    res.status(200).send(user)
    }catch (err:any){
      res.status(404).send(err.meta.cause)
    }
}
export const profile = async (req:any,res:any) => {
  try{
    const { id } = req.params
    const user = await prisma.profile.delete({
      where: {
        id: Number(id),
      },
    })
    res.status(200).send(user)
    }catch (err:any){
      res.status(404).send(err.meta.cause)
    }
}
export const update = async (req:any,res:any) => {
  try{
    const { id } = req.params
    const user = await prisma.profile.delete({
      where: {
        id: Number(id),
      },
    })
    res.status(200).send(user)
    }catch (err:any){
      res.status(404).send(err.meta.cause)
    }
}
export const updateProfile = async (req:any,res:any) => {
  try{
    const { id } = req.params
    const user = await prisma.profile.delete({
      where: {
        id: Number(id),
      },
    })
    res.status(200).send(user)
    }catch (err:any){
      res.status(404).send(err.meta.cause)
    }
}
export const destroy = async (req:any,res:any) => {
  try{
    const { id } = req.params
    const user = await prisma.user.delete({
      where: {
        id: Number(id),
      },
    })
    res.status(204).send({'message':'Ok'})
    }catch (err:any){
      res.status(404).send(err.meta.cause)
    }
}