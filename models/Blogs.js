const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./User');
const { boolean } = require('joi');

const commentSchema = new mongoose.Schema({
    id: {
      type: mongoose.Schema.Types.ObjectId, // Assuming user_id is of type ObjectId
      ref: 'User', // Refers to the 'User' model
    },
    message: String,
    like : Number,
    isNested : Boolean,
    comment : [this]
  });

  // comment
  // user
  // 

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
    },
    comment : [commentSchema],

}, { timestamps: true })

module.exports = mongoose.model('Blogs', blogsSchema)