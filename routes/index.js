var express = require('express');
var router = express.Router();

//Require controller modules
var customer_controller = require('../controllers/customerController');
var visit_controller = require('../controllers/visitController');

/* GET home page. */
//router.get('/', function(req, res, next) {
//  res.render('index', { title: 'Express' });
//});

// GET Home page
//router.get('/', customer_controller.index);

//GET Diary Home page
router.get('/', visit_controller.diary);

module.exports = router;
