const express = require('express')
const app = express()
const path = require('path')

// Body-parsing middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(express.static(path.join(__dirname, 'views')))

// Pug
app.get('/', (req, res, next) => {
	const articles = [
		{
			id: 1,
			title: 'Article One',
			author: 'Max Bar',
			body: 'This is article one'
		},
		{
			id: 2,
			title: 'Article Two',
			author: 'Donny Darko',
			body: 'This is article one'
		},
		{
			id: 3,
			title: 'Article Three',
			author: 'Maria Db',
			body: 'This is article one'
		}
	]

	res.sendFile(path.join(__dirname, 'views/index.html'))

	// res.render('index', {
	// 	title: 'Hey',
	// 	message: 'Hello there!',
	// 	articles
	// }, (err, html) => {
	// 	if(err) {
	// 		next(err)
	// 	}
	// 	res.send(html)
	// })
})

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
	res.render('404')
})

module.exports = app