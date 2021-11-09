import queuerRouter from './queuers'
import organizerRouter from './organizers'

const app = require('express')()
const port = 8080
const cors = require('cors')

app.use(cors())

app.use(queuerRouter);
app.use(organizerRouter);

app.listen(port, function(err){
    if (err) console.log(err);
    console.log("Server listening on PORT", PORT);
});


