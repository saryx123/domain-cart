const config = require('../../config')
const join = require('url-join')
const fetch = require('node-fetch')

module.exports = {
  get,
  addItem
}

function get (context, event) {
  // NOTE(ajoslin): temporarily use cart fixtures
  // because cart api is down
  return fetch(join(config.crewbot.base, 'cart'), {
    method: 'POST',
    body: JSON.stringify({
      CART_REQUEST: {
        countryCode: 'US',
        brand: 'jcrew'
      },
      USER_DETAILS: {
        type: 'signin',
        email: 'test@email.com'
      }
    })
  }).then(r => r.json())
}

function addItem (context, event) {
  const body = JSON.parse(event.body || '{}')
  return fetch(join(config.jspAjax.base, 'add_to_cart_ajax.jsp'), {
    headers: {
      'content-type': 'application/json'
    },
    body: [
      'addToCartJson=[',
      JSON.stringify({
        skuID,
        qty,
        navType: 'PRMNAV',
        ignoreBackorderValidation: false,
        currentInventoryStatus: 1
      }),
      ']&sidecar=true'
    ].join('')
  }).then(r => r.json())
}
