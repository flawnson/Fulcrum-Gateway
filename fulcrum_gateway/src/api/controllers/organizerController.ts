// @ts-nocheck to get rid of req and res uninferable types
// To get rid of isolatedModules TS error
export {}

exports.create_queue_form = function(req, res, next) {
    try {
        console.log(req.params.organizerId)
        JSON.parse(req.body)
        res.sendStatus(201)
    } catch(e) {
        res.sendStatus(500) && next(error)
    }
};

exports.summon_enqueued = function(req, res, next) {
    try {
        res.status(200).json({
        'name': 'The organizer name',
        'address': 'The venue',
        'time': '9:52',
        })
    } catch(e) {
        res.sendStatus(500) && next(error)
    }
};

exports.get_enqueued = function(req, res, next) {
    try {
        res.status(200).json({
            'entities': [{'name': 'Joe', 'index': 1, 'waited': 10},
                {'name': 'Ann', 'index': 2, 'waited': 8},
                {'name': 'Jasmine', 'index': 3, 'waited': 4},
                {'name': 'Flawnson', 'index': 4, 'waited': 1}]
        })
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

exports.get_enqueued_stats = function (req, res, next) {
    try {
        return null
    } catch(e) {
        res.sendStatus(500) && next(error)
    }
}
exports.kick_enqueued = function (req, res, next) {
    try {
        return null
    } catch(e) {
        res.sendStatus(500) && next(error)
    }
}

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
