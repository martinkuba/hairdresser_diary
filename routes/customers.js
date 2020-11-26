var express = require('express');
var router = express.Router();

//Require controller modules
var customer_controller = require('../controllers/customerController');

//GET request for LIST of all customers
router.get('/', customer_controller.customers);

//GET request for redirect to customer CREATE form page
router.get('/create', customer_controller.customer_create_get);

//POST request for saving the NEW customer
router.post('/create', customer_controller.customer_create_post);

//GET request for display customer DETAIL
router.get('/:id', customer_controller.customer_detail);

//POST request to DELETE customer
router.post('/:id', customer_controller.customer_delete_post);

//GET request to UPDATE customer
router.get('/:id/update', customer_controller.customer_update_get);

//POST request to UPDATE customer
router.post('/:id/update', customer_controller.customer_update_post);

module.exports = router;