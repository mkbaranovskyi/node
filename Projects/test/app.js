const http = require('http')
const express = require('express')
const app = express()
const server = http.createServer(app)
const PORT = process.env.PORT || 3000

const mongoose = require('mongoose')
const { connection, Schema } = mongoose
const { postData, reqOptions, reqCallback } = require('./src/postData')

// app.use(express.json())
// app.use(express.urlencoded({ extended: false }))

// Connect to the DB: 27017 is the default MongoDB port, `test` - our DB name
mongoose.connect(
	'mongodb://localhost:27017/TrackTest',
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false /* removes some deprecated syntax */
	},
	(err) => {
		if (err) console.error(err)
		server.listen(PORT)
	}
)

connection.on('error', console.error.bind(console, 'connection error:'))
connection.once('open', () => {
	console.log('Connected!')
})

// Schema
const TrackSchema = new Schema(
	{
		title: String
	},
	{ versionKey: false } // deleting the default `__v` field
)

// Model - based on the Schema
const Track = mongoose.model('Track', TrackSchema)

const tracks = [
	{
		title: '01 - Tea for Two'
	},
	{
		title: '123song'
	},
	{
		title: '123Sum41'
	},
	{
		title: '123Blink182'
	},
	{
		title: 'The Offspring - All I want'
	},
	{
		title: "The Adam's song"
	},
	{
		title: "I'm not afraid"
	},
	{
		title: '123Lose Yourself'
	},
	{
		title: 'Empty Walls'
	},
	{
		title: 'Toxicity'
	},
	{
		title: '123War'
	},
	{
		title: 'omgubuntu'
	},
	{
		title: '1234123'
	},
	{
		title: 'crazyfrog123'
	},
	{
		title: '123StillWaiting'
	}
]

run()

async function run() {
	try {
		// Delete all documents before adding the new ones
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

app.post('/meta/tracks', async (req, res, next) => {
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

	await Track.create({ title: trackName })
	res.send('Ok')
})

app.put('/meta/tracks', async (req, res, next) => {
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
})

app.delete('/meta/tracks/:trackId', async (req, res, next) => {
	const trackId = req.params.trackId
	await Track.deleteOne({ trackId })
	res.send('Deleted')
})
