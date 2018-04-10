const slsp = require('sls-promise')
const fetch = require('node-fetch')
const cuid = require('cuid')
const join = require('url-join')
const cheerio = require('cheerio')
const HttpError = require('node-http-error')
const { jwtEncode } = require('../../lib/jwt')
const config = require('../../config')

module.exports = slsp(login)

function login (event, context) {
  return attemptLogin(event.body).then(user => {
    return jwtEncode(user).then(token => {
      return slsp.response({
        statusCode: 200,
        body: user,
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    })
  })

  // NOTE(ajoslin): Legacy login sometimes fails for an unknown reason. Retries built in.
  function attemptLogin (args, retriesLeft = 1) {
    return beginLogin(args).catch(error => {
      if (retriesLeft) return attemptLogin(args, retriesLeft - 1)
      throw error
    })
  }
}

function beginLogin ({ email, password, remember }) {
  return getLoginForm()
    .then(formHtml => postLogin({ formHtml, email, password, remember }))
    .then(res => {
      const cookie = res.headers.get('set-cookie')

      let match1 = cookie.match(/jcrew_cust=/)
      let match2 = cookie.match(/user_id=/)

      if (!match1 || !match2) {
        throw new HttpError(400, 'Invalid username or password.')
      }

      const customerString = cookie.substring(match1.index).split(';')[0]
      const userIdString = cookie.substring(match2.index).split(';')[0]

      const getCookieValue = cookie => {
        const [_, ...rest] = cookie.split('=') // eslint-disable-line
        return rest.join('')
      }

      const customer = JSON.parse(getCookieValue(customerString))
      const userId = getCookieValue(userIdString)

      return Object.assign(customer, {
        id: userId,
        email
      })
    })
}

function getLoginForm () {
  return fetch(join(config.jcrew.base, '/ajax/sidecarSigninForm.jsp'), {
    headers: {
      referer: 'https://www.jcrew.com'
    }
  }).then(r => r.text())
}

function postLogin ({ formHtml, email, password, remember }) {
  const $form = cheerio.load(formHtml)

  $form('#loginUserBm').val(email)
  $form('#loginPasswordBm').val(password)
  // NOTE(ajoslin): login doesn't give us back a proper response unless remember is always true.
  $form('#loginRememberBm').val(true)

  return fetch(join(config.jcrew.base, 'signin/signin.jsp'), {
    method: 'POST',
    body: $form('form').serialize(),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      // TODO(ajoslin): retrieve bmSessionId & JSESSIONID from store if possible.
      cookie: `bmSessionId=${cuid()}&JSESSIONID=${cuid()}&x-origin=sidecar_render`
    }
  })
}
