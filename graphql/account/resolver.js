const HttpError = require('node-http-error')
const login = require('../../controllers/auth/login')

module.exports = {
  Query: {
    account (root, args, context) {
      if (!context.jwt) {
        throw HttpError(401)
      }
      return context.user
    }
  },
  Mutation: {
    accountLogin (root, args, context) {
      return login(args, context).then(user => ({
        user,
        token: context.jwt
      }))
    }
  }
}
