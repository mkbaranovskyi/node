const express = require('express')
const app = express()
const server = require('http').createServer(app)
const PORT = process.env.PORT || 5000

const validator = require('validator')
const mongoose = require('mongoose')
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

// ===== Schema =====

const userSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true, // bjilt-in sanitizer
			minLength: 1, // built-in validator
			maxLength: 32
		},
		email: {
			type: String,
			required: true,
			lowercase: true,
			trim: true,
			validate(value) {
				// custom validator
				if (!validator.isEmail(value)) {
					throw new Error('Please provide a correct email')
				}
			}
		},
		password: {
			type: String,
			required: true,
			trim: true,
			minLength: 8,
			validate(value) {
				if (value.toLowerCase().includes('password')) {
					throw new Error("Don't use weak passwords!")
				}
			}
		},
		age: {
			type: Number,
			min: 0
		},
		phone: {
			type: Number,
			trim: true,
			validate(value) {
				if (!validator.isMobilePhone(value)) {
					throw new Error('Please provide the correct phone number!')
				}
			}
		}
	},
	{ versionKey: false }
)

userSchema.virtual('fullName').get(function () {
	return `${this.name}, ${this.age} years`
})

userSchema.virtual('fullName').set(function (name) {
	const str = name.split(' ')
	this.firstName = str[0]
	this.lastName = str[1]
})

const User = mongoose.model('User', userSchema)

run()
async function run() {
	try {
		const user = await User.create({ name: 'U', email: 'max@bar.king', password: 'L_54Jsfle74K' })

		user.fullName = 'Thomas Anderson'
		console.log(user.fullName)
		console.log(user)

		await User.updateMany({ email: 'max@bar.king' }, { name: 'You' })

		await User.find().sort({ $natural: -1 }).limit(1)
	} catch (err) {
		console.error(err)
	}
}
