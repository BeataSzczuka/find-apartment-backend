const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const schema = new Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    apartments: [{
        type: Schema.Types.ObjectId,
        ref: "apartments"
    }],
    role: {
        type: String,
        default: 'basic',
        enum: ["basic", "admin"]
    },
    accessToken: {
        type: String
    }
})


export default mongoose.model('users', schema);
