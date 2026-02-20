import { Request, Response, NextFunction } from 'express';
import { orderService } from '../services/order.service';

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, productIds } = req.body;
    const order = await orderService.createOrder(userId, productIds);
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await orderService.getOrderById(req.params.id as string);
    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
};

export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await orderService.getAllOrders(page, limit);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const updateOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, productIds } = req.body;
    const order = await orderService.updateOrder(req.params.id as string, userId, productIds);
    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
};

export const deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await orderService.deleteOrder(req.params.id as string);
    res.status(200).json({ message: 'Order deleted' });
  } catch (err) {
    next(err);
  }
};