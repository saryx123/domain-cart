const { mergeSchemas } = require('graphql-tools')

module.exports = mergeSchemas({
  schemas: [require('./cart'), require('./cms'), require('./navigation')]
})
