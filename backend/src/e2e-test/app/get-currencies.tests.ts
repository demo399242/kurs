import * as request from 'supertest'

exports.getCurrencies = (app, store) => request(app.getHttpServer())
  .get('/currencies')
  .expect(200)
  .then(res => {
    expect(res.body).toHaveProperty('code', 100)
    expect(res.body).toHaveProperty('response')
    expect(res.body.response).toHaveProperty('collection', 'currencies')
    expect(res.body.response).toHaveProperty('count')
    expect(res.body.response).toHaveProperty('items')
  })

