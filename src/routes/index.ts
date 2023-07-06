/**
 * Main Router
 */
import {Router} from 'express';
import auth from '../middlewares/authentication';
import sessionMiddleWare from '../middlewares/session';
import userMiddleware from '../middlewares/user';
import authRouter from './auth.route';
import viewHelper from '../middlewares/viewHelper';
import userRouter from './user.route';
import groupRouter from './group.route';
import {checkUser} from '../middlewares/checkAuth';
import testRouter from './test.route';

const router = Router();

// router.use(sessionMiddleWare);
// router.use(userMiddleware);
router.use('/', authRouter);
router.use('/', [checkUser], userRouter);
router.use('/', [checkUser], groupRouter);
router.use('/', testRouter);
// router.use(auth);
// router.use(viewHelper);

// router.get('/', (req, res) => {
//   res.render('index');
// });

export default router;
