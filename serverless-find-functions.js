const assert = require('assert')
const merge = require('lodash/merge')
const fs = require('fs')
const path = require('path')
const glob = require('glob')
const yaml = require('js-yaml')

module.exports = function findYaml () {
  return glob
    .sync('functions/**/serverless.yml', {
      cwd: __dirname
    })
    .map(filepath => {
      const json = yaml.safeLoad(
        fs.readFileSync(path.join(__dirname, filepath), 'utf8')
      )

      assert.ok(
        json.functions,
        'object',
        `${filepath}: yaml .functions field required.`
      )

      const dir = path.dirname(filepath)
      Object.keys(json.functions).forEach(functionName => {
        const { handler } = json.functions[functionName]
        json.functions[functionName].handler = path.join(dir, handler)
      })

      return json.functions
    })
    .reduce((acc, json) => merge(acc, json), {})
}
