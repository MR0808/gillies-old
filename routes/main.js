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

router.get(
    '/vote/:meetingId',
    (res, req, next) => isAuth(res, req, next, 'user'),
    mainController.getVote
);

router.post(
    '/vote',
    (res, req, next) => isAuth(res, req, next, 'user'),
    mainController.postVote
);

export default router;
