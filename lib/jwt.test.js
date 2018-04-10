const { jwtEncode, jwtVerify, jwtVerifyFromEvent } = require('./jwt')

describe('lib/jwt', () => {
  it('jwtEncode / jwtVerify', () => {
    return jwtEncode({ foo: 'bar' })
      .then(jwtVerify)
      .then(output => {
        expect(output.foo).toEqual('bar')
      })
  })

  it('jwtVerifyFromEvent success', () => {
    return jwtEncode({ foo: 'bar' }).then(token => {
      var event = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      return jwtVerifyFromEvent(event).then(() => {
        expect(event.token).toEqual(token)
        expect(event.user).toBeTruthy()
        expect(event.user.foo).toEqual('bar')
      })
    })
  })

  it('jwtVerifyFromEvent fail', () => {
    var event = {
      headers: {
        Authorization: `Bearer INVALID`
      }
    }
    return jwtVerifyFromEvent(event).then(() => {
      expect(event.token).toBeUndefined()
      expect(event.user).toBeUndefined()
    })
  })
})
