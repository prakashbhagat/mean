import { Request, Response, NextFunction } from 'express';
import Joi, { Schema } from 'joi';
import { AppError } from '../utils/AppError';

export const validateRequest = (schema: Schema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error, value } = schema.validate(req.body, { stripUnknown: true });
        if (error) {
            const message = error.details.map((detail) => detail.message).join(', ');
            return next(new AppError(message, 400));
        }
        req.body = value;
        next();
    };
};
