import request from 'supertest';
import express from 'express';
import { userService } from '../../services/user.service';
import { registerUser, loginUser, getUsers } from '../user.controller';

const app = express();
app.use(express.json());
app.post('/register', registerUser);
app.post('/login', loginUser);
app.get('/users', getUsers);

jest.mock('../../services/user.service', () => ({
    userService: {
        register: jest.fn(),
        login: jest.fn(),
        getAllUsers: jest.fn(),
    }
}));

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(err.statusCode || 500).json({ message: err.message });
});

describe('User Controller', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /register', () => {
        it('should register a new user successfully (201)', async () => {
            (userService.register as jest.Mock).mockResolvedValue(undefined);

            const response = await request(app)
                .post('/register')
                .send({ username: 'testuser', password: 'password123' });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('User registered');
            expect(userService.register).toHaveBeenCalledWith('testuser', 'password123');
        });

        it('should handle registration errors (e.g. 409 duplicate)', async () => {
            const mockError = new Error('Username already exists');
            (mockError as any).statusCode = 409;
            (userService.register as jest.Mock).mockRejectedValue(mockError);

            const response = await request(app)
                .post('/register')
                .send({ username: 'existing', password: 'password123' });

            expect(response.status).toBe(409);
            expect(response.body.message).toBe('Username already exists');
        });
    });

    describe('POST /login', () => {
        it('should login a user successfully and return a token (200)', async () => {
            const mockToken = 'jwt.token.here';
            (userService.login as jest.Mock).mockResolvedValue({ token: mockToken });

            const response = await request(app)
                .post('/login')
                .send({ username: 'testuser', password: 'password123' });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Login successful');
            expect(response.body.token).toBe(mockToken);
            expect(userService.login).toHaveBeenCalledWith('testuser', 'password123');
        });

        it('should handle invalid credentials (401)', async () => {
            const mockError = new Error('Invalid credentials');
            (mockError as any).statusCode = 401;
            (userService.login as jest.Mock).mockRejectedValue(mockError);

            const response = await request(app)
                .post('/login')
                .send({ username: 'testuser', password: 'wrongpassword' });

            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Invalid credentials');
        });
    });

    describe('GET /users', () => {
        it('should return a list of users (200)', async () => {
            const mockUsers = [
                { id: 1, username: 'user1' },
                { id: 2, username: 'user2' }
            ];
            (userService.getAllUsers as jest.Mock).mockResolvedValue(mockUsers);

            const response = await request(app).get('/users');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockUsers);
            expect(userService.getAllUsers).toHaveBeenCalledTimes(1);
        });
    });
});
