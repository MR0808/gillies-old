import mongoose from 'mongoose';

const Schema = mongoose.Schema;

var userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        firstName: String,
        lastName: String,
        passwordLastUpdated: Date,
        access: {
            type: String,
            enum: ['Admin', 'User'],
            default: 'User'
        },
        emailOld: String,
        passwordResetToken: String,
        passwordResetExpires: Date
    },
    { timestamps: true }
);

export default mongoose.model('User', userSchema);
