const express = require('express')
const app = express()
const fs = require('fs')

// app.use(express.json())

console.log(fs.readdirSync(__dirname, { withFileTypes: true }))
// run()

async function run() {
	const fd = await fs.open('text.txt', 'w+', '0o666', (err, file) => {
		if (err) console.log(err)
	})
	console.log(fd)
}

app.listen(5000)
