import { body } from 'express-validator';

import User from '../models/user.js';

export const login = [
    body('username')
        .exists({ checkFalsy: true })
        .withMessage('Please enter an email/username'),
    body('password')
        .exists({ checkFalsy: true })
        .withMessage('You must type a password')
        .trim()
];

export const create = [
    body('username')
        .exists({ checkFalsy: true })
        .withMessage('Please enter a username')
        .custom((value, { req }) => {
            return User.findOne({ username: value }).then((userDoc) => {
                if (userDoc) {
                    return Promise.reject(
                        'Username exists already, please try a different one'
                    );
                }
            });
        }),
    body(
        'password',
        'The password must be at least 8 characters long, contain one uppercase, one lowercase, one number and a symbol'
    )
        .isLength({ min: 4 })
        .trim(),
    body('firstName')
        .exists({ checkFalsy: true })
        .withMessage('Please enter a first name'),
    body('lastName')
        .exists({ checkFalsy: true })
        .withMessage('Please enter a last name')
];
