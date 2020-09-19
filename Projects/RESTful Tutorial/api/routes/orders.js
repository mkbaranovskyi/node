const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
	res.status(200).json({
		message: 'GET /orders'
	})
})

router.post('/', (req, res, next) => {
	const order = {
		productId: req.body.id,
		quantity: req.body.quantity
	}
	res.status(200).json({
		message: 'Order was created',
		order
	})
})

router.get('/:id', (req, res, next) => {
	res.status(200).json({
		productId: req.params.id,
		message: 'Order details'
	})
})

router.delete('/:id', (req, res, next) => {
	res.status(200).json({
		id: req.params.id,
		message: 'Order deleted'
	})
})

module.exports = router