// To get rid of isolatedModules TS error
export {}

exports.create_queue_form = function(req, res) {
    console.log(req.params.organizerId)
    JSON.parse(req.body)
    res.send('POST request to the homepage')
};

exports.summon_enqueued = function(req, res) {
    res.status(200).json({
        'name': 'The organizer name',
        'address': 'The venue',
        'time': '9:52',
    })
};

exports.get_enqueued = function(req, res) {
    res.status(200).json({
        'entities': [{'name': 'Joe', 'index': 1, 'waited': 10},
            {'name': 'Ann', 'index': 2, 'waited': 8},
            {'name': 'Jasmine', 'index': 3, 'waited': 4},
            {'name': 'Flawnson', 'index': 4, 'waited': 1}]
    })
};

exports.get_queues = function(req, res) {
    res.status(200).json({
        'entities': [{'name': 'Carnival Queue', 'index': 1, 'waited': 10},
            {'name': 'Concession Stand Queue', 'index': 2, 'waited': 8},
            {'name': 'Bumper Cars Queue', 'index': 3, 'waited': 4}]
    })
};


exports.get_queue_stats = function(req, res) {
    res.status(200).json({
        'enqueued': 37,
        'serviced': 23,
        'deferrals': 8,
        'avg': 12,
        'abandonments': 2,
        'noshows': 0
    })
};
