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

const multer = require('multer')
const storage = multer.diskStorage({
	destination(req, file, cb) {
		cb(null, 'uploads')
	},
	filename(req, file, cb) {
		console.log('filename')
		// leaving the original name will make the duplicated overwrite the old files
		cb(null, file.originalname)
	}
})
const upload = multer({
	storage,
	limits: {
		fileSize: 1e10 // 10 GB
	},
	fileFilter(req, file, cb) {
		return cb(null, true)
	}
})

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const fileUploads = new Map()

app.get('/status', (req, res, next) => {
	console.log(fileUploads)
	res.send(String(fileUploads.get(req.headers['file-id']) || 0))
})

app.post(
	'/upload',
	/*upload.single('sendfile'),*/ async (req, res, next) => {
		try {
			global.fileId = req.headers['file-id']
			const mimeType = mime.getExtension(req.headers['file-type'])
			// Filename + mimeType
			global.fileName =
				path.join(__dirname, 'uploads', global.fileId) + `.${mimeType}`
			const startByte = req.headers['start-byte']

			// If this is not the 1st upload and the recorded starting bytes don't match - error
			if (!startByte && +startByte !== fileUploads.get(global.fileId)) {
				console.error("BYTES DON'T MATCH!")
				console.log('startByte: ', startByte)
				console.log('Map: ', fileUploads.get(global.fileId))
				return res.status(400).send('Wrong start byte')
			}

			await pipeline(req, fs.createWriteStream(global.fileName, { flags: 'a' }))

			res.status(200).send('Upload finished')
		} catch (err) {
			console.error(err)
			if (err.code === 'ERR_STREAM_PREMATURE_CLOSE') {
				res.send(`${fileSize}`)
			} else {
				next(err)
			}
		} finally {
			// Remember the uploaded data size
			fileUploads.set(global.fileId, fs.statSync(global.fileName).size)
		}
	}
)

app.use(express.static('./public'))

server.listen(PORT)
