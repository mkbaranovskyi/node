const express = require('express')
const app = express()
const server = require('http').createServer(app)
const PORT = process.env.PORT || 5000

const mongoose = require('mongoose')
const { connection, Schema, Model, Document } = mongoose

mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true })

connection.on('error', console.error.bind(console, 'connection error:'))
connection.once('open', () => {
	console.log('Connected!')
})

const userSchema = new Schema(
	{
		name: String,
		age: Number,
		gender: String
	},
	{ versionKey: false }
)

const User = mongoose.model('User', userSchema)

run()

async function run() {
	try {
		const result = await User.insertMany([
			{ name: 'max', age: 20 },
			{ name: 'user', age: NaN } // Error -> NOTHING will be inserted
		])
	} catch (err) {
		console.error(err)
		mongoose.disconnect()
	}
}

server.listen(PORT)
