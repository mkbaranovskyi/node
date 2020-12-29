'use strict'
const $form = document.forms['send-message']
console.log($form)

$form.addEventListener('submit', (e) => {
	e.preventDefault()
})
