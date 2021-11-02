const app = require('express')()
const port = 8080
const cors = require('cors')

app.use(cors())

app.get('/organizer/stats', (req, res) => {
    res.status(200).json({
        'enqueued': 37,
        'serviced': 23,
        'deferrals': 8,
        'avg': 12,
        'abandonments': 2,
        'noshows': 0
    })
})

app.get('/queuer/stats', (req, res) => {
    res.status(200).json({
        'index': 2,
        'eta': 10,
        'waited': 8,
        'avg': 9
    })
})


app.get('/queue', (req, res) => {
    res.status(200).json({
        'users': [{'Joe': {'index': 1, 'waited': 10}},
                  {'Ann': {'index': 2, 'waited': 8}},
                  {'Jasmine': {'index': 3, 'waited': 4}},
                  {'Flawnson': {'index': 4, 'waited': 1}}]
    })
})

app.get('/queuer/summon', (req, res) => {
    res.status(200).json({
        'name': 'The organizer name',
        'address': 'The venue',
        'time': '9:52',
    })
})


app.post('/organizer/form', function (req, res) {
    JSON.parse(req.body)
    res.send('POST request to the homepage')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
