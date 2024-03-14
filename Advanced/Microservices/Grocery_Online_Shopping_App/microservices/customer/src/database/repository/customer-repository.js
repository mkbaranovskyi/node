const { CustomerModel, AddressModel } = require('../models')
const { APIError, BadRequestError, STATUS_CODES } = require('../../utils/app-errors')

//Dealing with data base operations
class CustomerRepository {
  async CreateCustomer({ email, password, phone, salt }) {
    try {
      const customer = new CustomerModel({
        email,
        password,
        salt,
        phone,
        address: [],
      })
      const customerResult = await customer.save()
      return customerResult
    } catch (err) {
      throw new APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Create Customer')
    }
  }

  async CreateAddress({ _id, street, postalCode, city, country }) {
    try {
      const profile = await CustomerModel.findById(_id)

      if (profile) {
        const newAddress = new AddressModel({
          street,
          postalCode,
          city,
          country,
        })

        await newAddress.save()

        profile.address.push(newAddress)
      }

      return await profile.save()
    } catch (err) {
      throw new APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Error on Create Address')
    }
  }

  async FindCustomer({ email }) {
    try {
      const existingCustomer = await CustomerModel.findOne({ email: email })
      return existingCustomer
    } catch (err) {
      throw new APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Find Customer')
    }
  }

  async FindCustomerById({ id }) {
    try {
      const existingCustomer = await CustomerModel.findById(id).populate('address')
      // .populate('wishlist')
      // .populate('orders')
      // .populate('cart.product')
      return existingCustomer
    } catch (err) {
      throw new APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Find Customer')
    }
  }

  async Wishlist(customerId) {
    const profile = await CustomerModel.findById(customerId).populate('wishlist')

    return profile.wishlist
  }

  async AddWishlistItem(customerId, { _id, name, desc, price, available, banner }) {
    const product = {
      _id,
      name,
      desc,
      price,
      available,
      banner,
    }

    const profile = await CustomerModel.findById(customerId).populate('wishlist')

    if (profile) {
      let wishlist = profile.wishlist

      if (wishlist.length > 0) {
        let isExist = false
        wishlist.map((item) => {
          if (item._id.toString() === product._id.toString()) {
            const index = wishlist.indexOf(item)
            wishlist.splice(index, 1)
            isExist = true
          }
        })

        if (!isExist) {
          wishlist.push(product)
        }
      } else {
        wishlist.push(product)
      }

      profile.wishlist = wishlist
    }

    const profileResult = await profile.save()

    return profileResult.wishlist
  }

  async AddCartItem(customerId, { _id, name, price, banner }, qty, isRemove) {
    const customer = await CustomerModel.findById(customerId).populate('cart')

    if (customer) {
      const cartItem = {
        product: { _id, name, price, banner },
        unit: qty,
      }

      let cartItems = customer.cart

      if (cartItems.length > 0) {
        let isExist = false
        for (const item of cartItems) {
          if (item.product._id.toString() === _id.toString()) {
            if (isRemove) {
              cartItems.splice(cartItems.indexOf(item), 1)
            } else {
              item.unit = qty
            }
            isExist = true
          }
        }

        if (!isExist) {
          cartItems.push(cartItem)
        }
      } else {
        cartItems.push(cartItem)
      }

      customer.cart = cartItems

      return await customer.save()
    }

    throw new Error('Unable to add to cart!')
  }

  async AddOrderToProfile(customerId, order) {
    try {
      const profile = await CustomerModel.findById(customerId)

      if (profile) {
        if (profile.orders === undefined) {
          profile.orders = []
        }
        profile.orders.push(order)

        profile.cart = []

        const profileResult = await profile.save()

        return profileResult
      }

      throw new Error('Unable to add to order!')
    } catch (err) {
      throw new APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Create Customer')
    }
  }
}

module.exports = CustomerRepository
