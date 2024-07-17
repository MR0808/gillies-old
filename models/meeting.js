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
        quaich: String,
        whiskies: [{ name: String }]
    },
    { timestamps: true }
);

export default mongoose.model('Meeting', meetingSchema);
