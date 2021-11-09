const express = require('express');
const router = express.Router();

// Require controller modules.
var queuer_controller = require('../controllers/authorController');


router.get('/queuer/:queuerid/stats', queuer_controller.get_queuer_stats)

module.exports = router
