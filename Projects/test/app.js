const { is } = require('bluebird')
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const path = require('path')
const io = require('socket.io')(server)
const PORT = process.env.PORT || 5000

io.on('connection', (socket) => {
	console.log('a user connected')

	socket.on('chat message', (msg) => {
		console.log(msg)
		socket.broadcast.emit('chat message', msg) // broadcast
	})

	socket.on('disconnect', () => {
		console.log('user disconnected')
	})
})

app.use(express.static(path.join(__dirname, 'public')))

server.listen(PORT)
