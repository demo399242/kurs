import * as request from 'supertest'

exports.changePhone_SUCCESS = (app, store) => request(app.getHttpServer())
  .post('/users/change-phone')
  .set('Authorization', 'Bearer '+store.newUser.token)
  .send({
    smsCodeId: store.newUser.smsCodeId,
  })
  .expect(201)
  .then(res => {
    expect(res.body).toHaveProperty('code', 100)
    expect(res.body).toHaveProperty('response')
  })