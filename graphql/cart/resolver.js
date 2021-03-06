const config = require('../../config')
const join = require('url-join')
const fetch = require('node-fetch')
const delve = require('dlv')
const { parsePrice } = require('./helpers')

function getCart () {
  return fetch(join(config.crewbot.base, 'cart/get'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      countryCode: 'US',
      USER_DETAILS: {
        type: 'signin',
        email: 'test@email.com'
      },
      brand: 'jcrew'
    })
  }).then(r => {
    return r.json()
  })
}

module.exports = {
  Query: {
    cartGet (root, args) {
      return getCart()
    }
  },
  Cart: {
    currency: root => root.CURRENCY_FORMAT.currency,
    price: root => root.CART_SUMMARY || {},
    items: root => delve(root, 'SHOPPINGCART.BAG_ITEM', []),
    quantity: root =>
      delve(root, 'SHOPPINGCART.BAG_ITEM', []).reduce(
        (n, item) => n + item.quantity,
        0
      )
  },
  CartPrice: {
    subtotal: data => parsePrice(data.subTotal),
    discount: data => parsePrice(data.discountAmt),
    shipping: data => parsePrice(data.shippingAmt),
    tax: data => parsePrice(data.tax),
    final: data => parsePrice(data.totalPriceAmt)
  },
  CartItem: {
    quantity: item => item.quantity || 0,
    product: item => item, // pass item to Product resolver
    size: item => item.size,
    color: item => item.color
  },
  Product: {
    sku: item => item.sku_id,
    url: item => item.productUrl,
    price: item => item,
    mainImage: item => ({ url: item.imageUrl }),
    images: item => [{ url: item.imageUrl }],
    description: item => ({
      short: item.shortDesc
    }),
    status: item => item
  },
  ProductStatus: {
    code: item =>
      /in stock/i.test(item.status || '') ? 'IN_STOCK' : 'OUT_OF_STOCK',
    backOrdered: item => Boolean(item.backOrdered),
    details: item => item.statusDetails
  },
  ProductPrice: {
    list: item => parsePrice(item.listPrice),
    final: item => parsePrice(item.totalPrice) / item.quantity
  }
}
