import express from 'express';

import * as mainController from '../controllers/main.js';
import * as validators from '../validators/admin.js';
import isAuth from '../middleware/is-auth.js';

const router = express.Router();

router.get(
    '/',
    (res, req, next) => isAuth(res, req, next, 'user'),
    mainController.getIndex
);

export default router;
