import { DateTime } from 'luxon';

import User from '../models/user.js';
import Meeting from '../models/meeting.js';

export async function getIndex(req, res, next) {
    const meetings = await Meeting.find({
        users: req.session.user,
        status: 'Open'
    });
    const updatedMeetings = meetings.map((meeting) => {
        const meetingDate = DateTime.fromJSDate(meeting.meetingDate);
        const newMeetingDate = meetingDate.toFormat('dd-LL-yyyy');
        const newMeeting = { ...meeting._doc };
        newMeeting.meetingDate = newMeetingDate;
        return newMeeting;
    });
    res.render('main/index', {
        path: '/index',
        pageTitle: 'Home Page',
        meetings: updatedMeetings
    });
}

export async function getVote(req, res, next) {
    const meetingId = req.param.meetingId;

    res.render('main/vote', {
        path: '/vote',
        pageTitle: 'Voting',
        meetings: updatedMeetings
    });
}
