const express = require('express')
const fs = require('fs')
const util = require('util')
const events = require('events')
const stream = require('stream')
const {
	Readable,
	once
} = stream
const {
	promisify
} = require('util')
const finished = promisify(stream.finished)
const {
	check,
	validationResult,
	matchedData
} = require('express-validator')
const multer = require('multer')
const upload1 = multer({
	dest: 'uploads/'
})
const upload2 = multer({
	dest: 'uploads/'
})
const pipeline = promisify(require('stream').pipeline)
const stat = promisify(fs.stat)

const router = express.Router()

// router.get('/', async (req, res, next) => {
// 	const filePath =
// 		__dirname +
// 		'/Roman Messer feat. Roxanne Emery - Lost & Found (Extended Full Fire Mix)-nBIm4v8HFPM.webm'
// 	const r = fs.createReadStream(filePath)
// 	const fileSize = (await stat(filePath)).size

// 	res.writeHead(200, {
// 		'Content-Type': 'video/webm',
// 		'Content-Length': fileSize
// 	})

// 	// await pipeData(r, res)
// })

router.get('/form', (req, res, next) => {
	console.log(req.query)
	res.send(req.query)
})

router.post('/form',
	upload1.single('send-file'),
	(req, res, next) => {
		console.log(req.file)
		// res.sendFile('index.html')
	}
)

async function pipeData(origin, dest) {
	try {
		const write = buildWrite(dest)
		for await (const chunk of origin) {
			await write(chunk)
		}
		await finished(dest)
	} catch (err) {
		console.error(err)
	}
}

function buildWrite(stream) {
	let streamError = null
	stream.on('error', (err) => {
		streamError = err
	})

	return function (chunk) {
		if (streamError) {
			return Promise.reject(streamError)
		}

		const isDrained = stream.write(chunk)

		if (!isDrained) {
			return once(stream, 'drain')
		}

		return Promise.resolve()
	}
}

module.exports = router