// @ts-nocheck to get rid of req and res uninferable types

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

