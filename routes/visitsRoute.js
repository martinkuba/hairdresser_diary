var express = require('express');
var router = express.Router();

//Require controller modules
var visit_controller = require('../controllers/visitController');

//LIST GET request for display all visits
router.get('/', visit_controller.visits)

//CREATE Visit GET (request for redirect to visit form page)
router.get('/create', visit_controller.create_visit_get);

//CREATE Visit POST (request for saving the NEW visit)
router.post('/create', visit_controller.create_visit_post);

//DETAIL GET request for display visit detail
router.get('/:id', visit_controller.visit_detail);

//UPDATE GET request for redirect to visit form
router.get('/:id/update', visit_controller.update_visit_get);

//POST UPDATE request for saving updated visit
router.post('/:id/update', visit_controller.update_visit_post);

//DELETE GET request for redirect to visit delete confirm page
router.get('/:id/delete', visit_controller.delete_visit_get);

//DELETE POST request for deleting the visit
router.post('/:id/delete', visit_controller.delete_visit_post);

module.exports = router;