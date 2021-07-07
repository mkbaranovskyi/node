const mongoose = require('mongoose')
const { connection } = mongoose

module.exports = function initConnection(cb) {
	connection.on('error', () => console.error('Connection error:'))

	connection.once('open', () => {
		cb()
	})

	mongoose.connect(
		'mongodb://localhost:27017/TrackTest',
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false
		},
		(err) => {
			if (err) return console.error(err)
		}
	)
}
