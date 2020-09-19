const EventEmitter = require('events')
const uuid = require('uuid')
const path = require('path')
const fs = require('fs')

const logPath = path.join(__dirname, '/logs')

class MyEmitter extends EventEmitter {}
const emitter = new MyEmitter()

// if folder doesn't exist
if(!fs.existsSync(logPath)){
	// create folder
	fs.mkdirSync(logPath, err => {
		if(err) throw err
		console.log('Folder created!')
	})
}

// event listener
emitter.on('log', err => {
	console.log(`Log file updated successfully!`)
})

const intervalId = setInterval(() => {
	// dispatch event
	emitter.emit('log')
	// append logs
	fs.appendFileSync(logPath + '/log.txt', `\n${uuid.v4()}`)
}, 1000)

