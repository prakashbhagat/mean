import Product, { IProduct } from '../models/product.model';
import { AppError } from '../utils/AppError';

export class ProductService {
    async getAllProducts(page: number = 1, limit: number = 10): Promise<{ data: IProduct[], meta: any }> {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            Product.find().skip(skip).limit(limit),
            Product.countDocuments()
        ]);
        
        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    async getProductById(id: string): Promise<IProduct> {
        const product = await Product.findById(id);
        if (!product) {
            throw new AppError('Product not found', 404);
        }
        return product;
    }

    async createProduct(data: Partial<IProduct>): Promise<IProduct> {
        const product = new Product(data);
        await product.save();
        return product;
    }

    async updateProduct(id: string, data: Partial<IProduct>): Promise<IProduct> {
        const product = await Product.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        if (!product) {
            throw new AppError('Product not found', 404);
        }
        return product;
    }

    async deleteProduct(id: string): Promise<void> {
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            throw new AppError('Product not found', 404);
        }
    }
}

export const productService = new ProductService();
