import mongoose, {Schema, Document} from "mongoose";

export interface Message extends Document {
    content: string,
    createdAt: Date,
}

export interface User extends Document {
    username: string,
    password: string,
    email : string,
    verifyCode: string,
    verifyCodeExpireAt: Date,
    isVerified : boolean,
    isAcceptingMessage: boolean,
    message: Message[]
}

// Creating the Schema's

const messageSchema : Schema<Message> = new mongoose.Schema({
    content: {
        required: true,
        type: String,
    },
    createdAt: {
        type : Date,
        default : Date.now,
        required: true,
    }
});

const userSchema : Schema<User> = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'UserName is Required'],
        unique: true,
        trim : true,
    },
    password: {
        type : String,
        required: [true, 'Password is Required'],
    },
    email: {
        type: String,
        required: [true, 'Email is Required'],
        unique: true,
        match : [/.+\@.+\..+/,'Please Use a valid email'],
    },
    verifyCode: {
        type : String,
        required: [true, 'Verify Code is required'],
    },
    verifyCodeExpireAt: {
        type : Date,
        required: [true, 'Verify Code Expiry is required'],
    },
    isVerified : {
        type : Boolean,
        default : false,
    },
    isAcceptingMessage : {
        type : Boolean,
        default : true,
    },
    message: [messageSchema],
});

// Export the Schema's
const userModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>('User', userSchema);

export default userModel;

