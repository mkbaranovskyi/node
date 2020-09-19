const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
	res.status(200).json({
		message: 'GET /products'
	})
})

router.post('/', (req, res, next) => {
	const product = {
		name: req.body.name,
		price: req.body.price
	}

	res.status(200).json({
		createdProduct: product
	})
})

module.exports = router