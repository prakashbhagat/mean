import { OrderService } from '../../services/order.service';
import Order from '../../models/order.model';
import Product from '../../models/product.model';
import * as mysqlDb from '../../config/mysqlDb';
import { AppError } from '../../utils/AppError';

jest.mock('../../models/order.model');
jest.mock('../../models/product.model');
jest.mock('../../config/mysqlDb');

describe('Order Service', () => {
    let service: OrderService;
    let mockPool: any;

    beforeEach(() => {
        service = new OrderService();
        mockPool = { query: jest.fn() };
        (mysqlDb.getMySQLPool as jest.Mock).mockReturnValue(mockPool);
        jest.clearAllMocks();
    });

    describe('createOrder', () => {
        it('should create an order successfully', async () => {

            mockPool.query.mockResolvedValue([[{ id: 1 }]]);

            const mockProducts = [{ _id: 'p1', price: 10 }, { _id: 'p2', price: 20 }];
            (Product.find as jest.Mock).mockResolvedValue(mockProducts);

            const mockSave = jest.fn().mockResolvedValue(true);
            (Order as unknown as jest.Mock).mockImplementation(() => ({
                userId: 1,
                productIds: ['p1', 'p2'],
                totalAmount: 30,
                save: mockSave
            }));

            const result = await service.createOrder(1, ['p1', 'p2']);

            expect(mockPool.query).toHaveBeenCalledWith('SELECT id FROM users WHERE id = ?', [1]);
            expect(Product.find).toHaveBeenCalledWith({ _id: { $in: ['p1', 'p2'] } });
            expect(mockSave).toHaveBeenCalled();
            expect(result.userId).toBe(1);
            expect(result.totalAmount).toBe(30);
        });

        it('should throw error if user is invalid', async () => {

            mockPool.query.mockResolvedValue([[]]);

            await expect(service.createOrder(999, ['p1'])).rejects.toThrow(AppError);
            await expect(service.createOrder(999, ['p1'])).rejects.toThrow('Invalid userId');
        });

        it('should throw error if one or more productIds are invalid', async () => {

            mockPool.query.mockResolvedValue([[{ id: 1 }]]);

            (Product.find as jest.Mock).mockResolvedValue([{ _id: 'p1', price: 10 }]);

            await expect(service.createOrder(1, ['p1', 'p2'])).rejects.toThrow(AppError);
            await expect(service.createOrder(1, ['p1', 'p2'])).rejects.toThrow('One or more invalid productIds');
        });
    });

    describe('getAllOrders', () => {
        it('should return paginated orders with formatted output', async () => {
            const mockOrders = [{
                _id: 'o1',
                userId: 1,
                productIds: [{ name: 'Product A', price: 50 }],
                createdAt: '2026-01-01'
            }];

            const mockLean = jest.fn().mockResolvedValue(mockOrders);
            const mockLimit = jest.fn().mockReturnValue({ lean: mockLean });
            const mockSkip = jest.fn().mockReturnValue({ limit: mockLimit });
            const mockPopulate = jest.fn().mockReturnValue({ skip: mockSkip });

            (Order.find as jest.Mock).mockReturnValue({ populate: mockPopulate });
            (Order.countDocuments as jest.Mock).mockResolvedValue(1);

            const result = await service.getAllOrders(1, 10);

            expect(Order.find).toHaveBeenCalled();
            expect(Order.countDocuments).toHaveBeenCalled();
            expect(result.data).toHaveLength(1);
            expect(result.data[0].id).toBe('o1');
            expect(result.data[0].name).toBe('Product A');
            expect(result.data[0].price).toBe(50);
            expect(result.meta.total).toBe(1);
        });
    });
});
