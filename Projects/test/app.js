// const express = require('express')
const fs = require('fs')
const path = require('path')
const util = require('util')
// const mime = require('mime')
const stream = require('stream')
// const multer = require('multer')
// const { param } = require('express-validator')
const pipeline = util.promisify(stream.pipeline)

// const app = express()
// const PORT = process.env.PORT || 6000
// const server = require('http').createServer(app)

// const storage = multer.diskStorage({
// 	destination: function (req, file, cb) {
// 		cb(null, path.join(__dirname, 'uploads'))
// 	},
// 	filename: function (req, file, cb) {
// 		cb(null, file.originalname + '-' + Date.now())
// 	}
// })
// const upload = multer({ storage })

// app.use(express.json())
// app.use(express.urlencoded({ extended: false }))

// const fileUploads = new Map()

// app.get('/status', (req, res, next) => {
// 	res.send(String(fileUploads.get(req.headers['file-id']) || 0))
// })

const { Readable, Writable } = stream

class MyWritable extends Writable {
	constructor(filename) {
		super()
		this.filename = filename
	}

	_construct(cb) {
		fs.open(this.filename, 'a', (err, fd) => {
			if (err) {
				cb(err)
			} else {
				this.fd = fd
				cb()
			}
		})
	}

	_write(chunk, encoding, next) {
		const data = chunk.slice(0, chunk.length - 1) + '!!!\n'

		fs.write(this.fd, data, (err, bytesWritten, buffer) => {
			if (err) {
				return console.error(err)
			}
			console.log('Written!')
		})

		next()
	}

	_destroy(err, cb) {
		if (this.fd) {
			fs.close(this.fd, (er) => cb(er || err))
		} else {
			cb(err)
		}
	}
}
// const r = new Readable()
// r._read = () => {}

const w = new MyWritable(path.join(__dirname, 'uploads', 'text.txt'))

// r.push('Hi\n')
// r.push('Ho\n')

pipeline(process.stdin, w)

// app.use(express.static('./public'))

// server.listen(PORT)
