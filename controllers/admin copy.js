import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import { DateTime } from 'luxon';

import User from '../models/user.js';
import Meeting from '../models/meeting.js';
import Whisky from '../models/whisky.js';

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
        path: '/createUser',
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
            path: '/createUser',
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
            path: '/editUser',
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
                path: '/editUser',
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

export async function getMeetings(req, res, next) {
    const meetings = await Meeting.find().sort('meetingDate');
    const updatedMeetings = meetings.map((meeting) => {
        const meetingDate = DateTime.fromJSDate(meeting.meetingDate);
        const newMeetingDate = meetingDate.toFormat('dd-LL-yyyy');
        const newMeeting = { ...meeting._doc };
        newMeeting.meetingDate = newMeetingDate;
        return newMeeting;
    });
    res.render('admin/meetings', {
        path: '/meetings',
        pageTitle: 'Meetings',
        meetings: updatedMeetings
    });
}

export async function getCreateMeeting(req, res, next) {
    const users = await User.find().sort('lastName');
    res.render('admin/createMeeting', {
        path: '/createMeeting',
        pageTitle: 'Create Meeting',
        editing: false,
        hasError: false,
        validationErrors: [],
        users: users
    });
}

export async function postCreateMeeting(req, res, next) {
    const body = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const meetingDate = body.meetingDate;
        return res.status(422).render('admin/createMeeting', {
            path: '/createMeeting',
            pageTitle: 'Create Meeting',
            editing: false,
            hasError: true,
            meeting: body,
            validationErrors: errors.array(),
            meetingDate: meetingDate
        });
    }
    try {
        let meetingDate = new Date(body.meetingDate);
        const meeting = new Meeting({
            meetingDate: meetingDate,
            meetingLocation: body.meetingLocation,
            quaich: body.quaich,
            users: body.users
        });
        const newMeeting = await meeting.save();
        const whisky1 = new Whisky();
        return res.redirect('/admin/meetings');
    } catch (err) {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
}

// export async function postCreateMeeting(req, res, next) {
//     const body = req.body;
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         const meetingDate = body.meetingDate;
//         return res.status(422).render('admin/createMeeting', {
//             path: '/createMeeting',
//             pageTitle: 'Create Meeting',
//             editing: false,
//             hasError: true,
//             meeting: body,
//             validationErrors: errors.array(),
//             meetingDate: meetingDate
//         });
//     }
//     try {
//         let meetingDate = new Date(body.meetingDate);
//         console.log(body.whiskies);
//         let whiskies = {};
//         for (let whisky of body.whiskies) {
//             Object.assign(whiskies, { name: whisky });
//         }
//         console.log(whiskies);
//         const meeting = new Meeting({
//             meetingDate: meetingDate,
//             meetingLocation: body.meetingLocation,
//             quaich: body.quaich,
//             whiskies: whiskies,
//             users: body.users
//         });
//         await meeting.save();
//         return res.redirect('/admin/meetings');
//     } catch (err) {
//         console.log(err);
//         const error = new Error(err);
//         error.httpStatusCode = 500;
//         return next(error);
//     }
// }

export async function getEditMeeting(req, res, next) {
    const meetingId = req.query.meetingId;
    try {
        const meeting = await Meeting.findById(meetingId);
        const users = await User.find().sort('lastName');
        if (!meeting) {
            return res.redirect('/admin/meetings');
        }
        let meetingDate = DateTime.fromJSDate(meeting.meetingDate);
        meetingDate = meetingDate.toFormat('dd-LL-yyyy');
        return res.render('admin/createMeeting', {
            path: '/editMeeting',
            pageTitle: 'Edit Meeting',
            editing: true,
            hasError: false,
            meeting: meeting,
            validationErrors: [],
            users: users,
            meetingDate: meetingDate
        });
    } catch (err) {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
}

export async function postEditMeeting(req, res, next) {
    const meetingId = req.body.meetingId;
    let body = req.body;
    body = { ...body, _id: meetingId };
    const errors = validationResult(req);
    try {
        if (!errors.isEmpty()) {
            const users = await User.find().sort('lastName');
            return res.status(422).render('admin/createMeeting', {
                path: '/editMeeting',
                pageTitle: 'Edit Meeting',
                editing: true,
                hasError: true,
                meeting: body,
                validationErrors: errors.array(),
                users: users,
                meetingDate: body.meetingDate
            });
        }
        const whiskies = body.whiskies.map((whisky) => {
            return { name: whisky };
        });
        const meeting = await Meeting.findById(meetingId);
        meeting.meetingDate = body.meetingDate;
        meeting.meetingLocation = body.meetingLocation;
        meeting.quaich = body.quaich;
        meeting.whiskies = whiskies;
        meeting.users = body.users;
        await meeting.save();
        return res.redirect('/admin/meetings');
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
}

export async function getCloseMeeting(req, res, next) {
    const meetingId = req.query.meetingId;
    try {
        const meeting = await Meeting.findById(meetingId);
        meeting.status = 'Closed';
        await meeting.save();
        return res.redirect('/admin/meetings');
    } catch (err) {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
}
