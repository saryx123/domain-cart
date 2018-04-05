const delve = require('dlv')

function getAccount () {
  // NOTE(bb220): temporarily use account fixtures
  if (true) return require('./account-fixture.json') //eslint-disable-line
}

module.exports = {
  Query: {
    accountGet (root, args) {
      return getAccount()
    }
  },
  Account: {
    addresses: root => delve(root, 'ADDRESSES', []),
    defaultAddressId: root => root.defaultAddressId
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
  }
}
