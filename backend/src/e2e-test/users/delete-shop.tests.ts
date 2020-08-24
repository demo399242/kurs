import * as request from 'supertest'

exports.deleteShop = (app, store) => request(app.getHttpServer())
  .post('/users/delete-shop')
  .set('Authorization', 'Bearer '+store.newUser.token)
  .send({ shopId: store.newShop.id })
  .expect(201)
  .then(res => {
    expect(res.body).toHaveProperty('code', 100)
    expect(res.body.response).toHaveProperty('done', true)
    expect(res.body.response).toHaveProperty('message', 'SUCCESS')
  })



