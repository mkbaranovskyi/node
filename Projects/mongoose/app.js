const express = require('express')
const app = express()
const server = require('http').createServer(app)
const PORT = process.env.PORT || 5000

const mongoose = require('mongoose')
const { runInContext } = require('vm')
const { connection, Schema } = mongoose

mongoose.set('debug', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

const dbURI = 'mongodb://localhost:27017/test'
const connectionOptions = {
	useNewUrlParser: true,
	useUnifiedTopology: true
}

connection.on('connecting', () => {
	console.log('Connecting to MongoDB...')
})
connection.on('connected', () => {
	console.log('MongoDB connected!')
})
connection.once('open', () => {
	console.log('MongoDB connection opened!')
})
connection.on('reconnected', () => {
	console.log('MongoDB reconnected!')
})
connection.on('disconnected', () => {
	console.log('MongoDB disconnected!')
	tryConnectingToDB()
})
connection.on('error', (error) => {
	console.error('Error in MongoDb connection: ' + error)
	mongoose.disconnect()
})

process.on('SIGINT', () => {
	mongoose.connection.close(function () {
		console.log('Mongoose default connection is disconnected due to application termination')
		process.exit(0)
	})
})

tryConnectingToDB()

function tryConnectingToDB() {
	try {
		mongoose.connect(dbURI, connectionOptions, (err) => {
			if (err) console.error(err)
			server.listen(PORT)
		})
	} catch (err) {
		console.log(err)
	}
}

const childSchema = new Schema({ name: 'string' })

const parentSchema = new Schema({
	children: [childSchema] /* array of subdocuments */,
	child: childSchema /* single nested subdocument */
})

const Parent = mongoose.model('Parent', parentSchema)

const parent = new Parent({ children: [{ name: 'Matt' }, { name: 'Sarah' }] })
parent.children[0].name = 'Matthew'

// `parent.children[0].save()` is a no-op. You need to save the parent document
parent.save()
