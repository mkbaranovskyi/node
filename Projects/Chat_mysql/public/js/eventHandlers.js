async function onConnect() {
	console.log('Connect')
	socket.emit('getRooms')
}

async function onGetRooms(roomList) {
	renderAllRooms(roomList)
	// By default we want all messages from the start
	roomList.forEach((roomName) => {
		updateHistory({ roomName, nextMessageID: 0 })
	})

	// When we have the list of rooms, ask for messages for the current room immediately
	socket.emit('getMessages', {
		roomName: $roomElem.value,
		nextMessageID: messagesHistory.get($roomElem.value)
	})
}

function onGetMessages(chatHistory) {
	renderMessages(chatHistory)
}

function onUpdateHistory(options) {
	updateHistory(options)
}

function onRoomCreated(roomName) {
	renderRoom(roomName)
	$chat_content.innerHTML = ''
}

function onRoomRejected(options) {
	console.log(
		`${options.roomName} cannot be created. ${
			options.reason ? options.reason : ''
		}`
	)
}
