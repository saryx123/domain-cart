var server = require('apollo-server-lambda')
var schema = require('../../graphql')

exports.graphiqlHandler = server.graphiqlLambda({ schema, endpointURL: '/graphql' })

exports.graphqlHandler = (event, context, callback) => {
  server.graphqlLambda({ schema })(event, context, (error, data) => {
    if (error) return callback(error)
    // Add CORS headers
    // https://serverless.com/blog/cors-api-gateway-survival-guide/#cors-with-cookie-credentials
    if (data.headers) {
      data.headers['Access-Control-Allow-Origin'] = event.headers.origin
      data.headers['Access-Control-Allow-Credentials'] = true
    }
    callback(null, data)
  })
}
