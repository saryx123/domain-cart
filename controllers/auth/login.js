const fetch = require('node-fetch')
const join = require('url-join')
const cheerio = require('cheerio')
const config = require('../../config')

const SIGNIN_COOKIE = `AKA_A2=1; brickwork_secondary_layout=true; mt.v=2.1168519705.1520458465678; bn_u=6927155352377364586; bn_guide=true; bn_cd=d%26g%26s; s_fid=44E25C0CFB5EE587-1BC34B50897F9A22; bmBrowserSalt=twOW09QLLuIygqcx5Sp6nH914VZy1s1j; s_vi=[CS]v1|2D50300F851D389C-60001908200016C5[CE]; _ga=GA1.2.382962891.1520459808; LPVID=dhMzk5MmU4MTVjZWUwYTIw; BVBRANDID=24bb1945-d475-4a45-9579-113bca5444bd; __sonar=13792958515372728506; jcrew_cv=cv=2,old=0,new=100; _litra_id.b7a7=a-00w6--729ffdb4-a213-4f50-afb0-acb73230978d.1520459808.5.1521134074.1520875295.4852c2e7-d167-4082-bcdb-ea37d7bf1d9e; ajs_user_id=null; ajs_group_id=null; ajs_anonymous_id=%224b6e8150-bc36-4b79-94d2-1913e40c6feb%22; jcrew_country=US; x-origin=sidecar_render; PROrigin=CurrentOrigin; akacd_pr1=3700410237~rv=76~id=17963950ce3da714b3384b03bbfbd0ae; jcrew_wc=yes; SC_LINKS=%5B%5BB%5D%5D; s_cc=true; _gid=GA1.2.189039166.1522957441; s_ev26=%5B%5BB%5D%5D; s_ev27=%5B%5BB%5D%5D; firstPageLoad=false; s_ev44_persist=12694487; mt.custom=false; JSESSIONID=L1QhhHhdQk8L8fWmWL4Q1yyjMydGDnKB27FpBTPxyNJ4P2zqJyTQ!-2057401330; _gat_UA-38295707-1=1; LPSID-9886338=fUgu__n3Q4-98NX8mnImnA; mt.mbsh=%7B%22fs%22:1523030773960,%22s%22:%5B%221277EXP%22%5D,%22sf%22:1,%22lf%22:1523030773984%7D; bmSessionId=f4ws11ZFRukR_d4i_dwa_AWKXPOwn_1o/6_jfo57bz8_6dag; AKA_A2=1; BVBRANDSID=484114bb-b232-42ba-84ee-3d00dd54f62b; akavpau_www_jcrew_VP=1523031086~id=9437d5f535676b76f6f75cf46915c8c6; gpv_p41=Account%3A%20SignIn_Registration; productnum=45; _uetsid=_uet2fbb952e; RT="sl=3&ss=1523030761924&tt=5551&obo=0&sh=1523030787322%3D3%3A0%3A5551%2C1523030783803%3D2%3A0%3A3734%2C1523030778942%3D1%3A0%3A1107&dm=jcrew.com&si=caaf23be-9eef-4ca1-b56f-73b4d4c525b3&bcn=%2F%2F36eb5590.akstat.io%2F"; s_sq=jcrewcom%252Cjcrewglobalrollup%3D%2526c.%2526a.%2526activitymap.%2526page%253DAccount%25253A%252520SignIn_Registration%2526link%253DSIGN%252520IN%252520HERE%2526region%253Dpage__signin%2526pageIDType%253D1%2526.activitymap%2526.a%2526.c%2526pid%253DAccount%25253A%252520SignIn_Registration%2526pidt%253D1%2526oid%253DSIGN%252520IN%252520HERE%2526oidt%253D3%2526ot%253DSUBMIT`

module.exports = login

function login ({ email, password, remember }) {
  return getLoginForm()
    .then(formHtml => postLogin({ formHtml, email, password, remember }))
    .then(res => {
      const cookie = res.headers.get('set-cookie')

      let match1 = cookie.match(/jcrew_cust=/)
      let match2 = cookie.match(/user_id=/)

      if (!match1 && match2) {
        throw new Error(400, 'Invalid username or password.')
      }

      const customerString = cookie.substring(match1.index).split(';')[0]
      const userIdString = cookie.substring(match2.index).split(';')[0]

      const getCookieValue = cookie => {
        const [_, ...rest] = cookie.split('=')
        return rest.join('')
      }

      const customer = JSON.parse(getCookieValue(customerString))
      const userId = getCookieValue(userIdString)

      return {
        customer,
        userId
      }
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

  // console.log($form('form').serialize())

  // console.log($form.html())

  return fetch(join(config.jcrew.base, 'signin/signin.jsp'), {
    method: 'POST',
    body: $form('form').serialize(),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      cookie: SIGNIN_COOKIE
    }
  })
}
