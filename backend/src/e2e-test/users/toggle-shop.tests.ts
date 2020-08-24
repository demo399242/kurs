import * as request from 'supertest'

exports.hideShop = (app, store) => request(app.getHttpServer())
  .post('/users/toggle-shop')
  .set('Authorization', 'Bearer '+store.newUser.token)
  .send({
    shopId: store.newShop.id,
    value: false
  })
  .expect(201)
  .then(res => {
    expect(res.body).toHaveProperty('code', 100)
    expect(res.body.response).toHaveProperty('done', true)
    expect(res.body.response).toHaveProperty('message', 'SUCCESS')
  })

  exports.showShop = (app, store) => request(app.getHttpServer())
  .post('/users/toggle-shop')
  .set('Authorization', 'Bearer '+store.newUser.token)
  .send({
    shopId: store.newShop.id,
    value: true
  })
  .expect(201)
  .then(res => {
    expect(res.body).toHaveProperty('code', 100)
    expect(res.body.response).toHaveProperty('done', true)
    expect(res.body.response).toHaveProperty('message', 'SUCCESS')
  })


