var server = require('apollo-server-lambda')
var jwtVerify = require('../../controllers/auth/jwt-verify')
var schema = require('../../graphql')

exports.graphiqlHandler = server.graphiqlLambda({
  schema,
  endpointURL: '/graphql'
})

exports.graphqlHandler = (event, context, callback) => {
  const authHeader = event.headers && event.headers.authorization
  const appContext = Object.assign({}, context, { event })
  const authPromise =
    authHeader && jwtVerify(authHeader.split(' ').pop(), appContext)

  Promise.resolve(authPromise)
    .then(() => {
      server.graphqlLambda({
        schema,
        context: appContext
      })(event, context, handleGraphqlResponse)
    })
    .catch(jwtVerifyError => callback(null, jwtVerifyError))

  function handleGraphqlResponse (error, data) {
    if (error) return callback(error)

    // Add CORS headers
    // see: https://serverless.com/blog/cors-api-gateway-survival-guide/#cors-with-cookie-credentials
    if (data.headers) {
      data.headers['Access-Control-Allow-Origin'] = event.headers.origin
      data.headers['Access-Control-Allow-Credentials'] = true
      data.headers['Access-Control-Expose-Headers'] = 'Authorization'
    }
    if (appContext.jwt) {
      data.headers.Authorization = `Bearer ${appContext.jwt}`
    }

    callback(null, data)
  }
}
