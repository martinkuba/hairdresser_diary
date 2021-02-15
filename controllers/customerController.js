var Customer = require('../models/customer');
var Visit = require('../models/visit');
var User = require('../models/user');
var async = require('async');

//Index
exports.index = function(req, res) {

//get the number of customers and visits in DB
   async.parallel({
        customers_count: function(callback) {
            Customer.countDocuments({}, callback);
        },

        visits_count: function(callback) {
           Visit.countDocuments({}, callback);
       }

   }, function(err, results) {
      res.render('index', { title: 'Kadeřnický diář', error: err, data: results });
   });
};

//LIST of customers
exports.customers = function(req, res, next) {
//    res.send('NOT IMPLEMENTED');
    Customer.find()
        //populate is used for the populating the referenced entities by its instances
        // the value is the name of the attribute of the model that should be populated
        .populate('hairdresser')
        .exec(function (err, list_customers) {
            if (err) {return next(err);}
            //Successful, so render
           res.render('customer_list', {title: 'Zákazníci', customer_list: list_customers});
        });
};

//DETAIL of the customer
exports.customer_detail = function(req, res, next) {
    async.parallel({
        customer: function(callback) {
            Customer.findById(req.params.id)
                .exec(callback)
        },
        customer_visits: function(callback) {
            Visit.find({'customer': req.params.id})
                .exec(callback)
        },
    },
        function (err, results) {
            //Error in API usage
            if (err) {return next(err);}

            //chyba když e nenajde žádný customer
            if (results.customer ==null) {
                var err = new Error('Zákazník nenalezen');
                err.status = 404;
                return next(err);
            }
            //Successful, so render
            res.render('customer_detail', {title: 'Zákazník', customer: results.customer, customer_visits: results.customer_visits});
        }
    );
};

//Display customer create form on GET
exports.customer_create_get = function(req, res, next) {
    res.render('customer_form', {title: 'Nový zákazník'});

};

// CREATE POST Handling
exports.customer_create_post = function (req, res, next) {

      //!!! Doplnit validaci dat

        //Create customer object
        var customer = new Customer(
            {
                name: req.body.name,
                surname: req.body.surname,
                phone: req.body.phone,
                email: req.body.email,
                note: req.body.note
            });
        //Save the customer in DB
        customer.save(function (err) {
            if (err) {return (err);}
            res.redirect('/customers');
        });
};

//Customer UPDATE on GET
exports.customer_update_get = function(req, res, next) {
    Customer.findById(req.params.id)
        .populate('customer')
        .exec(function (err, customer){
            if (err) {return next(err);}
            if (customer==null) { //No results
                var err = new Error('Zákazník nenalezen');
                err.status = 404;
                return next(err);
            }

        res.render('customer_form', {title: 'Úprava zákazníka', customer: customer});
        })
};

//Customer UPDATE on POST
exports.customer_update_post = function(req, res, next) {


//!!! Doplnit validaci dat

   var customer = new Customer (
        {   name: req.body.name,
            surname: req.body.surname,
            hairdresser: req.body.hairdresser,
            phone: req.body.phone,
            email: req.body.email,
            note: req.body.note,
            _id: req.params.id
        }
   );

   Customer.findByIdAndUpdate(req.params.id, customer, {}, function(err, thecustomer) {
        if (err) {return next(err);}
            res.redirect(thecustomer.url);
   });
};

//Customer DELETE on POST
exports.customer_delete_post = function(req, res, next) {

    Customer.findByIdAndRemove(req.body.customerid, function deleteCustomer(err) {
        if (err) {return next(err);}
        res.render('diary', { title: 'Kadeřnický diář', error: err})
    })
};

