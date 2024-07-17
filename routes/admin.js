import express from 'express';

import * as adminController from '../controllers/admin.js';
import * as validators from '../validators/admin.js';
import isAuth from '../middleware/is-auth.js';

const router = express.Router();

router.get(
    '/',
    (res, req, next) => isAuth(res, req, next, 'admin'),
    adminController.getIndex
);

router.get(
    '/users',
    (res, req, next) => isAuth(res, req, next, 'admin'),
    adminController.getUsers
);

router.get(
    '/users/create',
    (res, req, next) => isAuth(res, req, next, 'admin'),
    adminController.getCreateUser
);

router.post(
    '/users/create',
    (res, req, next) => isAuth(res, req, next, 'admin'),
    ...validators.createUser,
    adminController.postCreateUser
);

router.get(
    '/users/edit',
    (res, req, next) => isAuth(res, req, next, 'admin'),
    adminController.getEditUser
);

router.post(
    '/users/edit',
    (res, req, next) => isAuth(res, req, next, 'admin'),
    ...validators.editUser,
    adminController.postEditUser
);

router.get(
    '/meetings',
    (res, req, next) => isAuth(res, req, next, 'admin'),
    adminController.getMeetings
);

router.get(
    '/meetings/create',
    (res, req, next) => isAuth(res, req, next, 'admin'),
    adminController.getCreateMeeting
);

router.post(
    '/meetings/create',
    (res, req, next) => isAuth(res, req, next, 'admin'),
    ...validators.meeting,
    adminController.postCreateMeeting
);

router.get(
    '/meetings/edit',
    (res, req, next) => isAuth(res, req, next, 'admin'),
    adminController.getEditMeeting
);

router.post(
    '/meetings/edit',
    (res, req, next) => isAuth(res, req, next, 'admin'),
    // ...validators.meeting,
    adminController.postEditMeeting
);

router.get(
    '/meetings/close',
    (res, req, next) => isAuth(res, req, next, 'admin'),
    adminController.getCloseMeeting
);

export default router;
