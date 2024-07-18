import { DateTime } from 'luxon';

import User from '../models/user.js';
import Meeting from '../models/meeting.js';
import Whisky from '../models/whisky.js';

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
    const meetingId = req.params.meetingId;
    let meeting = await Meeting.findById(meetingId);
    meeting = meeting.toJSON()
    const whiskies = await Whisky.find({meeting: meetingId})
    const meetingDate = DateTime.fromJSDate(meeting.meetingDate);
    const newMeetingDate = meetingDate.toFormat('dd-LL-yyyy');
    meeting.meetingDate = newMeetingDate
    res.render('main/vote', {
        path: '/vote',
        pageTitle: 'Voting',
        meeting: meeting,
        whiskies: whiskies
    });
}
