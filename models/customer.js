var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CustomerSchema = new Schema (
    {
        name: {type: String, required: true},
        surname: {type: String},
        hairdresser: {type: Schema.Types.ObjectId, ref: 'User'},
        phone: {type: String},
        email: {type: String},
        note: {type: String},
    }
);

//Virtual for customer's URL
CustomerSchema
    .virtual('url')
    .get(function () {
        return '/customers/' + this._id;
    });

//Virtual for customer's full name
CustomerSchema
    .virtual('fullname')
    .get(function () {


       if (this.name && this.surname) {
            fullname = this.name + ' ' + this.surname
        }
        if (!this.name || !this.surname) {
            if(this.name) {
                fullname = this.name
            }
            if(this.surname) {
                fullname = this.surname
            }

        }
        return fullname;
});


//Export model
module.exports = mongoose.model('Customer', CustomerSchema);