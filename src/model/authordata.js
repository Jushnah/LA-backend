const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI ||'mongodb://localhost:27017/library',
{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
    name: String,
    about: String,
    image: String
});

var Authordata = mongoose.model('authordata',AuthorSchema);

module.exports = Authordata;
