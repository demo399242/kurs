import * as request from 'supertest'

exports.checkSmsCode_signupUser_SUCCESS = (app, store) => request(app.getHttpServer())
  .post('/check-sms-code')
  .send({
    smsCodeId: store.newUser.smsCodeId,
    phone: store.newUser.phone,
    origin: "signupUser",
    code: "9999",
  })
  .expect(201)
  .then(res => {
    expect(res.body).toHaveProperty('code', 100)
    expect(res.body).toHaveProperty('response')
    expect(res.body.response).toHaveProperty('success', true)
    expect(res.body.response).toHaveProperty('chances')
  })

exports.checkSmsCode_forgotPassword_SUCCESS = (app, store) => request(app.getHttpServer())
  .post('/check-sms-code')
  .send({
    smsCodeId: store.newUser.smsCodeId,
    phone: store.newUser.phone,
    origin: "forgotPassword",
    code: "9999",
  })
  .expect(201)
  .then(res => {
    expect(res.body).toHaveProperty('code', 100)
    expect(res.body).toHaveProperty('response')
    expect(res.body.response).toHaveProperty('success', true)
    expect(res.body.response).toHaveProperty('chances')
  })

exports.checkSmsCode_changePhone_SUCCESS = (app, store) => request(app.getHttpServer())
  .post('/check-sms-code')
  .send({
    smsCodeId: store.newUser.smsCodeId,
    phone: store.newUser.phoneForChange,
    origin: "changePhone",
    code: "9999",
  })
  .expect(201)
  .then(res => {
    expect(res.body).toHaveProperty('code', 100)
    expect(res.body).toHaveProperty('response')
    expect(res.body.response).toHaveProperty('success', true)
    expect(res.body.response).toHaveProperty('chances')
  })