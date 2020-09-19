const express = require('express')
const path = require('path')
const members = require('./Members')
const logger = require('./middleware/logger')

const app = express()

app.use(logger)

// Get all members
app.get('/api/members', (req, res) => res.json(members))

// Get single member
app.get('/api/members/:id', (req, res) => {
	// add error message if `id` is not found, instead of the empty response
	const found = members.some(member => member.id === +req.params.id)
	if(!found) res.status(400).json({msg: `No user with id of ${req.params.id} exists!`})

	res.json(members.filter(member => member.id === +req.params.id))
})

// Set static folder, so our server will be able to automatically load proper `.html` files when user accesses `/pagename.html` URL
app.use(express.static(path.join(__dirname, 'public')))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server started at port ${PORT}`))

