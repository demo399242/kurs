import * as request from 'supertest'

exports.setPassword_FAIL = (app, store) => request(app.getHttpServer())
  .post('/users/set-password')
  .set('Authorization', 'Bearer '+store.newUser.token)
  .send({
    password: "wrong",
    newPassword: store.newUser.password,
  })
  .expect(200)
  .then(res => {
    expect(res.body).toHaveProperty('code', 902)
    expect(res.body).toHaveProperty('error', 'AUTH_FAILED')
  })

exports.setPassword_SUCCESS = (app, store) => request(app.getHttpServer())
  .post('/users/set-password')
  .set('Authorization', 'Bearer '+store.newUser.token)
  .send({
    password: store.newUser.password,
    newPassword: store.newUser.password,
  })
  .expect(201)
  .then(res => {
    expect(res.body).toHaveProperty('code', 100)
    expect(res.body).toHaveProperty('response')
  })