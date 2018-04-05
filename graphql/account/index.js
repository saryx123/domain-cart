const fs = require('fs')
const path = require('path')
const { makeExecutableSchema } = require('graphql-tools')

module.exports = makeExecutableSchema({
  typeDefs: fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8'),
  resolvers: require('./resolver')
})
