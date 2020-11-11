const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const schema = new Schema({
    title: String,
    price: Number,
    propertySize: Number,
    location: String,
    description: String,
    isDeleted: {
        type: Boolean,
        default: false
    }
})


export default mongoose.model('apartments', schema);
