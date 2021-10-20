const app = require('express')()
const port = 8080
const cors = require('cors')

app.use(cors())

 app.get('/queuer/stats', (req, res) => {
  res.status(200).json({
   'index': 2,
   'eta': 10,
   'waited': 8,
   'avg': 9
  })
})

app.listen(port, () => {
 console.log(`Example app listening at http://localhost:${port}`)
})
