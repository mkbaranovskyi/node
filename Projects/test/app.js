const express = require('express')
const fs = require('fs')
const path = require('path')
const util = require('util')
const mime = require('mime')
const stream = require('stream')
const pipeline = util.promisify(stream.pipeline)
const { Transform } = stream

const app = express()
const PORT = process.env.PORT || 5000
const server = require('http').createServer(app)
// const uploadFolder = path.join(__dirname, 'uploads')

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
			const fileId = req.headers['file-id']
			const mimeType = mime.getExtension(req.headers['file-type'])
			// Filename + mimeType
			const fileName = path.join(__dirname, 'uploads', fileId) + `.${mimeType}`
			const startByte = req.headers['start-byte']

			// If this is not the 1st upload and the recorded starting bytes don't match - error
			if (!startByte && +startByte !== fileUploads.get(fileId)) {
				console.error("BYTES DON'T MATCH!")
				console.log('startByte: ', startByte)
				console.log('Map: ', fileUploads.get(fileId))
				return res.status(400).send('Wrong start byte')
			}

			// let chunks = new Transform()
			// let chunksLength = fileUploads.get(fileId) || 0

			let flag = 'a'
			if (!startByte) {
				console.log('FLAG: w')
				flag = 'w'
			}

			await pipeline(req, fs.createWriteStream(fileName, { flag }))

			fileUploads.delete(fileId)
			res.status(200).send('Upload finished')
		} catch (err) {
			console.error(err)
			if (err.code === 'ERR_STREAM_PREMATURE_CLOSE') {
				const fileSize = fs.statSync(fileName).size
				console.log(fileSize)

				fileUploads.set(fileId, fileSize)
				console.log(fileUploads)
				res.send(`${fileSize}`)
			} else {
				next(err)
			}
		}

		// req.on('readable', readData)

		// req.on('close', () => {
		// 	console.log('close')
		// })

		// req.on('break', () => {
		// 	console.log('break')

		// 	fs.writeFile(fileName, chunks.read(), { flag }, (err) => {
		// 		if (err) next(err)
		// 		// Make a note about this file
		// 		fileUploads.set(fileId, chunksLength)
		// 		console.log(chunksLength)

		// 		res.status(500).send('Uploaded interrupted')
		// 		// res.destroy()
		// 	})
		// })

		// req.on('end', () => {
		// 	console.log('end')
		// 	let flag = 'a'
		// 	if (!startByte) {
		// 		console.log('Flag: w')
		// 		flag = 'w'
		// 	}
		// 	fs.writeFile(fileName, chunks.read(), { flag }, (err) => {
		// 		if (err) next(err)

		// 		// console.log('done')
		// 		res.json({
		// 			fileId: fileId,
		// 			finished: true
		// 		})
		// 	})
		// })

		// function readData() {
		// 	let chunk
		// 	while ((chunk = req.read()) !== null) {
		// 		chunks.push(chunk)
		// 		chunksLength += chunk.length

		// 		// if (chunksLength >= 3e6) {
		// 		// 	req.removeListener('readable', readData)
		// 		// 	req.emit('break')
		// 		// 	break
		// 		// }
		// 	}
		// }
	}
)

app.use(express.static('./public'))

server.listen(PORT)
