# Performance and Security

- [Performance and Security](#performance-and-security)
	- [Sources](#sources)
	- [Use compression](#use-compression)
	- [Handle exceptions properly](#handle-exceptions-properly)
	- [Set NODE_ENV to “production”](#set-node_env-to-production)
	- [Ensure your app automatically restarts](#ensure-your-app-automatically-restarts)
	- [Other](#other)

***

## Sources

1. f
2. https://www.npmjs.com/package/helmet - helmet middleware
3. https://codeburst.io/what-is-prototype-pollution-49482fc4b638 - prototype pollution
4. https://github.com/cure53/DOMPurify - DOMPurity - XSS-attacks
5. https://github.com/jameslk/awesome-falsehoods - falsehoods programmers believe

## Use compression

```
npm i compression
```

```javascript
const compression = require('compression')

app.use(compression())
```

***


## Handle exceptions properly

If an uncaught exception gets thrown during the execution of your program, your program will crash.

1. Use `try..catch` and `.catch()` in promises.

```javascript
app.get('/planned', (req, res, next) => {
	setImmediate(() => {
		const jsonStr = req.query.params
		try {
			const jsonObj = JSON.parse(jsonStr)
			res.send('Success')
		} catch (e) {
			res.status(400).send('Invalid JSON string')
		}
	})
})

app.get('/promise', (req, res, next) => {
	queryDb()
		.then(data => makeCsv(data))
		.catch(next)
})

app.get('/async', async (req, res, next) => {
	try {
    await someOtherFunction()
  } catch (err) {
    console.error(err.message)
  }
})

app.use(function (err, req, res, next) {
	// handle error
})
```

You can also use wrapper functions to catch rejected promises:

```javascript
const asyncMiddleware = fn =>
	(req, res, next) => {
		Promise.resolve(fn(req, res, next))
			.catch(next)
	};

app.get('/', asyncMiddleware(async (req, res, next) => {
	const company = await getCompanyById(req.query.id)
	const stream = getLogoStreamById(company.id)
	stream.on('error', next).pipe(res)
}))
```

***

2. Catch uncaught exceptions using the `uncaughtException` event on the `process` object:

```js
process.on('uncaughtException', err => {
  console.error('There was an uncaught error', err)
  process.exit(1) //mandatory (as per the Node.js docs)
})
```

***


## Set NODE_ENV to “production”

https://nodejs.dev/learn/nodejs-the-difference-between-development-and-production

This enables all sorts of caching and improves performance **greatly**. 

1. Execute this (does not persist after the server restart):

```js
export NODE_ENV=production
```

2. Put it into your `bash_profile` to persist. 
3. Run your app using:

```bash
NODE_ENV=production node app.js
```


***


## Ensure your app automatically restarts

Make sure it restarts both if the app crashes and if the server itself crashes. 

- Using a process manager to restart the app (and Node) when it crashes.
- Using the init system provided by your OS to restart the process manager when the OS crashes. It’s also possible to use the init system without a process manager.

Process manager - restarts your app:

- StrongLoop: http://strong-pm.io/
- PM2: https://github.com/Unitech/pm2
- Forever: https://www.npmjs.com/package/forever
  
More info: 

https://expressjs.com/en/advanced/pm.html

https://expressjs.com/en/advanced/best-practice-performance.html#ensure-your-app-automatically-restarts

Init system - restarts the PM if the server restarts:

- systemd
- Upstart


## Other

1. Don't use synchronous functions. This includes `console.log`, `console.error` in production as they are synchronous. 
2. For logging use:
   - for debugging: `debug` or similar module.
   - for app activity: `morgan`, `winston` or `bunyan`
3. Cache request results\
4. Use a load balancer
5. Use a reverse proxy

Learn `nginx`

***

https://nodejs.org/en/docs/guides/dont-block-the-event-loop/#don-t-block-the-event-loop

3. Don't perform unsafe dynamic *regexp*. See [safe-regex](https://github.com/substack/safe-regex) and [RXXR2](https://www.cs.bham.ac.uk/~hxt/research/rxxr2/) for more info about unsafe regexp. Also see the [node-re2](https://github.com/uhop/node-re2) module.
