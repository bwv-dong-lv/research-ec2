/**
 * Login Router
 */
import {Router} from 'express';
import * as authController from '../controllers/auth.controller';

const authRouter = Router();

authRouter.get('/login', authController.renderLogin);
authRouter.post('/login', authController.login);
authRouter.get('/logout', authController.logout);

export default authRouter;
