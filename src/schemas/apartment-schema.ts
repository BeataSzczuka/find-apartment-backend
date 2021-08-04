const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const schema = new Schema({
    description: String,
    location: String,
    propertySize: Number,
    price: Number,
    transactionType: String,
    publicationDate: Date,
    phoneNumber: String,
    email: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    images: [{
        filename: String, contentType: String
    }],
    isDeleted: {
        type: Boolean,
        default: false
    }
})


export default mongoose.model('apartments', schema);
