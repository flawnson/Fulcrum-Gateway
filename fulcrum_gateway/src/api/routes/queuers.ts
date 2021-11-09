// To remove TS error
export {};
const express = require('express');
const router = express.Router();

// Require controller modules.
const queuer_controller = require('../controllers/authorController');


router.get('/queuer/:queueid/join', queuer_controller.join_queue)

router.get('/queuer/:queuerid/stats', queuer_controller.get_queuer_stats)

module.exports = router
