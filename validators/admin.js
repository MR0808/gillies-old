import { body } from 'express-validator';

import User from '../models/user.js';

export const createUser = [
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

export const editUser = [
    body('username', 'Please enter a valid username')
        .exists({ checkFalsy: true })
        .bail()
        .custom(async (value, { req }) => {
            const oldValue = await User.findById(req.body.userId);
            if (oldValue.username !== value) {
                const userDoc = await User.findOne({
                    username: value
                });
                if (userDoc) {
                    return Promise.reject('Username already exists.');
                }
            }
        }),
    body(
        'password',
        'The password must be at least 8 characters long, contain one uppercase, one lowercase, one number and a symbol'
    )
        .optional({ checkFalsy: true })
        .isLength({ min: 4 })
        .trim(),
    body('firstName')
        .exists({ checkFalsy: true })
        .withMessage('Please enter a first name'),
    body('lastName')
        .exists({ checkFalsy: true })
        .withMessage('Please enter a last name')
];
