var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var VisitSchema = new Schema(
    {
       date_from:{type: Date, required: true},
       date_to: {type: Date, required: true},
       note: {type: String},
       hairdresser: {type: Schema.Types.ObjectId, ref: 'User'},
       customer: {type: Schema.Types.ObjectId, ref: 'Customer', required: true},
    }
);

// Virtual for visit's url
VisitSchema
    .virtual('url')
    .get(function () {
        return '/visits/' + this._id;
    });

// Virtual for the date of the visit
VisitSchema
    .virtual('date')
    .get(function (){
        return moment(this.date_from).format('DD.MM.YY');
    });

//Virtual for the start time of the visit
VisitSchema
    .virtual('time_from')
    .get(function (){
        return moment(this.date_from).format('HH:mm');
    });


//Virtual for the end time of the visit
VisitSchema
    .virtual('time_to')
    .get(function (){
        return moment(this.date_to).format('HH:mm');
    });

// Virtual for the lenght of the visit in hours
VisitSchema
    .virtual('length')
    .get(function () {
 //   TODO:    !!!!!!!!!!
    });

//Export model
module.exports = mongoose.model('Visit', VisitSchema);
