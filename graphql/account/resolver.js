const { loginHandler } = require('../../functions/auth')
const { invoke } = require('../../lambda-helpers')
const delve = require('dlv')

function getAccount () {
  // NOTE(bb220): temporarily use account fixtures
  return require('./account-fixture.json')
}

module.exports = {
  Query: {
    accountGet (root, args) {
      return getAccount()
    },
    accountUser () {
      return null
      // return new Promise((resolve) => setTimeout(resolve, 1500))
      //   .then(() => ({ id: '123', email: 'andrew@ajoslin.com' }))
    }
  },
  Mutation: {
    accountLogin (root, args, context) {
      return invoke(loginHandler, args).then(data => {
        context.headers.Authorization = data.headers.Authorization
        return data.body
      })
    }
  },
  AccountDetails: {
    addresses: root => delve(root, 'ADDRESSES', []),
    defaultAddressId: root => root.defaultAddressId,
    payments: root => delve(root, 'PAYMENTS', []),
    defaultPaymentId: root => root.defaultPaymentId,
    shippingMethods: root => delve(root, 'METHODS', []),
    defaultShippingMethodId: root => root.defaultShippingMethodId
  },
  Address: {
    id: item => item.id,
    address1: item => item['address-1'],
    address2: item => item['address-2'],
    city: item => item.city,
    company: item => item.company,
    firstName: item => item.firstName,
    lastName: item => item.lastName,
    state: item => item.state,
    zip: item => item.zipCode,
    phone: item => item.phone
  },
  Payment: {
    id: item => item.id,
    type: item => item.type,
    number: item => item.number,
    message: item => item.message,
    date: item => item.date
  },
  ShippingMethod: {
    id: item => item.id,
    atp: item => item.atp,
    price: item => item.price,
    title: item => item.title
  }
}
