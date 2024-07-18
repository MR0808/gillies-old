import mongoose from 'mongoose';

const Schema = mongoose.Schema;

var voteSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        score: Number,
        whisky: {
            type: Schema.Types.ObjectId,
            ref: 'Whisky'
        }
    },
    { timestamps: true }
);

export default mongoose.model('Vote', voteSchema);
