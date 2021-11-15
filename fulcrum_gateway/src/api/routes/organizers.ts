// @ts-nocheck for express and router redeclaration error
const express = require('express');
const router = express.Router();

// Require controller modules.
const organizer_controller = require('../controllers/organizerController.ts');
const queue_controller = require('../controllers/queueController.ts');

router.post('/organizer/:organizerId/create', organizer_controller.create_queue_form)

router.get('/organizer/:organizerId/queues', organizer_controller.get_queues)

router.get('/organizer/:organizerId/queues/:queueId/stats', organizer_controller.get_queue_stats)

router.get('/organizer/:organizerId/queues/:queueId/end', organizer_controller.end_queue)

router.post('/organizer/:organizerId/queues/:queueId/pause', organizer_controller.pause_queue)

router.post('/organizer/:organizerId/queues/:queueId/edit', organizer_controller.edit_queue)

router.get('/organizer/:organizerId/queues/:queueId/enqueued', queue_controller.get_enqueued)

router.get('/organizer/:organizerId/queues/:queueId/serviced', queue_controller.get_serviced)

router.get('/organizer/:organizerId/queues/:queueId/abandoned', queue_controller.get_abandoned)

router.get('/organizer/:organizerId/queues/:queueId/:queuerId/stats', queue_controller.get_enqueued_stats)

router.post('/organizer/:organizerId/queues/:queueId/:queuerId/summon', queue_controller.summon_enqueued)

router.post('/organizer/:organizerId/queues/:queueId/:queuerId/kick', queue_controller.kick_enqueued)

module.exports = router
