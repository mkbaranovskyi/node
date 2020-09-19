const http = require('http')
const app = require('./app')	// Express app
const PORT = process.env.PORT || 5000

app.set('view engine', 'pug')
app.set('views', './views')

app.use('/products', require('./api/routes/products'))

const server = http.createServer(app)

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
