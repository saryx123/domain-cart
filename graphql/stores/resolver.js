const delve = require('dlv')

function getStores () {
  // NOTE: Temporarily use store fixtures
  if (true) return require('./store-fixture.json') //eslint-disable-line
}

module.exports = {
  Query: {
    storeGet (root, args) {
      return getStores()
    }
  },
  Stores: {
    storeDetails: root => delve(root, 'STORES.STORESDETAILS', [])
  },
  StoreDetails: {
    id: item => item.id,
    distance: item => item.distance,
    address: item => item.address,
    availability: item => item.availability
  },
  Address: {
    company: item => item.company,
    address1: item => item['address-1'],
    address2: item => item['address-2'],
    city: item => item.city,
    state: item => item.state,
    zip: item => item.zipCode,
    phone: item => item.phone
  },
  Availability: {
    quantity: item => item.quantity,
    instore: item => item.instore
  }
}
