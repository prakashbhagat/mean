import Joi from 'joi';

export const createOrderSchema = Joi.object({
    userId: Joi.number().required(),
    productIds: Joi.array().items(Joi.string().required()).min(1).required(),
    totalAmount: Joi.number().optional(),
});

export const updateOrderSchema = Joi.object({
    userId: Joi.number(),
    productIds: Joi.array().items(Joi.string()),
    totalAmount: Joi.number().optional(),
});
