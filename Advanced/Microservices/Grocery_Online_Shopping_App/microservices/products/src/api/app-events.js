const ProductService = require('../services/product-service')

module.exports = (app) => {
  const service = new ProductService()

  app.use('/app-events', async (req, res, next) => {
    try {
      const { payload } = req.body

      service.SubscribeEvents(payload)
      console.log('====== Products Service received Event ======')

      return res.json(payload)
    } catch (err) {
      next(err)
    }
  })
}
