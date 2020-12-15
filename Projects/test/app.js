const util = require('util')
const fs = require('fs')
const zlib = require('zlib')

const pipeline = util.promisify(require('stream').pipeline)

async function run() {
	await pipeline(
		fs.createReadStream('archive.tar'),
		zlib.createGzip(),
		fs.createWriteStream('archive.tar.gz')
	)
	throw new Error('oops')
	console.log('Pipeline succeeded.')
}

run().catch((err) => console.error('yo'), '!!!')
