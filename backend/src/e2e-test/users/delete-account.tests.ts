import * as request from 'supertest'

exports.deleteAccount_FAIL = (app, store) => request(app.getHttpServer())
  .post('/users/delete-account')
  .set('Authorization', 'Bearer '+'WRONG')
  .expect(200)
  .then(res => {
    expect(res.body).toHaveProperty('code', 401)
    expect(res.body).toHaveProperty('error', 'Unauthorized')
  }),

exports.deleteAccount_SUCCESS = (app, store) => request(app.getHttpServer())
  .post('/users/delete-account')
  .set('Authorization', 'Bearer '+store.newUser.token)
  .expect(201)
  .then(res => {
    expect(res.body).toHaveProperty('code', 100)
  })
