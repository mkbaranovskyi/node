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
		this.fd = fd
	}
	_construct(callback) {
		fs.open(this.filename, (fd, err) => {
			if (err) {
				callback(err)
			} else {
				this.fd = fd
				callback()
			}
		})
	}
	_write(chunk, encoding, callback) {
		fs.write(this.fd, chunk, callback)
	}
	_destroy(err, callback) {
		if (this.fd) {
			fs.close(this.fd, (er) => callback(er || err))
		} else {
			callback(err)
		}
	}
}
// const r = new Readable()
// r._read = () => {}

const w = new MyWritable()
// Our stream implementation that will write chunks to a file adding '!!!' to each chunk
w._write = (chunk, encoding, next) => {
	const writableToDisk = fs.createWriteStream(
		path.join('uploads', `text.txt`),
		{ flags: 'a' }
	)

	// For some reason, the chunk adds `\n` at the end, so we cut it and then reattack after our addition
	const data = chunk.slice(0, chunk.length - 1) + '!!!\n'
	writableToDisk.write(data, (err) => console.error(err))

	// Calling `next()` is needed for the next iteration to occur
	next()
}

// r.push('Hi\n')
// r.push('Ho\n')

pipeline(process.stdin, w)

// app.use(express.static('./public'))

// server.listen(PORT)
