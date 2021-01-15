async function onConnect() {
	socket.emit('getRooms')
}

async function onGetRooms(roomList) {
	renderAllRooms(roomList)
	// By default we want all messages from the start
	roomList.forEach((room) => {
		const { optionValue } = room
		updateHistory({ optionValue, nextMessageID: 0 })
	})

	// The if user required a specific room in the URL (and we have it) - switch to it
	const params = new URLSearchParams(window.location.search)
	for (const room of roomList) {
		if (room.optionValue.toLowerCase() === params.get('room')) {
			$roomElem.value = params.get('room')
			break
		}
	}

	updateURLAndTitle($roomElem.value)

	console.log(messagesHistory)
	socket.emit('getMessages', {
		optionValue: $roomElem.value,
		nextMessageID: messagesHistory.get($roomElem.value)
	})
}

function onGetMessages(chatHistory) {
	renderMessages(chatHistory)
}

function onUpdateHistory(options) {
	updateHistory(options)
}

function onRoomCreated(room) {
	renderRoom(room)
	$chat_content.innerHTML = ''
	updateURLAndTitle($roomElem.value)
}

function onRoomRejected(options) {
	console.log(
		`${options.roomName} cannot be created. ${
			options.reason ? options.reason : ''
		}`
	)
}
