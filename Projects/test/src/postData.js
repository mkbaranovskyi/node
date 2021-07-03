const http = require('http')

function postData(data, options, cb) {
	const request = http.request(options, cb)
	request.write(JSON.stringify(data))
	request.end()
}

const reqOptions = {
	path: '/meta/tracks',
	port: 3000,
	method: 'POST'
}

const reqCallback = (res) => {
	const chunks = []

	res.on('readable', () => {
		let chunk
		while ((chunk = res.read()) !== null) {
			chunks.push(chunk)
		}
	})

	res.on('end', () => {
		console.log(chunks.join(''))
	})

	res.on('error', (err) => {
		console.error(err)
	})
}

module.exports = { postData, reqOptions, reqCallback }
