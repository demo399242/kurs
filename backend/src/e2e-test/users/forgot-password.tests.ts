import * as request from 'supertest'

exports.forgotPassword_SUCCESS = (app, store) => request(app.getHttpServer())
  .post('/forgot-password')
  .send({
    smsCodeId: store.newUser.smsCodeId,
    password: store.newUser.password,
  })
  .expect(201)
  .then(res => {
    expect(res.body).toHaveProperty('code', 100)
    expect(res.body).toHaveProperty('response')
  })




