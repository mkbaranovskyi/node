# RESTful API

Our project will have the following structure:

1. `server.js`: our main file, works as a central node for our project linking everything else together.
2. `app.js` stores our Express app, this is the main place for all the middleware and routers handling
3. Different routes

Server:

1. `Creates` a server from `http` or `Express app`
2. `Listens` to the server

Express app:

1. `Creates` an Express app
2. `Handles` requests with either own middleware or by redirecting to the specific routers
3. `Exports` the app

Routes:

1. `Creates` an Express mini-app
2. `Creates` a `Router()` instance
3. `Handles` requests
4. `Exports` the router
***

Full example:

```javascript
// server.js
const http = require('http')
const app = require('./app')	// Express app
const PORT = process.env.PORT || 5000

const server = http.createServer(app)

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`))

// app.js
const express = require('express')
const app = express()

app.use('/products', require('./api/routes/products'))	
app.use('/orders', require('./api/routes/orders'))

app.use((req, res, next) => {
	console.log(`Express middleware`)
	next()
})

module.exports = app

// products.js
const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
	res.status(200).json({
		message: 'GET to /products'
	})
})

router.post('/', (req, res, next) => {
	res.status(200).json({
		message: 'POST to /products'
	})
})

module.exports = router
```
***


