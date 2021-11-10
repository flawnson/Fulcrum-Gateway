// @ts-nocheck to get rid of req and res uninferable types

exports.create_queue_form = function(req, res, next) {
    try {
        console.log(req.params.organizerId)
        JSON.parse(req.body)
        res.sendStatus(201)
    } catch(e) {
        res.sendStatus(500) && next(error)
    }
};

exports.get_queues = function(req, res, next) {
    try {
        res.status(200).json({
            'entities': [{'name': 'Carnival Queue', 'index': 1, 'waited': 10},
                {'name': 'Concession Stand Queue', 'index': 2, 'waited': 8},
                {'name': 'Bumper Cars Queue', 'index': 3, 'waited': 4}]
        })
    } catch(e) {
        res.sendStatus(500) && next(error)
    }
};

exports.get_queue_stats = function(req, res, next) {
    try {
        res.status(200).json({
            'enqueued': 37,
            'serviced': 23,
            'deferrals': 8,
            'avg': 12,
            'abandonments': 2,
            'noshows': 0
        })
    } catch(e) {
        res.sendStatus(500) && next(error)
    }
};

exports.end_queue = function (req, res, next) {
    try {
        return null
    } catch(e) {
        res.sendStatus(500) && next(error)
    }
}

exports.pause_queue = function (req, res, next) {
    try {
        return null
    } catch(e) {
        res.sendStatus(500) && next(error)
    }
}

exports.edit_queue = function (req, res, next) {
    try {
        return null
    } catch(e) {
        res.sendStatus(500) && next(error)
    }
}
