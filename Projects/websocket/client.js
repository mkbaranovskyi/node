const socket = new WebSocket('wss://localhost:5000')

document.forms.publish.onsubmit = e => {
	// const data = new FormData(document.forms.publish)

	if (socket.readyState === 1) { // connection is open
		socket.send(msg.value)
	}

	return false
}

socket.onmessage = e => {
	console.log(e.data)

	const div = document.createElement('div')
	document.getElementById('messages').prepend(div)
	div.textContent = e.data
}