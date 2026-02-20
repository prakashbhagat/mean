import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service';

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;
    await userService.register(username, password);
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;
    const result = await userService.login(username, password);
    res.status(200).json({ message: 'Login successful', token: result.token });
  } catch (err) {
    next(err);
  }
};

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};