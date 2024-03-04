const express = require('express')
const cors = require('cors')
const proxy = require('express-http-proxy')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/customer', proxy('http://localhost:3001'))
app.use('/products', proxy('http://localhost:3002'))
app.use('/shopping', proxy('http://localhost:3003'))

app.listen(8000, () => {
  console.log('Shopping Microservice is running on port 8000')
})
