const express = require('express')
const uuid = require('uuid')
const router = express.Router()
const members = require('../../Members')

// Get all members
router.get('/', (req, res) => res.json(members))

// Get single member
router.get('/:id', (req, res) => {
	// add error message if `id` is not found, instead of an empty response
	if(!members.some(member => member.id === +req.params.id)) {
		return res.status(400).json({msg: `No user with id of ${req.params.id} exists!`})
	}
	// if we don't do `else` here, we will get an error: 'Headers are already sent'. Add `return` to prevent this.
	
	res.status(200).json(members.filter(member => member.id === +req.params.id))
})

// Create Member
router.post('/', (req, res) => {
	// check if the data sent by user is correct and sufficient
	if(!req.body.name || !req.body.email){
		return res.status(400).json({msg: "Please include a name and email"})
	} 

	const newMember = {
		id: uuid.v4(),
		name: req.body.name,
		email: req.body.email,
		status: 'active'
	}
	
	members.push(newMember)
	
	// res.status(200).json(members)
	// You wouldn't usually return JSON, let's redirect to the same page
	res.redirect('/')
})

// Update User
router.put('/:id', (req, res) => {
	if(!members.some(member => member.id === +req.params.id)) {
		return res.status(400).json({msg: `No user with id of ${req.params.id} exists!`})
	}

	const member = members[req.params.id]

	if(req.body.name){
		member.name = req.body.name
	}
	if(req.body.email){
		member.email = req.body.email
	}

	res.status(200).json ({ msg: "Member updated!", member })
})

// Delete member
router.delete('/:id', (req, res) => {
	if(!members.some(member => member.id === +req.params.id)) {
		return res.status(400).json({msg: `No user with id of ${req.params.id} exists!`})
	}

	members.splice(req.params.id - 1, 1)
	res.status(200).json({
		msg: `User with id of ${req.params.id} successfully deleted!`,
		members
	})
})

module.exports = router