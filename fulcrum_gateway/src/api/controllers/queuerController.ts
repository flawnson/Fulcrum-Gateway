
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

