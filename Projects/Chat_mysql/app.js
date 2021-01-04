const http = require('http')
const express = require('express')
const app = express()
const server = http.createServer(app)
const io = require('socket.io')(server)
const path = require('path')
const mysql = require('mysql2')
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

const connection = mysql
	.createConnection({
		host: 'localhost',
		user: 'root',
		password: 'Rfgkzrfgkz',
		database: 'Chat'
	})
	.promise()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

io.on('connection', async (socket) => {
	socket.on('chat messages', (msg) => {
		console.log(msg)
		sqlInsertMessages(msg)
		socket.broadcast.emit('chat messages', [msg])
	})

	socket.on('disconnect', () => {
		console.log('user disconnected')
	})

	// Send the existing chat history to the client
	let chatHistory = await sqlGetMessages(0)
	// Leave only the info the user needs
	chatHistory = chatHistory.map((record) => {
		const { Username, Message, PostDate } = record
		return { Username, Message, PostDate }
	})
	// console.log(chatHistory)
	socket.emit('chat messages', chatHistory)
})

async function sqlInsertMessages(body) {
	const sql_params = [body.Username, body.Message]
	const sql_query =
		'INSERT Messages (Username, Message, PostDate) VALUES (?, ?, NOW())'
	const sql_result = await connection.execute(sql_query, sql_params)
	return sql_result
}

async function sqlGetMessages(lastMessageId) {
	const sql_params = [lastMessageId]
	const sql_query = 'SELECT * FROM Messages WHERE ID > ?;'
	const sql_result = await connection.execute(sql_query, sql_params)
	return sql_result[0]
}

app.use(express.static(path.join(__dirname, 'public')))

server.listen(PORT)
