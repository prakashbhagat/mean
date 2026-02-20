import Joi from 'joi';

export const createProductSchema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().min(0).required(),
    description: Joi.string().allow('', null),
});

export const updateProductSchema = Joi.object({
    name: Joi.string(),
    price: Joi.number().min(0),
    description: Joi.string().allow('', null),
});
