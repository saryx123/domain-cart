const { mergeSchemas } = require('graphql-tools')

module.exports = mergeSchemas({
  schemas: [
    require('./account'),
    require('./cart'),
    require('./cms'),
    require('./navigation')
  ]
})
