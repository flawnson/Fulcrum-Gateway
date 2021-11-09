// To remove TS error
export {};
const express = require('express');
const router = express.Router();

// Require controller modules.
const organizer_controller = require('../controllers/bookController');
const queue_controller = require('../controllers/authorController');

router.post('/organizer/:organizerId/create', organizer_controller.create_queue_form)

router.get('/organizer/:organizerId/queues', organizer_controller.get_queues)

router.get('/organizer/:organizerId/queues/:queueId/stats', organizer_controller.get_queue_stats)

router.get('/organizer/:organizerId/queues/:queueId/end', organizer_controller.end_queue)

router.get('/organizer/:organizerId/queues/:queueId/pause', organizer_controller.pause_queue)

router.get('/organizer/:organizerId/queues/:queueId/edit', organizer_controller.edit_queue)

router.get('/organizer/:organizerId/queues/:queueId/enqueued', organizer_controller.get_enqueued)

router.get('/organizer/:organizerId/queues/:queueId/:queuerId/stats', organizer_controller.get_enqueued_stats)

router.get('/organizer/:organizerId/queues/:queueId/:queuerId/summon', organizer_controller.summon_enqueued)

router.get('/organizer/:organizerId/queues/:queueId/:queuerId/kick', organizer_controller.kick_enqueued)

module.exports = router
