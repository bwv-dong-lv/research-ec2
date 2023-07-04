/**
 * User Router
 */
import {Router} from 'express';
import * as userController from '../controllers/user.controller';
import {noCache} from '../middlewares/noCache';
import {checkUser} from '../middlewares/checkAuth';

const userRouter = Router();

userRouter.get('/user', [checkUser, noCache], userController.renderUserList);

export default userRouter;
