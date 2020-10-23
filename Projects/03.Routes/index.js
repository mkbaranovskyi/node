const express = require('express')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 5001

// Body Parser Middleware
// app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Set static folder, so our server will be able to automatically load proper `.html` files when user accesses `/pagename.html` URL
app.use(express.static(path.join(__dirname, 'public')))

// Members API Routes
app.use('/api/members', require('./routes/api/members'))
// Form router
app.use('/form', require('./routes/api/form'))

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

app.listen(PORT, () => console.log(`Server started at port ${PORT}`))
