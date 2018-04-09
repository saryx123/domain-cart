// NOTE(ajoslin): this is async on purpose, it may interact with DynamoDB at a later point.
const config = require('../../config')
const HttpError = require('node-http-error')
const jwt = require('jsonwebtoken')

module.exports = verify

// NOTE(ajoslin): this is async on purpose, it may interact with DynamoDB at a later point.
function verify ({ token }, context) {
  return Promise.resolve()
    .then(() => {
      const result = jwt.verify(token, config.jwt.secret)

      context.user = result.user
      context.jwt = token

      return Promise.resolve({ user: context.user, jwt: token })
    })
    .catch((e) => {
      throw HttpError(401)
    })
}
