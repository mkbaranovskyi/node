const express = require('express')
const app = express()
const path = require('path')
const PORT = process.env.PORT || 5000

const { check, matchedData, validationResult } = require('express-validator')

const multer = require('multer')
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		console.log(file) // <--- Uploaded file info
		cb(null, path.join(__dirname, 'uploads'))
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname)
	}
})
const upload = multer({ storage })

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.post(
	'/form',
	upload.single('send-file'),
	// The Gate: our validators and sanitizers
	[
		check('username') // <input name="username">
			.isLength({ min: 3 })
			.withMessage('Your name should be at least 3 characters long') // Return this error msg if the previous check failed
			.bail() // Stop here if the previous checks faileD
			.trim(), // Trim spaces
		check('e-mail') // <input name="e-mail">
			.isEmail()
			.withMessage('Incorrect email')
			.bail()
			.trim()
			.normalizeEmail(), // toLowerCase() and similar normalization stuff
		check('gender') // <input name="gender">
			.custom((value) => {
				// Our custom check for radio buttons
				switch (value) {
					case 'male':
						return true
					case 'female':
						return true
					case 'other':
						return true
					default:
						return false
				}
			})
			.withMessage('Please select your gender')
	],
	(req, res, next) => {
		try {
			// We appoint it to `req` to make accessible in `catch`
			const result = (req.result = validationResult(req))
			const matches = matchedData(req)

			// Results (including errors if any)
			// console.log(result)
			// // These values successfully passed all their checks
			// console.log('Matched Data: ', matches)

			// Simple way to learn if there were any errors and jump to the `catch` block. You can also check `result.errors` manually for detailed inspection
			result.throw()
			console.log('yo')
			// If we came here - there were no errors
			res.json({ msg: "You're successfully subscribed!" })
		} catch (err) {
			console.error('Error of validation!')
			// Send errors back to the client so they know what went wrong
			res.json({ errors: req.result.errors })
			next(err)
		}
	}
)

app.use(express.static(path.join(__dirname, 'public')))

app.listen(PORT)
