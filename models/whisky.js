import mongoose from 'mongoose';

const Schema = mongoose.Schema;

var whiskySchema = new Schema(
    {
        name: String,
        votes: [
            {
                user: {
                    type: Schema.Types.ObjectId,
                    ref: 'User'
                },
                score: Number
            }
        ],
        meeting: {
            type: Schema.Types.ObjectId,
            ref: 'Meeting'
        }
    },
    { timestamps: true }
);

export default mongoose.model('Whisky', whiskySchema);
