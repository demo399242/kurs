import * as request from 'supertest'

exports.createShop_SUCCESS = (app, store) => request(app.getHttpServer())
  .post('/users/create-shop')
  .set('Authorization', 'Bearer '+store.newUser.token)
  .send(store.newShop)
  .expect(201)
  .then(res => {
    expect(res.body).toHaveProperty('code', 100)
    expect(res.body.response).toHaveProperty('done', true)
    expect(res.body.response).toHaveProperty('message', 'SUCCESS')
    //
    store.newShop.id = res.body.response.data.inserted_id
  })
