const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SolutionSchema = new Schema({
    solution: String,
    user:{
        type: Schema.Types.ObjectId,
        ref:'User'
    }
});

const Solution = mongoose.model('Solution',SolutionSchema);
module.exports = Solution;