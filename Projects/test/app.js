const express = require('express')
const app = express()
const Cookies = require('js-cookie')

app.get('/', (req, res, next) => {
	res.end('<b>Hello</b>')
})

app.use(express.static('public'))

app.listen(5000)
