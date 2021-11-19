// @ts-nocheck to get err as uninferable type
// @ts-ignore
const mainController = require('../controllers/mainController.ts');

const app = require('express')()
const port = 8080
const cors = require('cors');

app.use(cors())

app.get('/', (req, res) => {
    res.redirect('/api')
})
app.use('/api', mainController)

app.listen(port, function(err){
    if (err) console.log(err);
    console.log("Server listening on PORT", port);
});
