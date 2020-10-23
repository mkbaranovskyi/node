const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path')

fs.mkdir(
	path.join(__dirname, 'createdFolder/inner'),
	{
		recursive: true
	},
	(err) => {
		if (err) {
			console.error(err)
		}
	}
)
fs.writeFile(
	path.join(__dirname, 'createdFolder', 'fileName.txt'),
	'text',
	(err) => {
		if (err) {
			console.error(err)
		}
	}
)

app.listen(5000)
