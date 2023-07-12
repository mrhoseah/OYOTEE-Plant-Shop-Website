import prisma from "../utils/db";
import type {Coupon} from '@prisma/client'

export async function browseCoupons() {
    return await prisma.coupon.findMany({
        select: {
            id: true,
            name: true,
            code: true,
            discount: true,
            startDate: true,
            expiryDate: true,
            _count: {
                select: {products: true}
            }
        }
    })
}

export async function getCouponById(couponId: Coupon["id"]) {
    return await prisma.coupon.findUnique({
        where: {id: couponId}
    })
}
export async function getCouponByCode(code: Coupon["code"]) {
    return await prisma.coupon.findFirst({where: {code}})
}

export async function createCoupon({
                                       name,
                                       discount,
                                       startDate,
                                       expiryDate,
                                       code
                                   }: Pick<Coupon, "name" | "discount" | "startDate" | "expiryDate" | "code">) {
    return prisma.coupon.create({
        data: {
            name,
            discount,
            startDate,
            expiryDate,
            code
        }
    })
}
export async function updateCoupon(couponId:Coupon["id"],name:Coupon["name"], discount:Coupon["discount"],startDate:Coupon["startDate"],expiryDate:Coupon["expiryDate"],code:Coupon["code"]){
    return await prisma.coupon.update({
        where: {
            id:couponId
        },
        data: {
            name,
            code,
            discount,
        },
    })
}
export async function deleteCoupon(couponId: Coupon["id"]) {
    return await prisma.coupon.delete({
        where: {
            id:couponId
        }
    })
}
