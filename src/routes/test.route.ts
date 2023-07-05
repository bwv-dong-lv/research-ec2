/**
 * User Router
 */
import {Router} from 'express';
import * as testController from '../controllers/test.controller';

const testRouter = Router();

testRouter.get('/test', testController.test);

export default testRouter;
