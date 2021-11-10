// @ts-nocheck to get rid of req and res uninferable types

exports.join_queue = function(req, res, next) {
    try {
        console.log(req.params.queueId)
        JSON.parse(req.body)
        res.sendStatus(201)
    } catch(e) {
        res.sendStatus(500) && next(error)
    }
};

exports.defer_queue = function(req, res, next) {
    try {
        console.log(req.params.queuerId)
        JSON.parse(req.body)
        res.sendStatus(201)
    } catch(e) {
        res.sendStatus(500) && next(error)
    }
};

exports.leave_queue = function(req, res, next) {
    try {
        console.log(req.params.queuerId)
        JSON.parse(req.body)
        res.sendStatus(201)
    } catch(e) {
        res.sendStatus(500) && next(error)
    }
};

exports.get_queuer_stats = function(req, res, next) {
    try {
        console.log(req.params.queuerId)
        res.status(200).json({
            'index': 2,
            'eta': 10,
            'waited': 8,
            'avg': 9
        })
    } catch(e) {
        res.sendStatus(500) && next(error)
    }
};

