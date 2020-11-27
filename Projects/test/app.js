const express = require('express')
const fs = require('fs')
const path = require('path')
const util = require('util')
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
app.use(express.static('./public'))

app.post(
	'/upload',
	/*upload.single('sendfile'),*/ (req, res, next) => {
		let chunks = new Transform()
		req.on('readable', () => {
			let chunk
			while ((chunk = req.read()) !== null) {
				chunks.push(chunk)
				console.log(chunk)
			}
		})
		req.on('end', () => {
			const fileName = path.join(__dirname, 'uploads', 'file.pdf')
			fs.writeFile(fileName, chunks.read(), (err) => {
				if (err) next(err)
				console.log('done')
			})
		})
		// const img = new Transform()
		// req.on('data', (chunk) => {
		// 	img.push(chunk)
		// })
		// req.on('end', () => {
		// 	const filename = path.join(uploadFolder, 'img.jpg')
		// 	fs.promises.writeFile(filename, img.read()).catch(console.error)
		// })

		// pipeline(req, fs.createWriteStream(uploadFolder + '/file'))
		// req.on('data', (chunk) => {
		// 	body.push(chunk)
		// })

		// req.on('end', () => {
		// 	fs.writeFile(
		// 		path.join(__dirname, 'uploads', 'file'),
		// 		Buffer.concat(body),
		// 		() => {
		// 			console.log('The file is written')
		// 		}
		// 	)
		// })
		// console.log(req.headers['x-file-id'])
		res.send('ok')
	}
)

server.listen(PORT)
