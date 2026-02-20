import express from 'express';
import { registerUser, loginUser, getUsers } from '../controllers/user.controller';
import { protect } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { registerSchema, loginSchema } from '../validations/user.validation';

const router = express.Router();

router.post('/users/register', validateRequest(registerSchema), registerUser);
router.post('/users/login', validateRequest(loginSchema), loginUser);
router.get('/users', protect, getUsers);

export default router;