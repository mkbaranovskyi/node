# Express Middleware

- [Express Middleware](#express-middleware)
	- [Sources](#sources)
	- [Intro](#intro)
	- [Important Middleware in Express](#important-middleware-in-express)
		- [Static folder](#static-folder)
		- [Body parser](#body-parser)
	- [Creating Middleware](#creating-middleware)
		- [Async handlers](#async-handlers)
	- [Error Handling](#error-handling)
		- [Sync Errors](#sync-errors)
		- [Async Errors](#async-errors)

***

## Sources

1. https://developer.okta.com/blog/2018/09/13/build-and-understand-express-middleware-through-examples
2. f

***


## Intro

Middleware functions are the intermediate handlers that have access to the request object `req`, the response object `res`, and the `next` middleware function in the application’s request-response cycle.

Middleware functions can:

- Execute any code.
- Make changes to the `request` and the `response` objects.
- End the request-response cycle.
- Call the `next` middleware function in the stack.

If a middleware function doesn't have the first `path` parameter provided, it will be called for **every** request.

If the current middleware function does not end the `request-response cycle`, it must call the `next` middleware function. Otherwise, the request will be left hanging.

![](img/2020-10-22-21-46-03.png)

```javascript
app.use((req, res, next) => {
	// full URL of the request
	console.log(`${req.protocol}://${req.get('host')}${req.originalUrl}`)
	next() // call the next middleware
})
```

**See more in the [routing](routing.md) chapter.**

***

We can chain middleware handlers into sub-stacks using comma and use arrays of handlers:

```javascript
// app.js
app.use(
	'/',
	require('./middle1'),
	require('./middle2'),
	[handler1, handler2],
	(req, res, next) => {}
)
```

***

**Important note!** `res.send()` or `res.json()` does not equal `return`: it doesn't finish the function execution! This means that omitting `else` might result in error. Either always use `else` for the rest of the callback after `if`, or just add `return` in the `if` to actually finish the function.

***


## Important Middleware in Express

### Static folder

Middleware that returns pages requested by `page.html`-like request automatically:

```javascript
app.use(express.static(path.join(__dirname, 'public')))
```

- Requests to `/` and `/index.html` will be responded with `public/index.html`.
- Requests to `/about.html` will be responded with `public/about.html`.

![](img/2020-05-19-17-13-29.png)

***

### Body parser

To be able to use request bodies from `req.body` we should use a body parser middleware before that:

```javascript
// app.js
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
```

To parse `FormData`, use [multiparty](https://www.npmjs.com/package/multiparty)

To handle incoming files (from `<input type="file">`), use [multer](https://www.npmjs.com/package/multer) (see the corresponding lesson).

***


## Creating Middleware

The basic requirements to middleware are:

1. Accepts 3 parameters
2. The 3rd one is a function
3. Call that function

```js
const express = require('express')
const app = express()

function myMid(a, b, c) {
	console.log('Mid worked')
	c()
}

app.get('/', myMid, (req, res, next) => {
	res.send('End')
})

app.listen(3000)
```

***


### Async handlers

You can use async handlers freely. Just `try..catch` them to handle the async errors and pass them to Express.

```javascript
app.use('/', async (req, res, next) => {
	try {
		await new Promise((resolve, reject) => setTimeout(reject, 1000))
		res.end('Ok')
	} catch (err) {
		res.end('Error happened!') // handle yourself
		next(err) // throw to the Express default handler to catch it
	}
})
```

***


## Error Handling

### Sync Errors

Express catches all sync errors that occur while running route handlers and middleware. 

```js
const express = require('express')
const app = express()

app.get('/', (req, res, next) => {
	throw new Error('BROKEN')
})

app.listen(3000)
```

How do we know the app didn't crush? We send 2 requests and receive 2 responses (notifying about the error) - this means the server is still listening and responding.

![](img/2020-10-22-22-03-46.png)

***

### Async Errors

Async errors should be caught manually and thrown to Express using `next(err)`.

```js
const express = require('express')
const app = express()

app.get('/', async (req, res, next) => {
	try {
		throw new Error('BROKEN')
	} catch (err) {
		next(err)
	}
})

app.listen(3000)
```

If you don't catch this error, your server **won't** crush but the client **will** hang w/o response.

***

The same stands for planned code

```js
const express = require('express')
const app = express()

app.get('/', (req, res, next) => {
	setTimeout(() => {
		try {
			throw new Error('BROKEN')
		} catch (err) {
			next(err)
		}
	}, 1000)
})

app.listen(3000)
```

![](img/2020-10-22-22-55-05.png)

If you don't catch this error, your app **will** crush

![](img/2020-10-22-22-56-39.png)