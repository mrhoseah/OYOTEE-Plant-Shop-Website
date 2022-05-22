import Joi from  'joi'

export const validateCategory =(category:any)=>{
    const JoiSchema = Joi.object({
      
        name: Joi.string().required(),
        description: Joi.string().required()
    }).options({ abortEarly: false });
  
    return JoiSchema.validate(category)
}
export const validateReview =(review:any)=>{
    const JoiSchema = Joi.object({
      
        name: Joi.string().required(),
        description: Joi.string().required(),
        productId: Joi.number().required(),
        userId: Joi.number().required()
    }).options({ abortEarly: false });
  
    return JoiSchema.validate(review)
}


export const validateCoupon =(coupon:any)=>{
    const JoiSchema = Joi.object({    
        name: Joi.string().required(),
        code: Joi.string().min(5).max(15).required(),
        discountStatus: Joi.boolean(),
        productId: Joi.number().required(),
        discount: Joi.number().required(),
        startDate: Joi.date().required(),
        expiryDate: Joi.date().required()
    }).options({ abortEarly: false });
  
    return JoiSchema.validate(coupon)
}