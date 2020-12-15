const fs = require('fs')
const path = require('path')
const events = require('events')

const r = fs.createReadStream(
	path.join(__dirname, 'uploads', "01. Lustra - Scotty doesn't know.mp3")
)
const w = fs.createWriteStream(path.join(__dirname, 'uploads', 'output'))

run(r, w)

async function run(origin, dest) {
	try {
		for await (const chunk of origin) {
			isDrained = dest.write(chunk)
			// if the writing buffer is full - await until it's empty
			if (!isDrained) {
				await events.once(dest, 'drain')
			}
		}
	} catch (err) {
		origin.destroy()
		dest.destroy()
		console.error(err)
	}
}
