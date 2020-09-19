# Events

```javascript
const EventEmitter = require('events')

class MyEmitter extends EventEmitter {}

const emitter1 = new MyEmitter

emitter1.on('event', callback)

function callback(){
	console.log('Event fired!')
}

emitter1.emit('event')
```

The `eventEmitter.emit()` method allows an arbitrary set of arguments to be passed to the listener functions. When an ordinary listener function is called, **`this`** is intentionally set to reference the **`EventEmitter` instance** to which the listener is attached.

The EventEmitter calls all listeners **synchronously** in the order in which they were registered. 

