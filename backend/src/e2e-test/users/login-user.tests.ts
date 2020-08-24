import * as request from 'supertest'

exports.loginUser_FAIL = (app, store) => request(app.getHttpServer())
  .post('/auth/login')
  .send({ phone: store.newUser.phone, password: "wrong" })
  .expect(200)
  .then(res => {
    expect(res.body).toHaveProperty('code', 902)
    expect(res.body).toHaveProperty('error', 'AUTH_FAILED')
  }),

exports.loginUser_SUCCESS = (app, store) => request(app.getHttpServer())
  .post('/auth/login')
  .send({ phone: store.newUser.phone, password: store.newUser.password })
  .expect(201)
  .then(res => {
    expect(res.body).toHaveProperty('code', 100)
    expect(res.body).toHaveProperty('response')
    expect(res.body.response).toHaveProperty('token')
    //
    store.newUser.token = res.body.response.token
  })
