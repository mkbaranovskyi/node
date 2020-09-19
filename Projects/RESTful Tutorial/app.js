const express = require('express')
const app = express()

// Body-parsing middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// CORS middleware
app.use((req, res, next) => {
	// allow cross-origin requests
	res.set("Access-Control-Allow-Origin", '*')
	// allow specific headers to be send with req
	res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
	// Browser usually send this request before `POST` or `PUT` to check what requests does the server actually accept
	
	if(req.method === 'OPTIONS'){
		res.set("Access-Control-Allow-Methods", 'GET, POST, PUT, DELETE, HEAD, PATCH')
		// if the browser if using 'options', that's where we finish our response, not need to go further
		return res.status(200).json({})
	}

	next()
})

// Routes
app.use('/products', require('./api/routes/products'))	
app.use('/orders', require('./api/routes/orders'))

// Error handling middleware
app.use((err, req, res, next) => {
	if(res.headersSent){
		return next(err)
	}

	res.status(err.status || 500)
	res.json({
		message: err.message || "Unexpected Error!"
	})
})

module.exports = app