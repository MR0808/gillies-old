import { DateTime } from 'luxon';

import User from '../models/user.js';
import Meeting from '../models/meeting.js';
import Whisky from '../models/whisky.js';
import Vote from '../models/vote.js';

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
    meeting = meeting.toJSON();
    const whiskies = await Whisky.find({ meeting: meetingId }).populate({
        path: 'votes',
        match: { user: req.session.user }
    });
    const meetingDate = DateTime.fromJSDate(meeting.meetingDate);
    const newMeetingDate = meetingDate.toFormat('dd-LL-yyyy');
    meeting.meetingDate = newMeetingDate;
    res.render('main/vote', {
        path: '/vote',
        pageTitle: 'Voting',
        meeting: meeting,
        whiskies: whiskies
    });
}

export async function postVote(req, res, next) {
    let body = req.body;
    try {
        const vote = await Vote.findOne({
            whisky: body.whiskyId,
            user: req.session.user
        }).populate({ path: 'whisky' });
        let meetingId;
        if (vote) {
            vote.score = body.score;
            await vote.save();
            meetingId = vote.whisky.meeting;
        } else {
            const newVote = new Vote({
                whisky: body.whiskyId,
                score: body.score,
                user: req.session.user
            });
            const finalNewVote = await newVote.save();
            const whisky = await Whisky.findById(body.whiskyId);
            whisky.votes.push(finalNewVote);
            await whisky.save();
            meetingId = whisky.meeting;
        }
        return res.redirect('/vote/' + meetingId);
    } catch (err) {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
}
