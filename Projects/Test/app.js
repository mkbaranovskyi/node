const http = require('http')

const PORT = process.env.PORT || 5000

http.createServer((req, res) => {
	res.end()
})
.listen(PORT, () => {
	console.log(`The server is running on port ${PORT}`)
})