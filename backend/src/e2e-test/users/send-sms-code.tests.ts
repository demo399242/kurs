import * as request from 'supertest'

exports.sendSmsCode_signupUser_SUCCESS = (app, store) => request(app.getHttpServer())
  .post('/send-sms-code')
  .send({
    phone: store.newUser.phone,
    origin: "signupUser",
    captcha: "1234567890",
  })
  .expect(201)
  .then(res => {
    expect(res.body).toHaveProperty('code', 100)
    expect(res.body).toHaveProperty('response')
    expect(res.body.response).toHaveProperty('smsCodeId')
    //
    store.newUser.smsCodeId = res.body.response.smsCodeId
  })

exports.sendSmsCode_forgotPassword_SUCCESS = (app, store) => request(app.getHttpServer())
  .post('/send-sms-code')
  .send({
    phone: store.newUser.phone,
    origin: "forgotPassword",
    captcha: "1234567890",
  })
  .expect(201)
  .then(res => {
    expect(res.body).toHaveProperty('code', 100)
    expect(res.body).toHaveProperty('response')
    expect(res.body.response).toHaveProperty('smsCodeId')
    //
    store.newUser.smsCodeId = res.body.response.smsCodeId
  })
  
exports.sendSmsCode_changePhone_SUCCESS = (app, store) => request(app.getHttpServer())
  .post('/send-sms-code')
  .send({
    phone: store.newUser.phoneForChange,
    origin: "changePhone",
    captcha: "1234567890",
  })
  .expect(201)
  .then(res => {
    expect(res.body).toHaveProperty('code', 100)
    expect(res.body).toHaveProperty('response')
    expect(res.body.response).toHaveProperty('smsCodeId')
    //
    store.newUser.smsCodeId = res.body.response.smsCodeId
  })