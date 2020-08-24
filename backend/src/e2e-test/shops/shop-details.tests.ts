import * as request from 'supertest'

exports.getShopDetails = (app, store) => request(app.getHttpServer())
  .get('/shops/1')
  .expect(200)
  .then(res => {
    expect(res.body).toHaveProperty('code', 100)
    expect(res.body).toHaveProperty('response')
    expect(res.body.response).toHaveProperty('id', 1)
    expect(res.body.response).toHaveProperty('name')
  })