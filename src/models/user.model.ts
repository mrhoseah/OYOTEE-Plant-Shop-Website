import type { PasswordToken, Product, User } from "@prisma/client";
import prisma from "../utils/db";
import crypto from "crypto";
import * as bcrypt from "bcryptjs";
export const getTokenByPasswordToken = async (
  token: PasswordToken["token"]
) => {
  return await prisma.passwordToken.findFirst({
    where: {
      token,
    },
    select: {
      id: true,
      token: true,
      userId: true,
    },
  });
};
export const getTokenByUserId = async (userId: User["id"]) => {
  return await prisma.passwordToken.findFirst({
    where: {
      userId,
    },
    select: {
      id: true,
      token: true,
      userId: true,
    },
  });
};
export const createToken = async (
  user: User,
  token: PasswordToken["token"]
) => {
  return await prisma.passwordToken.create({
    data: {
      user: { connect: { id: user.id } },
      token: crypto.randomBytes(32).toString("hex"),
    },
  });
};
export const getUserByEmail = async (email: User["email"]) => {
  return prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      password: true,
      name: true,
      email: true,
      profile: {
        select: {
          avatar: true,
        },
      },
    },
  });
};
export const createUser = async (
  name: User["name"],
  email: User["email"],
  password: User["password"]
) => {
  // Save User to Database
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: bcrypt.hashSync(password, 10),
      profile: {
        create: {
          bio: `${name}'s bio`,
        },
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
};
export const createAccessToken = async (
  user: User,
  token:string
) => {
  return await prisma.accessToken.create({
    data:{
      user:{
        connect:{
          id:user.id
        }
      },
      token
    }, select:{
      token:true
    }
  })
};
export const updateUserById=async(userId:User["id"],password:User["password"])=>{
    return  await prisma.user.update({
        where:{
          id:userId
        },
        data:{
          password: bcrypt.hashSync(password,10)
        }
      });
}
export const deleteTokenAfterUse=async(tokenId:PasswordToken["id"])=>{
    return  await prisma.passwordToken.delete({
        where:{
          id:tokenId
        }
      })
}

export const deleteAccessTokens=async(userId:User["id"])=>{
    return await prisma.accessToken.deleteMany({
      where:{
        userId
      }
    })
  }