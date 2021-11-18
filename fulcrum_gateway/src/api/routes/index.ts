// @ts-nocheck to get err as uninferable type
// @ts-ignore
const queuerRouter = require('./queuers.ts')
const organizerRouter = require('./organizers.ts')
const queuesRouter = require('./queues.ts')

const app = require('express')()
const port = 8080
const cors = require('cors')

app.use(cors())

app.get('/', (req, res) => {
    res.status(200).json({
        "Hello": "there!"
    })
})
app.use(queuerRouter);
app.use(organizerRouter);
app.use(queuesRouter);

app.listen(port, function(err){
    if (err) console.log(err);
    console.log("Server listening on PORT", port);
});


