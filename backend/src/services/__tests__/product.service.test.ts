import { ProductService } from '../../services/product.service';
import Product from '../../models/product.model';
import { AppError } from '../../utils/AppError';

jest.mock('../../models/product.model');

describe('Product Service', () => {
    let service: ProductService;

    beforeEach(() => {
        service = new ProductService();
        jest.clearAllMocks();
    });

    describe('getAllProducts', () => {
        it('should return paginated products successfully', async () => {
            const mockProducts = [
                { _id: '1', name: 'Product 1', price: 10 },
                { _id: '2', name: 'Product 2', price: 20 }
            ];

            const mockSkip = jest.fn().mockReturnThis();
            const mockLimit = jest.fn().mockResolvedValue(mockProducts);

            (Product.find as jest.Mock).mockReturnValue({
                skip: mockSkip,
                limit: mockLimit,
            });
            (Product.countDocuments as jest.Mock).mockResolvedValue(2);

            const result = await service.getAllProducts(1, 10);

            expect(Product.find).toHaveBeenCalled();
            expect(Product.countDocuments).toHaveBeenCalled();
            expect(result.data).toEqual(mockProducts);
            expect(result.meta.total).toBe(2);
            expect(result.meta.page).toBe(1);
            expect(result.meta.limit).toBe(10);
            expect(result.meta.totalPages).toBe(1);
        });
    });

    describe('getProductById', () => {
        it('should return a product by ID', async () => {
            const mockProduct = { _id: '1', name: 'Product 1', price: 10 };
            (Product.findById as jest.Mock).mockResolvedValue(mockProduct);

            const result = await service.getProductById('1');

            expect(Product.findById).toHaveBeenCalledWith('1');
            expect(result).toEqual(mockProduct);
        });

        it('should throw AppError if product not found', async () => {
            (Product.findById as jest.Mock).mockResolvedValue(null);

            await expect(service.getProductById('invalid')).rejects.toThrow(AppError);
            await expect(service.getProductById('invalid')).rejects.toThrow('Product not found');
        });
    });

    describe('createProduct', () => {
        it('should create and save a new product', async () => {
            const mockProductData = { name: 'New Product', price: 50 };
            const mockSave = jest.fn().mockResolvedValue(true);

            (Product as unknown as jest.Mock).mockImplementation(() => ({
                ...mockProductData,
                save: mockSave
            }));

            const result = await service.createProduct(mockProductData);

            expect(mockSave).toHaveBeenCalled();
            expect(result.name).toBe('New Product');
            expect(result.price).toBe(50);
        });
    });

    describe('updateProduct', () => {
        it('should update a product successfully', async () => {
            const mockProductData = { name: 'Updated Product' };
            const mockUpdatedProduct = { _id: '1', name: 'Updated Product', price: 10 };

            (Product.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUpdatedProduct);

            const result = await service.updateProduct('1', mockProductData);

            expect(Product.findByIdAndUpdate).toHaveBeenCalledWith('1', mockProductData, { new: true, runValidators: true });
            expect(result).toEqual(mockUpdatedProduct);
        });

        it('should throw AppError if updating non-existent product', async () => {
            (Product.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

            await expect(service.updateProduct('invalid', {})).rejects.toThrow(AppError);
        });
    });

    describe('deleteProduct', () => {
        it('should delete a product successfully', async () => {
            const mockProduct = { _id: '1', name: 'Delete Me' };
            (Product.findByIdAndDelete as jest.Mock).mockResolvedValue(mockProduct);

            await service.deleteProduct('1');

            expect(Product.findByIdAndDelete).toHaveBeenCalledWith('1');
        });

        it('should throw AppError if deleting non-existent product', async () => {
            (Product.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

            await expect(service.deleteProduct('invalid')).rejects.toThrow(AppError);
        });
    });
});
