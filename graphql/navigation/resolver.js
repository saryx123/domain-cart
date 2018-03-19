// TODO(ajoslin): invoke the lambda function explicitly, not via require.
const navigation = require('../../functions/navigation')
const invoke = handler => {
  return new Promise((resolve, reject) => {
    navigation.handler({}, {}, (error, data) => {
      if (error || data.statusCode !== 200) reject(JSON.parse((error || data).body))
      else resolve(JSON.parse(data.body))
    })
  })
}

module.exports = {
  Query: {
    navigation (root, args) {
      return invoke(navigation)
    },
    navigationCategory (root, args) {
      return invoke(navigation).then(nav => {
        return nav.find(item => item.id === args.id)
      })
    }
  }
}
