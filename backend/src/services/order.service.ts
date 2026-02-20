import Order, { IOrder } from '../models/order.model';
import Product from '../models/product.model';
import { getMySQLPool } from '../config/mysqlDb';
import { AppError } from '../utils/AppError';

export class OrderService {
    private async validateUser(userId: number): Promise<void> {
        const pool = getMySQLPool();
        const [rows]: any = await pool.query('SELECT id FROM users WHERE id = ?', [userId]);
        if (rows.length === 0) {
            throw new AppError('Invalid userId', 400);
        }
    }

    async createOrder(userId: number, productIds: string[]): Promise<IOrder> {
        await this.validateUser(userId);

        const products = await Product.find({ _id: { $in: productIds } });

        if (products.length !== productIds.length) {
            throw new AppError('One or more invalid productIds', 400);
        }

        const totalAmount = products.reduce((sum, product) => sum + product.price, 0);

        const order = new Order({ userId, productIds, totalAmount });
        await order.save();
        return order;
    }

    async getOrderById(id: string): Promise<IOrder> {
        const order = await Order.findById(id);
        if (!order) {
            throw new AppError('Order not found', 404);
        }
        return order;
    }

    async getAllOrders(page: number = 1, limit: number = 10): Promise<{ data: any[], meta: any }> {
        const skip = (page - 1) * limit;
        const [orders, total] = await Promise.all([
            Order.find()
                .populate({
                    path: 'productIds',
                    model: 'Product',
                    select: 'name price'
                })
                .skip(skip)
                .limit(limit)
                .lean(),
            Order.countDocuments()
        ]);

        const formattedOrders = orders.map((order: any) => ({
            id: order._id,
            userId: order.userId,
            name: order.productIds[0]?.name || 'Unknown',
            price: order.productIds[0]?.price || 0,
            date: order.createdAt
        }));

        return {
            data: formattedOrders,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    async updateOrder(id: string, userId?: number, productIds?: string[]): Promise<IOrder> {
        const order = await Order.findById(id);
        if (!order) {
            throw new AppError('Order not found', 404);
        }

        if (userId !== undefined) {
            await this.validateUser(userId);
            order.userId = userId;
        }

        if (productIds !== undefined) {
            const products = await Product.find({ _id: { $in: productIds } });
            if (products.length !== productIds.length) {
                throw new AppError('One or more invalid productIds', 400);
            }
            order.productIds = productIds;
            order.totalAmount = products.reduce((sum, product) => sum + product.price, 0);
        }

        await order.save();
        return order;
    }

    async deleteOrder(id: string): Promise<void> {
        const order = await Order.findByIdAndDelete(id);
        if (!order) {
            throw new AppError('Order not found', 404);
        }
    }
}

export const orderService = new OrderService();
