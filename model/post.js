const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: String,
    question: String,
    solutions:[
        {
            type:Schema.Types.ObjectId,
            ref:'Solution'
        }
    ]
});

const Post = mongoose.model('Post',PostSchema);

module.exports = Post;