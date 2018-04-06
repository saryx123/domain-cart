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
  return fetch(join(config.jcrew.base, '/ajax/sidecarSigninForm.jsp'), {
    headers: {
      referer: 'https://www.jcrew.com'
    }
  })
    .then(r => r.text())
}

function postLogin ({ formHtml, email, password, remember }) {
  const $form = cheerio.load(formHtml)

  $form('#loginUserBm').val(email)
  $form('#loginPasswordBm').val(password)
  $form('#loginRememberBm').val(Boolean(remember))

  console.log($form('form').serialize())

  console.log($form.html())

  return fetch(join(config.jcrew.base, 'signin/signin.jsp'), {
    method: 'POST',
    body: $form('form').serialize(),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      origin: 'https://www.jcrew.com',
      referer: 'https://www.jcrew.com'

    }
  })
    .then(res => {
      return res.text().then(text => {
        return { text, res }
      })
    })
}
