const express = require('express')
const cors = require('cors')
const { customer, appEvents } = require('./api')
const HandleErrors = require('./utils/error-handler')

module.exports = async (app) => {
  app.use(express.json({ limit: '10mb' }))
  app.use(express.urlencoded({ extended: true, limit: '10mb' }))
  app.use(cors())
  app.use(express.static(__dirname + '/public'))

  appEvents(app)
  customer(app)

  app.use(HandleErrors)
}
