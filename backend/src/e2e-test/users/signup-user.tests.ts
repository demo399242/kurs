import * as request from 'supertest'

exports.signupUser_SUCCESS = (app, store) => request(app.getHttpServer())
  .post('/user/signup')
  .send(store.newUser)
  .expect(201)
  .then(res => {
    expect(res.body).toHaveProperty('code', 100)
    expect(res.body).toHaveProperty('response')
  })




