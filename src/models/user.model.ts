import type { VerificationToken, Password, User } from "@prisma/client";
import prisma from "../utils/db";
import crypto from "crypto";
import * as bcrypt from "bcryptjs";
export const getTokenByVerificationToken = async (
  token: VerificationToken["token"]
) => {
  return await prisma.verificationToken.findFirst({
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
export const getPasswordByUserId = async (userId: User["id"])=> {
  const userPassword= await prisma.password.findFirst({
    where: {
      userId,
    }
  });
  return userPassword?.hash;
};
export const getTokenByUserId = async (userId: User["id"]) => {
  return await prisma.verificationToken.findFirst({
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
  token: VerificationToken["token"]
) => {
  return await prisma.verificationToken.create({
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
  password: string
) => {
  // Save User to Database
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password:{
        create: {
          hash: bcrypt.hashSync(password, 10)
        }
      },
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
export const updateUserById=async(userId:User["id"],password:string)=>{
    return  await prisma.password.update({
        where:{
          id:userId
        },
        data:{
          hash: bcrypt.hashSync(password,10)
        }
      });
}
export const deleteTokenAfterUse=async(tokenId:VerificationToken["id"])=>{
    return  await prisma.verificationToken.delete({
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