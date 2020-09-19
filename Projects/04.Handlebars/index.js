const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const members = require('./Members')

const app = express()

// Handlebars Middleware
app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')

// Body Parser Middleware
app.use(express.json())
app.use(express.urlencoded({extended: false}))

// Homepage Route
app.get('/', (req, res) => res.render('index', {
	title: 'Member App',
	members
}))

// Since we have `handlebars` handler above, it will run and not the static one below

// Set static folder, so our server will be able to automatically load proper `.html` files when user accesses `/pagename.html` URL
app.use(express.static(path.join(__dirname, 'public')))

// Members API Routes
app.use('/api/members', require('./routes/api/members'))

// Error handling middleware
app.use((error, req, res, next) => {
	if (res.headersSent) {
		return next(error)
	}
	
	res.status(error.status || 500)
	res.json({
		error: {
			message: error.message
		}
	})
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server started at port ${PORT}`))

