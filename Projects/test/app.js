const express = require('express')
const fs = require('fs')
const path = require('path')
const util = require('util')
const mime = require('mime')
const stream = require('stream')
const pipeline = util.promisify(stream.pipeline)

const app = express()
const PORT = process.env.PORT || 5000
const server = require('http').createServer(app)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const fileUploads = new Map()

app.get('/status', (req, res, next) => {
	res.send(String(fileUploads.get(req.headers['file-id']) || 0))
})

app.post('/upload', async (req, res, next) => {
	try {
		const startByte = req.headers['start-byte']
		const mimeType = mime.getExtension(req.headers['file-type'])
		// Filename + mimeType
		global.fileName =
			path.join(
				__dirname,
				'uploads',
				decodeURIComponent(req.headers['file-id'])
			) + `.${mimeType}`

		// If this is not the 1st upload and the recorded starting bytes don't match - error
		if (!startByte && +startByte !== fileUploads.get(req.headers['file-id'])) {
			console.error("BYTES DON'T MATCH!")
			console.log('Map: ', fileUploads.get(req.headers['file-id']))
			return res.status(400).send('Wrong starting byte')
		}

		await pipeline(req, fs.createWriteStream(global.fileName, { flags: 'a' }))

		res.status(200).send('Upload finished')
	} catch (err) {
		if (err.code === 'ERR_STREAM_PREMATURE_CLOSE') {
			res.status(500).send(`${err.code}`)
		} else {
			next(err)
		}
	} finally {
		// Remember the uploaded data size
		fileUploads.set(req.headers['file-id'], fs.statSync(global.fileName).size)
	}
})

app.use(express.static('./public'))

server.listen(PORT)
