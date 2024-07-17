import express from 'express';

import * as authController from '../controllers/auth.js';
import * as validators from '../validators/auth.js';

const router = express.Router();

router.get('/login', authController.getLogin);

router.post('/login', ...validators.login, authController.postLogin);

router.post('/logout', authController.postLogout);

export default router;
