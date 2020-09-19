const http = require('http')
const app = require('./app')	// Express app
const PORT = process.env.PORT || 5000

app.use('/products', require('./api/routes/products'))

const server = http.createServer(app)

app.use((req, res, next) => {
	res.send('Finish')
})

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
