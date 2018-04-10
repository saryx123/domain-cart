const config = require('../config')
const HttpError = require('node-http-error')
const jwt = require('jsonwebtoken')

// These methods may be synchronous, but they return promises for consistency of error handling.
module.exports = {
  jwtEncode,
  jwtVerify,
  jwtVerifyFromEvent
}

function jwtEncode (user, opts) {
  return Promise.resolve().then(() => jwt.sign(user, config.jwt.secret, opts))
}

function jwtVerify (token) {
  return Promise.resolve()
    .then(() => {
      const result = jwt.verify(token, config.jwt.secret)

      return Promise.resolve(result)
    })
    .catch(e => {
      throw HttpError(401)
    })
}

function jwtVerifyFromEvent (event) {
  event = event || {}
  event.headers = event.headers || {}
  const auth = event.headers.Authorization || event.headers.authorization
  if (!auth) return Promise.resolve(event)

  const token = auth.split(' ').pop()
  return jwtVerify(token)
    .then(jwtUser => {
      event.token = token
      event.user = jwtUser
      return event
    })
    .catch(_ => event) // do nothing on error and return event
}
