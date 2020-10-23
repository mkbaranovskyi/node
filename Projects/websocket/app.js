// eslint-disable-next-line import/newline-after-import
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const path = require('path')
const WebSocket = require('ws')

const PORT = process.env.PORT || 5000

const wss = new WebSocket.Server({
	server
})

app.get(/^\/commits\/(\w+)(?:\.\.(\w+))?$/, function (req, res) {
	var from = req.params[0]
	var to = req.params[1] || 'HEAD'
	console.log('commit range ' + from + '..' + to)
})

// app.use(express.static(path.join(__dirname, 'public')))

function noop() {}

function heartbeat() {
	console.log(
		`Time: ${new Date().toLocaleTimeString()}, clients: ${wss.clients.size}`
	)
	this.isAlive = true
}

wss.on('connection', function connection(ws) {
	console.log(`New connection! Size: ${wss.clients.size}`)
	ws.isAlive = true
	ws.on('pong', heartbeat)

	ws.on('message', (msg) => {
		wss.clients.forEach((client) => {
			if (client.readyState === ws.OPEN) {
				client.send(msg)
			}
		})
	})
})

const interval = setInterval(function ping() {
	wss.clients.forEach(function each(ws) {
		if (ws.isAlive === false) return ws.terminate()

		ws.isAlive = false
		ws.ping(noop)
	})
}, 3000)

wss.on('close', function close() {
	clearInterval(interval)
})

server.listen(PORT, () => {
	console.log(`The app is running on port ${PORT}\n`)
})

app.use(
	'/',
	(req, res, next) => {
		console.log(1.1) // 1.1
		next()
	},
	(req, res, next) => {
		// <--- next handler
		console.log(1.2) // 1.2
		next()
	}
)
