import {PrismaClient} from '@prisma/client'
import {validateCoupon} from '../utils/validator'
import {Request, Response} from "express";
import {
    browseCoupons,
    createCoupon,
    deleteCoupon,
    getCouponByCode,
    getCouponById,
    updateCoupon
} from "../models/coupon.model";

const prisma = new PrismaClient()


export const listing = async (req: Request, res: Response) => {
    try {
        const coupons = await browseCoupons();
        return res.status(200).json({coupons})
    } catch (error) {
        return res.status(404).json({message: (error as Error).message})
    }
}
export const show = async (req: Request, res: Response) => {
    const {id} = req.body
    try {

        const data = {id};

        // check if coupon exist
        // Validate if coupon exist in our database
        const response = validateCoupon(data)
        if (response.error) {
            return res.status(403).send(response.error.details)
        }
        const couponFound = await getCouponById(id);

        if (!couponFound) {
            throw new Error(`Coupon with ID ${id} does not exist`);
        }
        return res.status(200).json(coupon)
    } catch (error) {
        return res.status(404).json({message: (error as Error).message})
    }
}
export const create = async (req: Request, res: Response) => {
    const {name, discount, startDate, expiryDate, code} = req.body
    try {
        const data = {name, discount, startDate, expiryDate, code};

        // check if coupon already exist
        // Validate if coupon exist in our database
        const response = validateCoupon(data)
        if (response.error) {
            return res.status(403).send(response.error.details)
        }
        const isCouponCreated = await getCouponByCode(code);

        if (isCouponCreated) {
            throw new Error("Coupon already exist.");
        }

        await createCoupon({
            name,
            discount,
            startDate,
            expiryDate,
            code
        })
        return res.status(201).json({message: "Coupon created"})
    } catch (error) {
        return res.status(400).json({message: (error as Error).message})
    }
}
export const update = async (req: Request, res: Response) => {
    const {id, name, discount, startDate, expiryDate, code} = req.body
    try {
        const data = {id, name, discount, startDate, expiryDate, code};

        // check if coupon already exist
        // Validate if coupon exist in our database
        const response = validateCoupon(data)
        if (response.error) {
            return res.status(403).send(response.error.details)
        }
        const coupon = await getCouponById(id);

        if (!coupon) {
            throw new Error(`Coupon with ID ${id} does not exist`);
        }
        await updateCoupon(id, name,discount,code,startDate,expiryDate);
        return res.status(201).json({message: "Coupon updated"})
    } catch (error) {
        return res.status(400).json({message: (error as Error).message})
    }
}
export const destroy = async (req: Request, res: Response) => {
    const {id} = req.body
    try {
        const data = {id};

        // check if coupon already exist
        // Validate if coupon exist in our database
        const response = validateCoupon(data)
        if (response.error) {
            return res.status(403).send(response.error.details)
        }
        const coupon = await getCouponById(id);

        if (!coupon) {
            throw new Error(`Coupon with ID ${id} does not exist`);
        }
        await deleteCoupon((id))
        return res.status(204).json({message: "Coupon deleted"})
    } catch (error) {
        return res.status(400).json({message: (error as Error).message})
    }
}
