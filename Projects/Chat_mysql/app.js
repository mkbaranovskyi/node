const http = require('http')
const express = require('express')
const app = express()
const server = http.createServer(app)
const io = require('socket.io')(server)
const path = require('path')

const SqlMethods = require('./js/SqlMethods')

const multer = require('multer')
const { check, matchedData, validationResult } = require('express-validator')
const { pipeline } = require('stream/promises')
const PORT = process.env.PORT || 5000

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		console.log(file)
		cb(null, path.join(__dirname, 'uploads'))
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname)
	}
})
const upload = multer({ storage })

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

io.on('connection', (socket) => {
	socket.on('getRooms', async () => {
		const roomList = await SqlMethods.getRooms()
		socket.emit('getRooms', roomList)
	})

	socket.on('postMessage', async (msg) => {
		console.log(msg)

		const roomExists = await SqlMethods.checkRoomExists(msg.roomName)
		if (!roomExists) {
			console.log("Room doesn't exist!")
			return
		}

		SqlMethods.insertMessage(msg)

		socket.broadcast.emit('getMessages', [msg])
	})

	socket.on('disconnect', () => {
		console.log('user disconnected')
	})

	socket.on('addNewRoom', async (roomName) => {
		console.log(roomName)
		const roomExists = await SqlMethods.checkRoomExists(roomName)
		if (roomExists) {
			console.log('The room already exists!')
			socket.emit('roomRejected', {
				roomName,
				reason: 'This room already exists!'
			})
			return
		}
		await SqlMethods.createNewRoom(roomName)
		await SqlMethods.addRoomToTheList(roomName)

		socket.emit('roomCreated', roomName)
		socket.emit('updateHistory', {
			roomName,
			nextMessageID: 0
		})
	})

	socket.on('getMessages', async (options) => {
		console.log(options)
		const roomExists = await SqlMethods.checkRoomExists(options.roomName)
		if (!roomExists) {
			console.log("Room doesn't exist!")
			return
		}
		let chatHistory = await SqlMethods.getMessages(options)
		if (!chatHistory.length) {
			console.log('No new messages!')
			return
		}

		// Leave only the info the user needs
		let maxID = 0
		chatHistory = chatHistory.map((record) => {
			const { Username, Message, PostDate } = record
			if (record.ID > maxID) maxID = record.ID
			return { Username, Message, PostDate, roomName: options.roomName }
		})

		console.log(chatHistory)

		socket.emit('getMessages', chatHistory)
		socket.emit('updateHistory', {
			roomName: options.roomName,
			nextMessageID: maxID + 1
		})
	})
})

app.use(express.static(path.join(__dirname, 'public')))

server.listen(PORT)
