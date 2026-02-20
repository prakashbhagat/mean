import express from 'express';
import { createProduct, getProducts, getProductById, updateProduct, deleteProduct } from '../controllers/product.controller';
import { protect } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { createProductSchema, updateProductSchema } from '../validations/product.validation';

const router = express.Router();

router.post('/products', protect, validateRequest(createProductSchema), createProduct);
router.get('/products', protect, getProducts);
router.get('/products/:id', protect, getProductById);
router.put('/products/:id', protect, validateRequest(updateProductSchema), updateProduct);
router.delete('/products/:id', protect, deleteProduct);

export default router;