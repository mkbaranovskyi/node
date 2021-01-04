'use strict'
const socket = io()
const $form = document.forms['send-message']
const $chat_content = document.getElementById('chat_content')
const $file_input = $form.file
let lastMessageId = 0

$form.addEventListener('submit', (e) => {
	e.preventDefault()

	const message = {
		Username: $form.username.value,
		Message: $form.message.value,
		PostDate: new Date()
	}

	socket.emit('chat messages', message)

	$form.elements.message.value = ''
	renderMessage([message])
})

socket.on('chat messages', renderMessage)

function renderMessage(messages) {
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
