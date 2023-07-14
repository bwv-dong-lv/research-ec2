/**
 * Group Router
 */
import {Router} from 'express';
import * as groupController from '../controllers/group.controller';
import {noCache} from '../middlewares/noCache';
import {checkUser} from '../middlewares/checkAuth';
import multer from 'multer';
import {checkAuthGroup} from '../middlewares/checkAuthGroup';

const groupRouter = Router();

groupRouter.get(
  '/group',
  [checkAuthGroup, noCache],
  groupController.renderGroupList,
);

groupRouter.post(
  '/group',
  [checkAuthGroup, noCache],
  groupController.postGroupList,
);

const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    cb(null, './public/uploads');
  },
  filename: (req: any, file: any, cb: any) => {
    cb(null, file.originalname);
  },
});

const uploads = multer({
  storage: storage,
});

groupRouter.post(
  '/upload',
  [checkAuthGroup, uploads.single('csvFile')],
  groupController.importCSV,
);

export default groupRouter;
