/**
 * Group Router
 */
import {Router} from 'express';
import * as groupController from '../controllers/group.controller';
import {noCache} from '../middlewares/noCache';
import {checkUser} from '../middlewares/checkAuth';

const groupRouter = Router();

groupRouter.get(
  '/group',
  [checkUser, noCache],
  groupController.renderGroupList,
);

export default groupRouter;
