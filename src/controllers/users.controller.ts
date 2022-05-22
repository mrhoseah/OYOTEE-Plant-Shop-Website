import { Prisma, PrismaClient } from '@prisma/client'
import Joi from 'joi'


const prisma = new PrismaClient()

export const list=async (req:any, res:any) => {
  try{
    const users = await prisma.user.findMany(
{      select:{
        id:true,
        name:true,
        email:true,
        profile:{
          select:{
            avatar:true
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
export const updateUser = async (req:any,res:any) => {
  const { id } = req.params
  const {name,email,bio,avatar} = req.body
  const options = {
    errors: {
      wrap: {
        label: ''
      }
    }
  };
  const JoiSchema = Joi.object().keys({
      name: Joi.string(),
      email: Joi.string().email().min(5),
      bio: Joi.string().min(5),
      avatar: Joi.string(),
  }).options({ abortEarly: false });
  const data= JoiSchema.validate({name,email,avatar,bio},options)
  try{
    if(data.error){
      return res.status(400).json(data.error.details);
    }
    const user = await prisma.user.findUnique({
      where: {
        id:Number(id),
      },
    });
    if(!user){
      throw new Error(`User with ID ${id} does not exist in the database`)
    }

    const updatedUser = await prisma.user.update({
      where:{
        id:Number(id),
      },
      data:{
        name,
        email
      }
    })

    return res.status(201).send(updatedUser);
    }catch (err:any){
      return res.status(404).send({error:err.message})
    }
}
export const updateProfile = async (req:any,res:any) => {
  const { id } = req.params
  const {bio,avatar} = req.body
  const options = {
    errors: {
      wrap: {
        label: ''
      }
    }
  };
  const JoiSchema = Joi.object().keys({
      bio: Joi.string().min(5),
      avatar: Joi.string(),
  }).options({ abortEarly: false });
  const data= JoiSchema.validate({avatar,bio},options)
  try{
    if(data.error){
      return res.status(400).json(data.error.details);
    }
    const profile = await prisma.profile.findUnique({
      where: {
        userId:Number(id),
      },
    });
    if(!profile){
      throw new Error(`Profile with ID ${id} does not exist in the database`)
    }

    await prisma.profile.update({
      where:{
        id:Number(id),
      },
      data:{
            userId:Number(id),
            bio,
            avatar: req.file.path
      }
    })

    return res.status(201).send({message:"success"});
    }catch (err:any){
      return res.status(404).send({error:err.message})
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
      return res.status(404).send({error:err.message})
    }
}