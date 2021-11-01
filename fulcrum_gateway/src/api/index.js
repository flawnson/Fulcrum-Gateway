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
