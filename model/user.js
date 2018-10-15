const mongoose = require('mongoose');
const Keys = require('../config/keys');

var keys = Keys.mongoURI;
mongoose.connect(keys,{ useNewUrlParser: true });

const Schema = mongoose.Schema;
const UserSchema = new Schema({
    googleid: String,
    name: String,
    mailID: String,
    photo: String,
    posts:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Post'
        }
    ]
    
});

const User = mongoose.model('User',UserSchema);

module.exports = User;