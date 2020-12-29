const express = require('express')
const app = express()
const http = require('http')
const path = require('path')
const mysql = require('mysql2')

const { check, matchedData, validationResult } = require('express-validator')

const multer = require('multer')
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		console.log(file) // <--- Uploaded file info
		cb(null, path.join(__dirname, 'uploads'))
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname)
	}
})
const upload = multer({ storage })

const PORT = process.env.PORT || 5000
const server = http.createServer(app)

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

app.post('/send-message', upload.single('file'), async (req, res, next) => {
	try {
		console.log(req.body)
		const sql_params = [req.body.username, req.body.message]
		const sql_query =
			'INSERT Messages (Username, Message, PostDate) VALUES (?, ?, NOW())'
		const sql_result = await connection.execute(sql_query, sql_params)
		console.log(sql_result)

		res.send('Your message is delivered')
	} catch (err) {
		next(err)
	}
})

app.use(express.static(path.join(__dirname, 'public')))

server.listen(PORT)
