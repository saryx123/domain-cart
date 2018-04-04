const { mergeSchemas } = require('graphql-tools')

module.exports = mergeSchemas({
  schemas: [require('./cms'), require('./navigation'), require('./cart')]
})
