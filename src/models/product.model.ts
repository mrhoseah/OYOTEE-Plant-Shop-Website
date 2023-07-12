import prisma from "../utils/db";
import type {Category,Product,User,Review} from "@prisma/client";
export async function browseProducts() {
    return await prisma.product.findMany({
        select:{
            id:true,
            name:true,
            description:true,
            price:true,
            categoryId:true,
            rating:true,
            reviews:{
                select:{
                    rateValue:true
                }
            },
            image_url:true,
            _count:{
                select:{
                    reviews:true,
                    likes:true,

                }
            }
        }
    })
}

export async function createProduct({name, description, price, quantity, image_url,categoryId,authorId}:Pick<Product, "name" | "description" | "price" | "quantity" | "image_url" > & {categoryId:Category["id"], authorId:User["id"]}){
    return await prisma.product.create({
        data: {
            name,
            description,
            price,
            quantity,
            image_url,
            category: { connect: { id: Number(categoryId) } },
            author: { connect: { id: Number(authorId) } }
        }
    })
}
export async function createProductReview(userId:User["id"],productId:Product["id"],content:Review["content"],rating:Review["rateValue"]){
    return await prisma.review.create({
        data:{
            reviewedBy:{
                connect:{id:userId}
            },
            product:{
                connect:{id:productId}
            },
            content,
            rateValue:rating
        }
    })
}
export async  function getProductById(productId:Product["id"]) {
    return await prisma.product.findUnique({
        where: { id:productId },
        select:{
            id:true,
            name:true,
            description:true,
            price:true,
            quantity:true,
            published: true,
            image_url:true,
            _count:{
                select:{
                    reviews:true,
                    likes:true
                }
            }
        }
    })
}
export async  function getProductLikesByProductId(productId:Product["id"]) {
    return await prisma.product.findUnique({
        where:{id:productId},
        select:{
            id:true,
            _count:{
                select:{
                    likes:true
                }
            }
        }
    })
}export async  function deleteProductLikesByProductIdByUserId(productId:Product["id"],userId:User["id"]) {
    return await  prisma.like.delete({
        where: {
            likedById_productId:{
                likedById:userId,
                productId
            }
        }
    })
}
export async  function getProductReviewsByProductId(productId:Product["id"]) {
    return await prisma.review.aggregate({
        where:{
            productId
        }
    })
}
export async  function createProductLikesByProductIdByUserId(productId:Product["id"],userId:User["id"]) {
    return await prisma.like.create({
        data: {
            likedBy:{
                connect:{id:userId}
            },
            product:{
                connect:{id:productId}
            }
        },
    })
}
export async function updateProduct({productId,name, description, price, quantity, image_url,categoryId}:Pick<Product,"name" | "description" | "price" | "quantity" | "image_url" > & {categoryId:Category["id"],productId:Product["id"]}){
    return await prisma.product.update({
        where: { id:productId},
        data: { description,name,image_url,price:Number(price),quantity,category:{
            connect:{
                id:categoryId
            }
    }},
    })

}
export async function publishProduct(id:Product["id"]) {
    const  productData = await getProductById(id);
    return await prisma.product.update({
        where: { id: Number(id) || undefined },
        data: { published: !productData?.published },
    })
}