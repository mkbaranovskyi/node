import http from 'http'
import fs from 'fs'
import { pipeline } from 'stream/promises'
import url from 'url'

const PORT = 3000

const server = http.createServer((req, res) => {
	if (req.url === '/') {
		res.writeHead(302, {
			Location: '/hello.html'
		})
	}

	if (req.url === '/getbooks') {
		return
	}
	res.end('Default response')
})

server.listen(PORT)
