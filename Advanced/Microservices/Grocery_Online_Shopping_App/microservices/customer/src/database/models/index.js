module.exports = {
  CustomerModel: require('./Customer'),
  // We remove these models as they don't belong to the customer microservice.
  // ProductModel: require('./Product'),
  // OrderModel: require('./Order'),
  AddressModel: require('./Address'),
}
