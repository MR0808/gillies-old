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
    try {
        const users = await User.find().sort('lastName');
        res.render('admin/users', {
            path: '/users',
            pageTitle: 'Users',
            users: users
        });
    } catch (err) {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
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
        if (body.password) {
            const hashedPassword = await bcrypt.hash(body.password, 12);
            user.password = hashedPassword;
            user.passwordLastUpdated = new Date();
        }
        await user.save();
        return res.redirect('/admin/users');
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
}

export async function getMeetings(req, res, next) {
    try {
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
    } catch (err) {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
}

export async function getCreateMeeting(req, res, next) {
    try {
        const users = await User.find().sort('lastName');
        res.render('admin/createMeeting', {
            path: '/createMeeting',
            pageTitle: 'Create Meeting',
            editing: false,
            hasError: false,
            validationErrors: [],
            users: users
        });
    } catch (err) {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
}

export async function postCreateMeeting(req, res, next) {
    const body = req.body;
    const errors = validationResult(req);
    console.log(errors);
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
            quaich: {
                name: body.quaich
            },
            users: body.users
        });
        const newMeeting = await meeting.save();
        const whisky1 = new Whisky({
            name: body.whisky1,
            meeting: newMeeting
        });
        let whisky = await whisky1.save();
        newMeeting.whiskies.push(whisky);
        const whisky2 = new Whisky({
            name: body.whisky2,
            meeting: newMeeting
        });
        whisky = await whisky2.save();
        newMeeting.whiskies.push(whisky);
        const whisky3 = new Whisky({
            name: body.whisky3,
            meeting: newMeeting
        });
        whisky = await whisky3.save();
        newMeeting.whiskies.push(whisky);
        const whisky4 = new Whisky({
            name: body.whisky4,
            meeting: newMeeting
        });
        whisky = await whisky4.save();
        newMeeting.whiskies.push(whisky);
        const whisky5 = new Whisky({
            name: body.whisky5,
            meeting: newMeeting
        });
        whisky = await whisky5.save();
        newMeeting.whiskies.push(whisky);
        const whisky6 = new Whisky({
            name: body.whisky6,
            meeting: newMeeting
        });
        whisky = await whisky6.save();
        newMeeting.whiskies.push(whisky);
        await newMeeting.save();
        return res.redirect('/admin/meetings');
    } catch (err) {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
}

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
        const meeting = await Meeting.findById(meetingId);
        let meetingDate = new Date(body.meetingDate);
        // meeting.meetingDate = meetingDate;
        // meeting.meetingLocation = body.meetingLocation;
        // meeting.quaich.name = body.quaich;
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

export async function getReports(req, res, next) {
    try {
        const meetings = await Meeting.find().sort('meetingDate');
        const updatedMeetings = meetings.map((meeting) => {
            const meetingDate = DateTime.fromJSDate(meeting.meetingDate);
            const newMeetingDate = meetingDate.toFormat('dd-LL-yyyy');
            const newMeeting = { ...meeting._doc };
            newMeeting.meetingDate = newMeetingDate;
            return newMeeting;
        });
        res.render('admin/reports', {
            path: '/reports',
            pageTitle: 'Reports',
            meetings: updatedMeetings
        });
    } catch (err) {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
}

export async function getMeetingReport(req, res, next) {
    try {
        const meetingId = req.params.meetingId;
        const meeting = await Meeting.findById(meetingId).populate({
            path: 'whiskies',
            populate: { path: 'votes' }
        });
        const meetingDate = DateTime.fromJSDate(meeting.meetingDate);
        const newMeetingDate = meetingDate.toFormat('dd-LL-yyyy');
        res.render('admin/meetingReport', {
            path: '/meetingReport',
            pageTitle: 'Meeting Report',
            meeting: meeting,
            meetingDate: newMeetingDate
        });
    } catch (err) {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
}
