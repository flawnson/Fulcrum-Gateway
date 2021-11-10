// @ts-nocheck for express and router redeclaration error
const express = require('express');
const router = express.Router();

// Require controller modules.
const queuer_controller = require('../controllers/queuerController.ts');

router.get('/queuer/:queueId/join', queuer_controller.join_queue)

router.get('/queuer/:queuerId/stats', queuer_controller.get_queuer_stats)

router.get('/queuer/:queuerId/defer', queuer_controller.defer_queue)

router.get('/queuer/:queuerId/leave', queuer_controller.leave_queue)

module.exports = router
