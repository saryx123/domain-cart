const { wrap } = require('../../lambda-helpers')

exports.loginHandler = wrap('login', require('./login'))
