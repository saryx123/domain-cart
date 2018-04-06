const fetch = require('node-fetch')
const join = require('url-join')
const cheerio = require('cheerio')
const config = require('../../config')

module.exports = login

function login ({ email, password, remember }) {
  return getLoginForm()
    .then(formHtml => postLogin({ formHtml, email, password, remember }))
    .then(({ text, res }) => {
      console.log(res.headers)
      console.log(text.includes('"status": "success"'))
    })
}

function getLoginForm () {
  return fetch(join(config.jcrew.base, 'ajax/sidecarSignInForm.jsp'))
    .then(r => r.text())
}

function postLogin ({ formHtml, email, password, remember }) {
  const $form = cheerio.load(formHtml)

  $form('#loginUserBm').val(email)
  $form('#loginPasswordBm').val(password)
  $form('#loginRememberBm').val(Boolean(remember))

  const opts = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: $form('form').serialize()
  }
  console.log(opts)

  return fetch(join(config.jcrew.base, 'signin/signin.jsp'), opts)
    .then(res => {
      return res.text().then(text => {
        return { text, res }
      })
    })
}
