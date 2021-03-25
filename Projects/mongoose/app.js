const express = require('express')
const app = express()
const server = require('http').createServer(app)
const PORT = process.env.PORT || 5000

const mongoose = require('mongoose')
const { connection, Schema, Model, Document } = mongoose

mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true })

mongoose.set('useCreateIndex', true)

connection.on('error', console.error.bind(console, 'connection error:'))
connection.once('open', () => {
	console.log('Connected!')
})

const userSchema = new Schema(
	{
		name: {
			type: String,
			uppercase: true
		},
		age: {
			type: Number,
			index: true
		},
		gender: String
	},
	{ versionKey: false }
)

userSchema.index({ age: -1, name: 1 })

const User = mongoose.model('User', userSchema)

run()

async function run() {
	try {
		await User.create({ name: 'Vlad', age: 20 })
		await User.create({ name: 'Vlad', age: 20 })
		await User.create({ name: 'Vlad', age: 20 })

		// const result = await User.deleteMany({ name: 'Vlad' }, { name: 'Vladik' })
		// console.log(result)
	} catch (err) {
		console.error(err)
		mongoose.disconnect()
	}
}

server.listen(PORT)
