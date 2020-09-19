const EventEmitter = require('events')

class MyEmitter extends EventEmitter {}

const emitter1 = new MyEmitter
emitter1.on('event', () => console.log('Event fired!'))

emitter1.emit('event')