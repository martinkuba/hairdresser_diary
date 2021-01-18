var Visit = require('../models/visit');
var async = require('async');
var Customer = require('../models/customer');
const {body,validationResult} = require('express-validator');
var moment = require('moment');

//DIARY (index) GET
exports.diary = function(req, res) {

    const today = moment().startOf('day');

    Visit.find({date_from: {
                               $gte: today,
                               $lte: moment(today).endOf('day')
                             }})
        .populate('customer')
//      .populate('hairdresser')
        .exec(function (err, list_visits) {
            if (err) {return next(err);}
                //Successful so render
                res.render('diary', {title: 'Diář', diary_date: today.format('YYYY-MM-DD'), visits_list: list_visits});
         });
};

//DIARY POST
exports.diary_post = function(req, res, next) {

    let search_date;
    search_date = moment(req.body.diary_date);

    Visit.find({date_from: {
                               $gte: search_date,
                               $lte: moment(req.body.diary_date).endOf('day').toDate()
                             }})
        .populate('customer')
        .exec(function (err, list_visits) {
            if (err) {return next(err);}
            res.render('diary', {title:'Diář', diary_date: search_date.format('YYYY-MM-DD'), visits_list: list_visits});
        });

};

//LIST of visits
exports.visits = function(req, res, next) {

    Visit.find()
        .populate('customer')
        .populate('hairdresser')
        .exec(function (err, list_visits) {
            if (err) {return next(err);}
                //Successful so render
                res.render('visit_list', {title: 'Objednávky', visits_list: list_visits});
         });
};

//GET DETAIL of visit
exports.visit_detail = function(req, res, next) {

   Visit.findById(req.params.id)
        .populate('customer')
        .exec(function (err, visit){
            if(err) {return next (err);}
            if(visit==null) {
                var err = new Error('Objednávka nenalezena');
                err.status = 404;
                return next(err);
            }

            res.render('visit_detail',{title: 'Objednávka', visit: visit});
        })
};

//GET CREATE visit form
exports.create_visit_get = function(req, res, next) {

    async.parallel({
        customers: function(callback){
              Customer.find({}, 'name surname')
                .exec(callback)
            }
        },
        function(err, results){
          if (err) {return next(err);}
           res.render('visit_form', {title: 'Nová objednávka', customers_list: results.customers, customerid: req.query.customerid});
           }
    );
};

//POST CREATE visit form
exports.create_visit_post = [

    //Validate fields
    // ADD validations
    // time to is after time from
    // there is no other visit in the same time

    body('customer').trim().isLength({min:1}).withMessage('Chybí zákazník.'),
    body('datetime_from').isLength({min:1}).withMessage('Chybí datum a čas od.'),

    //Process request after validation
    (req, res, next) => {

    var visit = new Visit(
        {
              customer: req.body.customer,
              date_from: req.body.datetime_from,
              date_to: req.body.datetime_to,
              note: req.body.note
        });

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        //There are errors. Render form again with sanitized values/error messages
        Customer.find({},'name surname')
            .exec(function (err, customers) {
                if (err) {return next(err);}

                 res.render('visit_form',{title: 'Nová objednávka', visit: visit, customers_list: customers, errors: errors.array()});

       });
        return;
    }

    else {
    //Save the visit
        visit.save(function (err) {
            if (err) {return next(err);}
            res.redirect('/visits'); //TODO - redirect na detail zákazníka?
        });
    }
  }
];

//GET UPDATE visit form
exports.update_visit_get = function(req, res, next) {

  async.parallel({
        customers: function(callback){
              Customer.find({}, 'name surname')
                .exec(callback)
            },

        visit: function(callback) {
                Visit.findById(req.params.id)
                    .populate('customer')
                    .exec(callback);
            },
        },function(err, results){
          if (err) {return next(err);}
           res.render('visit_form', {title: 'Úprava objednávky', customers_list: results.customers, visit: results.visit});
           }
    );
};

//POST UPDATE visit form
exports.update_visit_post = function(req, res, next) {

// ADD validations
// time to is after time from
// there is no other visit in the same time

    var visit =  new Visit(
      {
          _id: req.params.id,
          customer: req.body.customer,
          date_from: req.body.datetime_from,
          date_to: req.body.datetime_to,
          note: req.body.note
        });

        Visit.findByIdAndUpdate(req.params.id, visit, function(err, thevisit) {
            if (err) {return next(err);}
            res.redirect(thevisit.url);
        });
};

//GET DELETE visit form
exports.delete_visit_get = function(req, res, next) {

     Visit.findById(req.params.id)
           .populate('customer')
           .exec(function (err, visit) {
            if (err) {return next (err);}
            if(visit==null) {
                var err = new Error('Objednávka nenalezena');
                err.status = 404;
                return next(err);
            }

            res.render('visit_delete', {title: 'Smazání objednávky', visit: visit});
           })
};

//POST DELETE visit
exports.delete_visit_post = function(req, res, next) {

    Visit.findByIdAndRemove(req.params.id, function deleteVisit(err) {
        if (err) {return next(err);}
        res.render('visit_delete', {title: 'Objednávka smazána'})
    })
};