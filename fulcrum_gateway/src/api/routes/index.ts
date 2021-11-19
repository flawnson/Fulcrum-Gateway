// @ts-nocheck to get err as uninferable type
// @ts-ignore
<<<<<<< HEAD
const mainController = require('../controllers/mainController.ts');
=======
const queuerRouter = require('./queuers.ts')
const organizerRouter = require('./organizers.ts')
const queuesRouter = require('./queues.ts')
>>>>>>> 65a376765e36018173e705d8099d1a464ea10511

const app = require('express')()
const port = 8080
const cors = require('cors');

app.use(cors())

app.get('/', (req, res) => {
    res.redirect('/api')
})
<<<<<<< HEAD
app.use('/api', mainController)
=======
app.use(queuerRouter);
app.use(organizerRouter);
app.use(queuesRouter);
>>>>>>> 65a376765e36018173e705d8099d1a464ea10511

app.listen(port, function(err){
    if (err) console.log(err);
    console.log("Server listening on PORT", port);
});
