// @ts-nocheck to get rid of req and res uninferable types

exports.get_enqueued = function(req, res, next) {
    try {
        res.status(200).json({
            'entities': [{'queuerId': 1234567890, 'name': 'Joe', 'index': 1, 'waited': 10, 'online': true},
                         {'queuerId': 1324354657, 'name': 'Ann', 'index': 2, 'waited': 8, 'online': false},
                         {'queuerId': 9876543210, 'name': 'Jasmine', 'index': 3, 'waited': 4, 'online': true},
                         {'queuerId': 6210001000, 'name': 'Flawnson', 'index': 4, 'waited': 1, 'online': true}]
        })
    } catch(e) {
        res.sendStatus(500) && next(error)
    }
};

exports.get_serviced = function(req, res, next) {
    try {
        res.status(200).json({
            'entities': [{'name': 'Ramy', 'index': 1, 'waited': 2}]
        })
    } catch(e) {
        res.sendStatus(500) && next(error)
    }
};

exports.get_abandoned = function(req, res, next) {
    try {
        res.status(200).json({
            'entities': [{'name': 'Michelle', 'index': 2, 'waited': 3}]
        })
    } catch(e) {
        res.sendStatus(500) && next(error)
    }
};

exports.get_enqueued_stats = function (req, res, next) {
    try {
        res.status(200).json({
            'enqueued': 34,
            'serviced': 23,
            'deferrals': 8,
            'avg': 10,
            'abandonments': 2,
            'noshows': 0
        })
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

