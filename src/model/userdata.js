const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI ||'mongodb://localhost:27017/library',
{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    user: String,
    password: String,
    email: String
});

var Userdata = mongoose.model('userdata',UserSchema);

module.exports = Userdata;
