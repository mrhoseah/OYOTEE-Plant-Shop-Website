import { Prisma, PrismaClient } from '@prisma/client'


const prisma = new PrismaClient()

export const list=async (req:any, res:any) => {
  try{
    const users = await prisma.user.findMany(
{      select:{
        id:true,
        name:true,
        email:true,
        avatar:true,
        products:{
          select:{
            id:true,
            name:true,
            description:true,
            image:true,
            _count:{
              select:{ratings:true,likes:true}
            }
          }
        }
      }
    }
    )
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
export const deleteProfile = async (req:any,res:any) => {
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
    const {name,email} = req.body
    const user = await prisma.profile.findUnique({
      where: {
        id: Number(id),
      },
    });
    if(!user){
      throw new Error(`User with ID ${id} does not exist in the database`)
    }
    const updatedUser = await prisma.user.update({
      where:{
        id
      },
      data:{
        name,
        email,
        avatar:req.file.path,
      }
    })

    return res.status(201).send({
        "id": updatedUser.id ,
        "email": updatedUser.email ,
        "name": updatedUser.name,
        "avatar": updatedUser.avatar
    });
    }catch (err:any){
      return res.status(404).send({message:err.message})
    }
}
export const destroy = async (req:any,res:any) => {
  try{
    const { id } = req.params
    const user = await prisma.profile.findUnique({
      where: {
        id: Number(id),
      },
    });
    if(!user){
      throw new Error(`User with ID ${id} does not exist in the database`)
    }
    await prisma.user.delete({
      where: {
        id: Number(id),
      },
    })
    return res.status(204).send({'message':'Ok'})
    }catch (err:any){
      return res.status(404).send({message:err.message})
    }
}