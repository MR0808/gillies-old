import mongoose from 'mongoose';

const Schema = mongoose.Schema;

var meetingSchema = new Schema(
    {
        meetingDate: Date,
        meetingLocation: String,
        users: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        quaich: {
            name: String,
            votes: [
                {
                    user: {
                        type: Schema.Types.ObjectId,
                        ref: 'User'
                    },
                    score: Number
                }
            ]
        },
        whiskies: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Whisky'
            }
        ],
        status: {
            type: String,
            enum: ['Open', 'Closed'],
            default: 'Open'
        }
    },
    { timestamps: true }
);

export default mongoose.model('Meeting', meetingSchema);
