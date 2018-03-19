const fs = require('fs')
const path = require('path')
const GraphqlJson = require('graphql-type-json')
const { makeExecutableSchema } = require('graphql-tools')

const resolver = require('./resolver')

module.exports = makeExecutableSchema({
  typeDefs: fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8'),
  resolvers: Object.assign(
    {
      JSON: GraphqlJson
    },
    resolver
  )
})
