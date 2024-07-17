import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';

import User from '../models/user.js';

export const getLogin = (req, res, next) => {
    if (req.session.isLoggedIn) {
        return res.redirect('/');
    }
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        loginError: false,
        oldInput: {
            username: '',
            remember: true
        },
        validationErrors: []
    });
};

export async function postLogin(req, res, next) {
    const username = req.body.username;
    const password = req.body.password;
    const remember = req.body.remember;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            loginError: false,
            oldInput: {
                username: username,
                remember: remember
            },
            validationErrors: errors.array()
        });
    }
    try {
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(422).render('auth/login', {
                path: '/login',
                pageTitle: 'Login',
                loginError: true,
                oldInput: {
                    username: username,
                    remember: remember
                },
                validationErrors: []
            });
        }
        const doMatch = await bcrypt.compare(password, user.password);
        if (!doMatch) {
            return res.status(422).render('auth/login', {
                path: '/login',
                pageTitle: 'Login',
                loginError: true,
                oldInput: {
                    username: username,
                    remember: remember
                },
                validationErrors: []
            });
        } else {
            if (remember) {
                const hour = 3600000;
                req.session.cookie.maxAge = 14 * 24 * hour; //2 weeks
            } else {
                req.session.cookie.expires = false;
            }
            req.session.user = user;
            req.session.isLoggedIn = true;
            await req.session.save();
            res.redirect('/');
        }
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
}

export async function postLogout(req, res, next) {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/login');
    });
}
