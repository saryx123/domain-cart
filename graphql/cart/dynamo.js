const AWS = require('aws-sdk')
AWS.config.update({ region: 'us-east-1' })
const dynamoDb = new AWS.DynamoDB.DocumentClient()
module.exports = {
  createItem: function (params) {
    return new Promise((resolve, reject) =>
      dynamoDb
        .put(params)
        .promise()
        .then(() => resolve(params.Item))
        .catch(err => reject(err))
    )
  },
  get: function (params) {
    return new Promise((resolve, reject) =>
      dynamoDb
        .get(params)
        .promise()
        .then(data => resolve(data.Item))
        .catch(err => reject(err))
    )
  },
  scan: function (params) {
    return new Promise((resolve, reject) =>
      dynamoDb
        .scan(params)
        .promise()
        .then(data => resolve(data.Items))
        .catch(err => reject(err))
    )
  },
  updateItem: function (params, args) {
    return new Promise((resolve, reject) =>
      dynamoDb
        .update(params)
        .promise()
        .then(data => resolve(args))
        .catch(err => reject(err))
    )
  },
  deleteItem: function (params, args) {
    return new Promise((resolve, reject) =>
      dynamoDb
        .delete(params)
        .promise()
        .then(data => resolve(data.Attributes))
        .catch(err => reject(err))
    )
  }
}
