const config = require('./config')
const isErrorCode = require('is-error-code')
const HttpError = require('node-http-error')
const AWS = require('aws-sdk')

const _localHandlerCache = {} // Locally, no lambda functions. Just keep a k/v store.

module.exports = {
  wrap,
  invoke
}

function wrap (functionName, handler) {
  handler.lambdaName = functionName
  if (process.env.IS_LOCAL) {
    _localHandlerCache[functionName] = handler
  }
  return handler
}

function invoke (wrappedHandler, payload, opts = {}) {
  const { lambdaName } = wrappedHandler
  let runInvoke = process.env.IS_LOCAL ? runLocalInvoke : runLambdaInvoke

  return runInvoke(
    lambdaName,
    Object.assign(opts, {
      body: payload,
      headers: Object.assign(
        {
          'Content-Type': 'application/json'
        },
        opts.headers || {},
        opts.token
          ? {
            Authorization: `Bearer ${opts.token}`
          }
          : {}
      )
    })
  ).then(data => {
    if (isErrorCode(data.statusCode)) {
      throw HttpError(data.statusCode, data.message || data.body)
    }
    try {
      data.body = JSON.parse(data.body)
    } catch (_) {}
    return data
  })
}

function runLambdaInvoke (functionName, payload) {
  const lambda = getLambdaInstance()
  const params = {
    FunctionName: getLambdaFunctionName(functionName),
    Payload: JSON.stringify(payload)
  }
  return new Promise((resolve, reject) => {
    lambda.invoke(params, (error, data) => {
      if (error) return reject(error)
      resolve(JSON.parse(data.Payload))
    })
  })
}

function runLocalInvoke (functionName, payload) {
  return new Promise((resolve, reject) => {
    _localHandlerCache[functionName](payload, {}, (error, data) => {
      if (error) return reject(error)
      resolve(data)
    })
  })
}

let _lambdaInstance
function getLambdaInstance () {
  if (!_lambdaInstance) {
    _lambdaInstance = new AWS.Lambda({
      region: config.aws.region
    })
  }
  return _lambdaInstance
}

function getLambdaFunctionName (functionName) {
  return [config.aws.service, config.aws.stage, functionName].join('-')
}
