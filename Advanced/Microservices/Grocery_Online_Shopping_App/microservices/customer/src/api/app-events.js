const CustomerService = require('../services/customer-service')

module.exports = (app) => {
  const service = new CustomerService()

  app.use('/app-events', async (req, res, next) => {
    console.log('customer app events')
    try {
      const { payload } = req.body

      service.SubscribeEvents(payload)
      console.log('====== Customer Service received Event ======')

      return res.json(payload)
    } catch (err) {
      next(err)
    }
  })
}
