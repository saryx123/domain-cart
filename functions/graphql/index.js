var server = require('apollo-server-lambda')
var schema = require('../../graphql')

exports.graphqlHandler = server.graphqlLambda({ schema })
exports.graphiqlHandler = server.graphiqlLambda({ schema, endpointURL: '/graphql' })
