var express = require('express');
var router = express.Router();

//Require controller modules
var visit_controller = require('../controllers/visitController');

//GET LIST of all visits
router.get('/', visit_controller.visits)

//GET CREATE form page
router.get('/create', visit_controller.create_visit_get);

//POST CREATE visit form
router.post('/create', visit_controller.create_visit_post);

//GET DETAIL of visit
router.get('/:id', visit_controller.visit_detail);

//GET UPDATE visit form
router.get('/:id/update', visit_controller.update_visit_get);

//POST UPDATE visit form
router.post('/:id/update', visit_controller.update_visit_post);

//GET DELETE request
router.get('/:id/delete', visit_controller.delete_visit_get);

//POST DELETE request
router.post('/:id/delete', visit_controller.delete_visit_post);

module.exports = router;