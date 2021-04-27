var express = require('express');
var router = express.Router();

//Require controller modules
var customer_controller = require('../controllers/customerController');

//LIST GET request for display all customers
router.get('/', customer_controller.customers);

//CREATE GET request for redirect to customer form page
router.get('/create', customer_controller.customer_create_get);

//CREATE POST request for saving the NEW customer
router.post('/create', customer_controller.customer_create_post);

//DETAIL GET request for display customer detail
router.get('/:id', customer_controller.customer_detail);

//UPDATE GET request for redirect to customer form
router.get('/:id/update', customer_controller.customer_update_get);

//UPDATE POST request for saving updated customer
router.post('/:id/update', customer_controller.customer_update_post);

//DELETE GET request for redirect to customer delete confirm page
router.get('/:id/delete')

//DELETE POST request for deleting the customer
router.post('/:id', customer_controller.customer_delete_post);

module.exports = router;