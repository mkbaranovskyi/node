const http = require('http')
const express = require('express')
const app = express()
const server = http.createServer(app)
const io = require('socket.io')(server)
const path = require('path')
const fs = require('fs')
const validator = require('validator')
const crypto = require('crypto')

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

const hash = crypto.createHash('sha256')
const r = fs.createReadStream(
	'James Kitcher & Adam Taylor - The Spirit Within-ZscCG-_WuH0.webm'
)
let data = []

r.on('readable', () => {
	let chunk
	while ((chunk = r.read()) !== null) {
		data.push(chunk)
	}
})
r.on('end', () => {
	console.log(hash.update(data.join('')).digest())
})

io.on('connection', (socket) => {
	socket.on('getRooms', async () => {
		const roomList = await SqlMethods.getRooms()
		socket.emit('getRooms', roomList)
	})

	socket.on('postMessage', async (msg) => {
		const roomExists = await SqlMethods.checkRoomExists(msg.optionValue)
		if (!roomExists) {
			console.log("Room doesn't exist!")
			return
		}

		SqlMethods.insertMessage(msg)

		socket.broadcast.emit('getMessages', [msg])
	})

	socket.on('disconnect', () => {
		// User counter should be here
		console.log('user disconnected')
	})

	socket.on('addNewRoom', async (roomName) => {
		const roomHash = crypto.createHash('md5').update(roomName).digest('hex')
		const roomExists = await SqlMethods.checkRoomExists(roomHash)
		if (roomExists) {
			console.log('The room already exists!')
			socket.emit('roomRejected', {
				roomName,
				reason: 'This room already exists!'
			})
			return
		}
		await SqlMethods.createNewRoom(roomHash)
		await SqlMethods.addRoomToTheList({ optionValue: roomHash, roomName })

		socket.emit('updateHistory', {
			roomName,
			optionValue: roomHash,
			nextMessageID: 0
		})
		socket.emit('roomCreated', { roomName, optionValue: roomHash })
	})

	socket.on('getMessages', async (options) => {
		const roomExists = await SqlMethods.checkRoomExists(options.optionValue)
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
			return { Username, Message, PostDate, optionValue: options.optionValue }
		})

		socket.emit('getMessages', chatHistory)
		socket.emit('updateHistory', {
			roomName: options.roomName,
			optionValue: options.optionValue,
			nextMessageID: maxID + 1
		})
	})
})

app.use(express.static(path.join(__dirname, 'public')))

server.listen(PORT)
