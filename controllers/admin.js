import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';

import User from '../models/user.js';

export const getIndex = (req, res, next) => {
    res.render('admin/index', {
        path: '/index',
        pageTitle: 'Main Dashboard'
    });
};

export async function getUsers(req, res, next) {
    const users = await User.find().sort('lastName');
    res.render('admin/users', {
        path: '/users',
        pageTitle: 'Users',
        users: users
    });
}

export async function getCreateUser(req, res, next) {
    res.render('admin/createUser', {
        path: '/create',
        pageTitle: 'Create User',
        editing: false,
        hasError: false,
        validationErrors: []
    });
}

export async function postCreateUser(req, res, next) {
    const body = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('admin/createUser', {
            path: '/create',
            pageTitle: 'Create User',
            editing: false,
            hasError: true,
            user: body,
            validationErrors: errors.array()
        });
    }
    try {
        const hashedPassword = await bcrypt.hash(body.password, 12);
        const user = new User({
            username: body.username,
            firstName: body.firstName,
            lastName: body.lastName,
            password: hashedPassword,
            passwordLastUpdated: new Date()
        });
        await user.save();
        return res.redirect('/admin/users');
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
}

export async function getEditUser(req, res, next) {
    const userId = req.query.userId;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.redirect('/admin/users');
        }
        return res.render('admin/createUser', {
            path: '/edit',
            pageTitle: 'Edit User',
            editing: true,
            hasError: false,
            user: user,
            validationErrors: []
        });
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
}

export async function postEditUser(req, res, next) {
    const userId = req.body.userId;
    let body = req.body;
    body = { ...body, _id: userId };
    const errors = validationResult(req);
    try {
        if (!errors.isEmpty()) {
            return res.status(422).render('admin/createUser', {
                path: '/edit',
                pageTitle: 'Edit User',
                editing: true,
                hasError: true,
                user: body,
                validationErrors: errors.array()
            });
        }
        const user = await User.findById(userId);
        user.username = body.username;
        user.firstName = body.firstName;
        user.lastName = body.lastName;
        const hashedPassword = await bcrypt.hash(body.password, 12);
        user.password = hashedPassword;
        user.passwordLastUpdated = new Date();
        await user.save();
        return res.redirect('/admin/users');
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
}
