// @ts-nocheck for express and router redeclaration error
const express = require('express');
const router = express.Router();

// Require controller modules.
const queue_controller = require("../controllers/queueController.ts");

router.get('/organizer/:organizerId/queues/:queueId/enqueued', queue_controller.get_enqueued)

router.get('/organizer/:organizerId/queues/:queueId/serviced', queue_controller.get_serviced)

router.get('/organizer/:organizerId/queues/:queueId/abandoned', queue_controller.get_abandoned)

router.get('/organizer/:organizerId/queues/:queueId/:queuerId/stats', queue_controller.get_enqueued_stats)

router.post('/organizer/:organizerId/queues/:queueId/:queuerId/summon', queue_controller.summon_enqueued)

router.post('/organizer/:organizerId/queues/:queueId/:queuerId/kick', queue_controller.kick_enqueued)

module.exports = router
