const socket = io()
const $formSend = document.forms['send-message']
const $formRooms = document.forms['chat-rooms']
const $roomElem = document.getElementById('roomElem')
const $chat_content = document.getElementById('chat_content')
const $file_input = $formSend.file
const $btn_add_room = document.getElementById('btn-add-room')
const messagesHistory = new Map()

socket.once('connect', onConnect)
socket.on('getRooms', onGetRooms)
socket.on('getMessages', onGetMessages)
socket.on('updateHistory', onUpdateHistory)
socket.on('roomCreated', onRoomCreated)
socket.on('roomRejected', onRoomRejected)

$roomElem.addEventListener('change', (e) => {
	console.log('Room Changed')
	// Clear the chat history for the previous room
	$chat_content.innerHTML = '' // Ask for messages for the current room
	socket.emit('getMessages', {
		roomName: $roomElem.value,
		nextMessageID: 0
	})
})

$btn_add_room.addEventListener('click', addNewRoom)

$formSend.addEventListener('submit', (e) => {
	e.preventDefault()

	const message = {
		Username: $formSend.username.value,
		Message: $formSend.message.value,
		PostDate: new Date(),
		roomName: $roomElem.value
	}

	if (!message.Username || !message.Message) {
		return
	}

	socket.emit('postMessage', message)

	$formSend.elements.message.value = ''
	renderMessages([message])
})

function renderRoom(roomName) {
	const option = document.createElement('option')
	option.value = roomName
	option.textContent = roomName
	option.selected = true
	$roomElem.append(option)
}

function renderAllRooms(roomList) {
	$roomElem.innerHTML = ''
	roomList.sort()
	roomList.forEach((roomName) => renderRoom(roomName))

	// Optional: made `Common` the default selected room
	if (roomList.includes('Common')) {
		for (const option of $roomElem.children) {
			if (option.textContent === 'Common') {
				option.selected = true
				break
			}
		}
	}
}

function updateHistory(options) {
	messagesHistory.set(options.roomName, options.nextMessageID)
}

function renderMessages(messages) {
	messages.forEach((message) => {
		let date = new Date(message.PostDate.toString())
		date = date.toLocaleString()

		if (message.roomName !== $roomElem.value) {
			return
		}

		const $message_elem = document.createElement('article')
		$chat_content.prepend($message_elem)
		$message_elem.innerHTML = `<i>${date}</i> <b>${message.Username}:</b> ${message.Message}`
	})
}

function addNewRoom() {
	$btn_add_room.style.display = `none`

	const $roomCreationElements = document.createElement('div')
	const $inputRoomName = document.createElement('input')
	const $btnOk = document.createElement('button')
	const $btnCancel = document.createElement('button')

	$roomCreationElements.style.display = 'inline-block'
	$roomCreationElements.classList.add('roomCreationElements')
	$inputRoomName.type = 'text'
	$inputRoomName.name = 'inputRoomName'
	$btnOk.textContent = 'Ok'
	$btnOk.type = 'button'
	$btnCancel.textContent = 'Cancel'
	$btnCancel.type = 'button'

	$roomCreationElements.append($inputRoomName)
	$roomCreationElements.append($btnOk)
	$roomCreationElements.append($btnCancel)
	$formRooms.append($roomCreationElements)

	$inputRoomName.focus()

	$inputRoomName.addEventListener('keydown', (e) => {
		if (e.code === 'Enter' || e.code === 'NumpadEnter') {
			submitRoomCreation($inputRoomName.value)
		} else if (e.code === 'Escape') {
			removeRoomCreationElements()
		}
	})

	$btnOk.addEventListener('click', () => {
		submitRoomCreation($inputRoomName.value)
	})

	$btnCancel.addEventListener('click', removeRoomCreationElements)

	document.body.addEventListener('focusin', maybeHideRoomCreationElements)

	function maybeHideRoomCreationElements(e) {
		const target = e.target.closest('.roomCreationElements')
		if (!target) {
			removeRoomCreationElements()
		}
	}

	function submitRoomCreation(roomName) {
		if (!checkAppropriateRoomName(roomName)) {
			console.log('Room creation failed!')
			return
		}
		socket.emit('addNewRoom', roomName)
		removeRoomCreationElements()
	}

	function removeRoomCreationElements() {
		$formRooms.querySelector('div').remove()
		$btn_add_room.style.display = 'inline'

		document.body.removeEventListener('focusin', maybeHideRoomCreationElements)
	}
}

function checkAppropriateRoomName(roomName) {
	if (!roomName) return false

	for (const option of $roomElem.children) {
		if (option.textContent === roomName) {
			return false
		}
	}

	return true
}
