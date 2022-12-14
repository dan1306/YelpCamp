const mongoose = require('mongoose');
const { CampgroundSchema } = require('../schemas');
const schema = mongoose.Schema;

const reviewSchema = new mongoose.Schema({
    body: String,
    rating: Number,
    author: {
        type: schema.Types.ObjectId,
        ref: "User"
    }
})

module.exports = mongoose.model("Review", reviewSchema)