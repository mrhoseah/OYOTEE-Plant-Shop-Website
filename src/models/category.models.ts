import type{ Category } from "@prisma/client";
import prisma from "../utils/db";

export async function getCategoryByName(name:Category["name"]){
    return await prisma.category.findUnique({
        where:{ name}
        })
}
export async function createCategory(name:Category["name"],description:Category["description"]){
    return await prisma.category.create({
        data: {
          name,
          description
        },
      })
}
export async function deleteCategoryById(categoryId:Category["id"]){
    await prisma.category.delete({
        where: {
          id: categoryId,
        },
    })
}