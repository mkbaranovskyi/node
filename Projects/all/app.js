const express = require('express')
const app = express()
const server = require('http').createServer(app)
// const path = require('path')
// const io = require('socket.io')(server)
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// app.use('/rooms', require('./routes/rooms'))

app.post('/', (req, res, next) => {
	console.log(req.body)
	res.send('response')
})

app.get('/', (req, res, next) => {
	res.send('<h1>Yo</h1>')
})

app.post('/rooms', async (req, res) => {
	try {
		console.log(req.body)
		return res.status(400).json({ message: 'Успешно был обработан и отправлен запрос с сервера' })
	} catch (e) {
		res.status(500).json({ message: 'Какая-то ошибка, попробуйте позже' })
	}
	console.log('получил пост запрос')
})

server.listen(PORT, () => console.log('Сервер запущен'))
