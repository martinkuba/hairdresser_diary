var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema(
    {
        username: {type: String, required: true},
        password: {type: String, required: true},
        role: {type: String, required: true, enum: ['hairdresser','admin']},
    }
);

//Virtual for hairdresser's URL
UserSchema
    .virtual('url')
    .get(function () {
        return '/user/' + this._id;
    });

//Export model
module.exports = mongoose.model('User', UserSchema);