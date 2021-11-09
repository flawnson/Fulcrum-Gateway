// @ts-nocheck to get rid of req and res uninferable types
// To get rid of isolatedModules TS error
export {}

// Display list of all Authors.
exports.get_queuer_stats = function(req, res) {
    console.log(req.params.queuerId)
    res.status(200).json({
        'index': 2,
        'eta': 10,
        'waited': 8,
        'avg': 9
    })
};

