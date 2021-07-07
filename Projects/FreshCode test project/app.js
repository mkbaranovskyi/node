const http = require('http')
const express = require('express')
const app = express()
const server = http.createServer(app)
const PORT = process.env.PORT || 3000

const { Schema, model } = require('mongoose')
const { postData, reqOptions, reqCallback } = require('./src/postData')
const initConnection = require('./initConnection')
const { fromNode } = require('bluebird')

// Run the main function
initConnection(run)

const TrackSchema = new Schema(
	{
		title: String
	},
	{ versionKey: false } // deletes the default `__v` field
)

const Track = model('Track', TrackSchema)

const tracks = [
	{ title: '01 - Tea for Two' },
	{ title: '123song' },
	{ title: '123Sum41' },
	{ title: '123Blink182' },
	{ title: 'The Offspring - All I want' },
	{ title: "The Adam's song" },
	{ title: "I'm not afraid" },
	{ title: '123Lose Yourself' },
	{ title: 'Empty Walls' },
	{ title: 'Toxicity' },
	{ title: '123War' },
	{ title: 'omgubuntu' },
	{ title: '1234123' },
	{ title: 'crazyfrog123' },
	{ title: '123StillWaiting' }
]

async function run() {
	// Run the server
	server.listen(PORT)

	try {
		// Delete all documents before adding the new ones to avoid accumulating them
		await Track.deleteMany({})
		await Track.insertMany(tracks)

		// Get our tracks
		const query = /^123/g
		const batchSize = 3
		let numOfReceivedBatches = 0

		while (true) {
			const batch = await Track.find({ title: query }, null, {
				skip: batchSize * numOfReceivedBatches,
				limit: batchSize
			})
			if (!batch.length) break
			numOfReceivedBatches++
			console.log(batch)

			for (const track of batch) {
				postData(track, reqOptions, reqCallback)
			}
		}
	} catch (err) {
		console.error(err)
	}
}

// === Handlers ===

app.post('/meta/tracks', async (req, res, next) => {
	try {
		const trackName = req.header('TrackName')
		const body = []

		req.on('readable', () => {
			let chunk
			while (true) {
				chunk = req.read()
				if (chunk === null) {
					break
				}
				body.push(chunk)
			}
		})
		req.on('end', () => {
			console.log(body.join(''))
		})
		req.on('error', (err) => {
			console.error(err)
		})

		// ??? How to store body ???
		await Track.create({ title: trackName })

		res.send('Ok')
	} catch (err) {
		next(err)
	}
})

app.put('/meta/tracks', async (req, res, next) => {
	try {
		const trackId = req.header('TrackId')
		const body = []

		req.on('readable', () => {
			let chunk
			while (true) {
				chunk = req.read()
				if (chunk === null) {
					break
				}
				body.push(chunk)
			}
		})
		req.on('end', () => {
			console.log(body.join(''))
		})
		req.on('error', (err) => {
			console.error(err)
		})

		await Track.updateOne({ trackId }, JSON.parse(body))
		res.send('Updated')
	} catch (err) {
		next(err)
	}
})

app.delete('/meta/tracks/:trackId', async (req, res, next) => {
	try {
		const trackId = req.params.trackId
		await Track.deleteOne({ trackId })
		res.send('Deleted')
	} catch (err) {
		next(err)
	}
})

app.use((err, req, res, next) => {
	console.log('ACHTUNG!')
	console.log(err)

	if (!res.headersSent) {
		res.status(500).send(err.message)
	}
})
