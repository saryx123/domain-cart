var server = require('apollo-server-lambda')
var jwtVerify = require('../../controllers/auth/jwt-verify')
var Url = require('url')
var schema = require('../../graphql')

exports.graphiqlHandler = server.graphiqlLambda({
  schema,
  endpointURL: '/graphql'
})

exports.graphqlHandler = (event, context, callback) => {
  const authHeader = event.headers && event.headers.authorization
  const graphqlContext = Object.assign({}, context, { event })
  const authPromise =
    authHeader &&
    jwtVerify({ token: authHeader.split(' ').pop() }, graphqlContext)

  Promise.resolve(authPromise)
    .catch(_ => {
      // Ignore JWT verify error, services will send auth errors themselves if auth is required.
    })
    .then(() => {
      server.graphqlLambda({
        schema,
        context: graphqlContext
      })(event, context, handleGraphqlResponse)
    })

  function handleGraphqlResponse (error, data) {
    if (error) return callback(error)
    const origin = event.headers.origin || event.headers.Origin || ''

    // Add CORS headers
    // see: https://serverless.com/blog/cors-api-gateway-survival-guide/#cors-with-cookie-credentials
    if (data.headers) {
      data.headers['Access-Control-Allow-Origin'] = origin
      data.headers['Access-Control-Allow-Credentials'] = true
      data.headers['Access-Control-Expose-Headers'] = 'Authorization'
    }
    if (graphqlContext.jwt) {
      data.headers.Authorization = `Bearer ${graphqlContext.jwt}`
      data.headers['Set-Cookie'] = data.headers['Set-Cookie'] || ''
      data.headers['Set-Cookie'] += ` jcrew_jwt=${graphqlContext.jwt}; domain=${
        Url.parse(origin).hostname
      };`
    }

    callback(null, data)
  }
}
