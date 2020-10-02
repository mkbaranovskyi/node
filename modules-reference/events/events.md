# Events

- [Events](#events)
	- [Basics](#basics)
	- [Error handling](#error-handling)
		- [Async errors](#async-errors)
	- [Some often used events](#some-often-used-events)
		- [HTTP events](#http-events)

***


```javascript
const EventEmitter = require('events')

const emitter = new EventEmitter()

emitter.on('boo', function (...args){
	console.log(args)	// will fire 3 times
})
.once('boo', () => {
	console.log('once')	// will fire 1 time
})

emitter.emit('boo', 'arg1', 'arg2')
emitter.emit('boo', 'arg1', 'arg2')
emitter.emit('boo', 'arg1', 'arg2')
```

![](img/2020-09-21-18-18-55.png)

***


## Basics

`emitter` methods:

- **`on`**`(type, listener, [options])`: sets listener.
- **`off`**`(type, listener)`: removes listener.
- **`once`**`(type, listener, [options])` : sets listener that will only fire once.
- **`removeListener`**`(eventName, listener)`: removes the specified handler (if multiple instances were attached, must be called multiple times to remove them all).
- **`removeAllListeners`**`([type])`: if *type* is specified, removes all registered listeners of this type, otherwise - **all** listeners altogether.
- **`listenerCount`**`(type)`: returns the number of listeners of the type.
- **`eventNames`**`()`: returns an array of **types** for which there are listeners registered.
- **`listeners`**`(type)`: returns a copy of the handlers array for the type.
- **`prependListener`**`(type, listener)`: adds a listener at the **beginning** of the listeners array (the default behavior is to add them to the end).

All of the above methods return `emitter` and can be chained.

The `eventEmitter.emit()` method allows an **arbitrary set of arguments** to be passed to the listener functions. 

When an **ordinary** listener function is called, `this === emitter`

The EventEmitter calls all listeners **synchronously** in the order in which they were registered. We can enforce **asynchronity** using `setImmediate(callback)`.

The values they return are **ignored**.

***


## Error handling

Add the `error` handler to your emitter.

```js
emitter.on('error', err => {
	console.log('There was an error: ', err)
})

emitter.emit('error', new Error('whoops!'))
// Prints: whoops! there was an error
```

You can also add `uncaughtException` handler to `process` to handle uncaught errors. 

```js
process.on('uncaughtException', (err) => {
	console.log('Uncaught error: ', err)
})
```

***


### Async errors

```js
const emitter = new EventEmitter({ captureRejections: true })

emitter.on('something', async (value) => {
	throw new Error('kaboom')
})

emitter.on('error', console.log)

emitter.emit('something')
```

***



## Some often used events

### HTTP events

Type|Description
-|-
`abort`|Emitted when the request has been aborted by the client.
`response`|Emitted when a response is received to this request. This event is emitted only once.
`timeout`|Emitted when the underlying socket times out from inactivity. This only notifies that the socket has been idle. The request must be aborted manually.
`close`|Emitted when the server closes.
`request`|Emitted each time there is a request. There may be multiple requests per connection.
`finish`|Response headers and body have been sent completely.