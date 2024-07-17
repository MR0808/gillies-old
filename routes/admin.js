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

export default router;
