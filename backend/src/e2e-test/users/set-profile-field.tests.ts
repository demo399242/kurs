import * as request from 'supertest'

exports.setProfileField_FAIL = (app, store) => request(app.getHttpServer())
  .post('/users/set-profile-field')
  //.set('Authorization', 'Bearer WRONG')
  .send({ field: "name", value: store.newUser.name+"!" })
  .expect(200)
  .then(res => {
    expect(res.body).toHaveProperty('code', 401)
    expect(res.body).toHaveProperty('error', 'Unauthorized')
  })

exports.setProfileField_NAME = (app, store) => request(app.getHttpServer())
  .post('/users/set-profile-field')
  .set('Authorization', 'Bearer '+store.newUser.token)
  .send({ field: "name", value: store.newUser.name+"!" })
  .expect(201)
  .then(res => {
    expect(res.body).toHaveProperty('code', 100)
  })

exports.setProfileField_IIN = (app, store) => request(app.getHttpServer())
  .post('/users/set-profile-field')
  .set('Authorization', 'Bearer '+store.newUser.token)
  .send({ field: "name", value: "123456654321" })
  .expect(201)
  .then(res => {
    expect(res.body).toHaveProperty('code', 100)
  })
