import Joi from  'joi'

export const validateCategory =(category:any)=>{
    const JoiSchema = Joi.object({
      
        name: Joi.string().required(),
        description: Joi.string().required()
    }).options({ abortEarly: false });
  
    return JoiSchema.validate(category)
}
