import * as request from 'supertest'
import { LessThanOrEqual } from 'typeorm'

exports.getShops = (app, store) => request(app.getHttpServer())
  .get('/shops?city=108')
  .expect(200)
  .then(res => {
    expect(res.body).toHaveProperty('code', 100)
    expect(res.body).toHaveProperty('response')
    expect(res.body.response).toHaveProperty('collection', 'shops')
    expect(res.body.response).toHaveProperty('count')
    expect(res.body.response).toHaveProperty('items')
    expect(res.body.response.count).toBeLessThan(50)
  })

exports.getAllShops = (app, store) => request(app.getHttpServer())
  .get('/shops?all=1')
  .expect(200)
  .then(res => {
    expect(res.body).toHaveProperty('code', 100)
    expect(res.body).toHaveProperty('response')
    expect(res.body.response).toHaveProperty('collection', 'shops')
    expect(res.body.response).toHaveProperty('count')
    expect(res.body.response).toHaveProperty('items')
    expect(res.body.response.count).toBeGreaterThan(100)
  })