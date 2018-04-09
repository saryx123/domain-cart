const config = require('../../config')
const jwt = require('jsonwebtoken')

module.exports = encode

// NOTE(ajoslin): this is async on purpose, it may interact with DynamoDB at a later point.
function encode ({ user, remember }, context) {
  const opts = {
    expiresIn: remember ? '30d' : '1d'
  }
  const token = jwt.sign(
    {
      user
    },
    config.jwt.secret,
    opts
  )

  context.user = user
  context.jwt = token

  return Promise.resolve({ user, jwt: token })
}
