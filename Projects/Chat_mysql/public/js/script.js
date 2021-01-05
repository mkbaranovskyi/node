'use strict'
const socket = io()
const $form = document.forms['send-message']
const $chat_content = document.getElementById('chat_content')
const $file_input = $form.file
socket.nextMessageId = 0

$form.addEventListener('submit', (e) => {
	e.preventDefault()
	console.log('socket.nextMessageId', socket.nextMessageId)

	const message = {
		Username: $form.username.value,
		Message: $form.message.value,
		PostDate: new Date()
	}

	if (!message.Username || !message.Message) {
		return
	}

	socket.emit('chat messages', message)

	$form.elements.message.value = ''
	renderMessages([message])
})

socket.on('connect', () => {
	console.log(socket.nextMessageId)
	socket.emit('get messages', socket.nextMessageId)
})

socket.on('chat messages', renderMessages)

socket.on('next id', (id) => (socket.nextMessageId = id))

function renderMessages(messages) {
	messages.forEach((message) => {
		let date = new Date(message.PostDate.toString())
		date = date.toLocaleString()
		console.log(date)

		const $message_elem = document.createElement('article')
		$chat_content.prepend($message_elem)
		$message_elem.innerHTML = `<i>${date}</i> <b>${message.Username}:</b> ${message.Message}`
	})
}

// function renderMessage(data) {
// 	const message = document.createElement('article')
// 	$chat_content.prepend(message)
// 	message.innerHTML = `<b>${data.username}:</b> ${data.message}`
// }
