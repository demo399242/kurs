import * as request from 'supertest'

exports.getDashboard_FAIL = (app, store) => request(app.getHttpServer())
  .get('/users/dashboard')
  .expect(200)
  .then(res => {
    expect(res.body).toHaveProperty('code', 401)
    expect(res.body).toHaveProperty('error', 'Unauthorized')
  }),

exports.getDashboard_SUCCESS = (app, store) => request(app.getHttpServer())
  .get('/users/dashboard')
  .set('Authorization', 'Bearer '+store.newUser.token)
  .expect(200)
  .then(res => {
    expect(res.body).toHaveProperty('code', 100)
    expect(res.body).toHaveProperty('response')
    expect(res.body.response).toHaveProperty('userInfo')
    expect(res.body.response).toHaveProperty('shops')
  })
