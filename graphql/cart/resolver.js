const dbCart = require('./cart')

module.exports = {
  Query: {
    CartGetItem: (_, args) => dbCart.CartGetItem(args),
    CartGet: () => dbCart.CartGet()
  },
  Mutation: {
    CartAddItem: (_, args) => dbCart.CartAddItem(args),
    CartUpdateItem: (_, args) => dbCart.CartUpdateItem(args),
    CartDeleteItem: (_, args) => dbCart.CartDeleteItem(args)
  }
}
