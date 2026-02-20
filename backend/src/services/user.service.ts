import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getMySQLPool } from '../config/mysqlDb';
import { AppError } from '../utils/AppError';

const JWT_SECRET = process.env.JWT_SECRET || 'ytuhgjgjkgjghgjhghjgjyuou78979uhj';
const SALT_ROUNDS = 10;

export class UserService {
    async register(username: string, password: string): Promise<void> {
        const pool = getMySQLPool();
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        try {
            await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
        } catch (err: any) {
            if (err.code === 'ER_DUP_ENTRY') {
                throw new AppError('Username already exists', 409);
            }
            throw err;
        }
    }

    async login(username: string, password: string): Promise<{ token: string }> {
        const pool = getMySQLPool();
        const [rows]: any = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

        if (rows.length === 0) {
            throw new AppError('Invalid credentials', 401);
        }

        const user = rows[0];
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            throw new AppError('Invalid credentials', 401);
        }

        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        return { token };
    }

    async getAllUsers(): Promise<any[]> {
        const pool = getMySQLPool();
        const [rows]: any = await pool.query('SELECT id, username FROM users');
        return rows;
    }
}

export const userService = new UserService();
