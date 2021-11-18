// @ts-nocheck to get err as uninferable type
// @ts-ignore
const graphqlController = require('./controller/graphqlController');

const app = require('express')()
const port = 8080
const cors = require('cors')

app.use(cors())

app.get('/', (req, res) => {
    res.redirect('/graphql')
})
app.use('/graphql', graphqlController)

app.listen(port, function(err){
    if (err) console.log(err);
    console.log("Server listening on PORT", port);
});
