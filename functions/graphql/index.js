var server = require('apollo-server-lambda')
var Url = require('url')
var schema = require('../../graphql')

exports.graphiqlHandler = server.graphiqlLambda({
  schema,
  endpointURL: '/graphql'
})

exports.graphqlHandler = (event, context, callback) => {
  server.graphqlLambda({ schema, context: event })(
    event,
    context,
    handleGraphqlResponse
  )

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
    if (event.headers.Authorization) {
      const token = event.headers.Authorization.split(' ').pop()
      data.headers.Authorization = event.headers.Authorization
      data.headers['Set-Cookie'] = data.headers['Set-Cookie'] || ''
      data.headers['Set-Cookie'] += ` jcrew_jwt=${token}; domain=${
        Url.parse(origin).hostname
      };`
    }

    callback(null, data)
  }
}
