const express = require('express')
const app = express()
const server = require('http').createServer(app)
const path = require('path')
const io = require('socket.io')(server)
const PORT = process.env.PORT || 5000

io.on('connection', (socket) => {
	console.log(socket.id) //
	console.log(socket.rooms) //
	socket.on('private message', (anotherSocketId, msg) => {
		socket.to(anotherSocketId).emit('private message', socket.id, msg)
	})
})

app.use(express.static(path.join(__dirname, 'public')))

server.listen(PORT)
