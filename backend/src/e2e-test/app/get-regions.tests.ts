import * as request from 'supertest'

exports.getRegions = (app, store) => request(app.getHttpServer())
  .get('/regions')
  .expect(200)
  .then(res => {
    expect(res.body).toHaveProperty('code', 100)
    expect(res.body).toHaveProperty('response')
    expect(res.body.response).toHaveProperty('collection', 'regions')
    expect(res.body.response).toHaveProperty('count')
    expect(res.body.response).toHaveProperty('items')
  })

