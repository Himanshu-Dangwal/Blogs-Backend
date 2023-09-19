const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogsSchema = new Schema({
    title: {
        type: String,
        required: true,
        min: 3,
    },
    description: {
        type: String,
        required: true,
        min: 3,
    },
    tag: {
        type: String,
        default: "General",
        required : true,
        min: 3,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    upvote : {
        type : Number,
    },
    downvote : {
        type : Number
    }

}, { timestamps: true })

module.exports = mongoose.model('Blogs', blogsSchema)