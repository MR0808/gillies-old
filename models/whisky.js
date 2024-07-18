import mongoose from 'mongoose';

const Schema = mongoose.Schema;

var whiskySchema = new Schema(
    {
        name: String,
        meeting: {
            type: Schema.Types.ObjectId,
            ref: 'Meeting'
        },
        votes: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Vote'
            }
        ]
    },
    { timestamps: true }
);

export default mongoose.model('Whisky', whiskySchema);
