import * as request from 'supertest'
import { Test } from '@nestjs/testing'
import { AppModule } from '@modules/app.module'
import { INestApplication } from '@nestjs/common'
import { HttpExceptionFilter } from '@middleware/HTTP-exception.filter'
import * as store from './store.json'

// - - - - - - - - - - - - - - - - - - - - - - - - - -
// Поехали!!!
// - - - - - - - - - - - - - - - - - - - - - - - - - -
describe('Тестирование', () => {

  let app: INestApplication

  // - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Инициализация
  // - - - - - - - - - - - - - - - - - - - - - - - - - -
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()
    app = moduleRef.createNestApplication()
    app.useGlobalFilters(new HttpExceptionFilter())
    await app.init()
  })

  // - - - - - - - - - - - - - - - - - - - - - - - - - -
  // TESTS users
  // - - - - - - - - - - - - - - - - - - - - - - - - - -
  describe('Модуль "Пользователи"', () => {

    describe('Список валют', () => {
      const tests = require('./app/get-currencies.tests')
      it('GET currencies', () => tests.getCurrencies(app, store))
    })

    describe('Список городов', () => {
      const tests = require('./app/get-cities.tests')
      it('GET cities', () => tests.getCities(app, store))
    })

    describe('Список областей', () => {
      const tests = require('./app/get-regions.tests')
      it('GET regions', () => tests.getRegions(app, store))
    })

    describe('Список обменников', () => {
      const tests = require('./shops/get-shops.tests')
      it('GET shops', () => tests.getShops(app, store))
      it('GET allShops', () => tests.getAllShops(app, store))
    })

    describe('Информация по обменнику', () => {
      const tests = require('./shops/shop-details.tests')
      it('GET shops/:id', () => tests.getShopDetails(app, store))
    })

    describe('Отправка СМС-кода (signupUser)', () => {
      const tests = require('./users/send-sms-code.tests')
      it('POST send-sms-code (SUCCESS)', () => tests.sendSmsCode_signupUser_SUCCESS(app, store))
    })

    describe('Проверка СМС-кода (signupUser)', () => {
      const tests = require('./users/check-sms-code.tests')
      it('POST check-sms-code (SUCCESS)', () => tests.checkSmsCode_signupUser_SUCCESS(app, store))
    })

    describe('Регистрация пользователя', () => {
      const tests = require('./users/signup-user.tests')
      it('POST user/signup (SUCCESS)', () => tests.signupUser_SUCCESS(app, store))
    })

    describe('Авторизация пользователя', () => {
      const tests = require('./users/login-user.tests')
      it('/POST auth/login (FAIL)', () => tests.loginUser_FAIL(app, store))
      it('/POST auth/login (SUCCESS)', () => tests.loginUser_SUCCESS(app, store))
    })

    describe('Смена пароля', () => {
      const tests = require('./users/set-password.tests')
      it('POST /users/set-password (FAIL)', () => tests.setPassword_FAIL(app, store))
      it('POST /users/set-password (SUCCESS)', () => tests.setPassword_SUCCESS(app, store))
    })

    describe('Сводная информация', () => {
      const tests = require('./users/get-dashboard.tests')
      it('GET users/dashboard (FAIL)', () => tests.getDashboard_FAIL(app, store))
      it('GET users/dashboard (SUCCESS)', () => tests.getDashboard_SUCCESS(app, store))
    })
    
    describe('Отправка СМС-кода (forgotPassword)', () => {
      const tests = require('./users/send-sms-code.tests')
      it('POST send-sms-code (SUCCESS)', () => tests.sendSmsCode_forgotPassword_SUCCESS(app, store))
    })
  
    describe('Проверка СМС-кода (forgotPassword)', () => {
      const tests = require('./users/check-sms-code.tests')
      it('POST check-sms-code (SUCCESS)', () => tests.checkSmsCode_forgotPassword_SUCCESS(app, store))
    })

    describe('Восстановление пароля', () => {
      const tests = require('./users/forgot-password.tests')
      it('POST forgot-password (SUCCESS)', () => tests.forgotPassword_SUCCESS(app, store))
    })

    describe('Отправка СМС-кода (changePhone)', () => {
      const tests = require('./users/send-sms-code.tests')
      it('POST send-sms-code (SUCCESS)', () => tests.sendSmsCode_changePhone_SUCCESS(app, store))
    })
  
    describe('Проверка СМС-кода (changePhone)', () => {
      const tests = require('./users/check-sms-code.tests')
      it('POST check-sms-code (SUCCESS)', () => tests.checkSmsCode_changePhone_SUCCESS(app, store))
    })

    describe('Смена телефона', () => {
      const tests = require('./users/change-phone.tests')
      it('POST /users/change-phone (SUCCESS)', () => tests.changePhone_SUCCESS(app, store))
    })

    describe('Добавить обменник', () => {
      const tests = require('./users/create-shop.tests')
      it('POST /users/create-shop (SUCCESS)', () => tests.createShop_SUCCESS(app, store))
    })

    describe('Редактировать обменник', () => {
      const tests = require('./users/update-shop.tests')
      it('POST /users/update-shop (SUCCESS)', () => tests.updateShop_SUCCESS(app, store))
    })

    describe('Скрыть/Показать обменник', () => {
      const tests = require('./users/toggle-shop.tests')
      it('POST /users/toggle-shop (скрываем)', () => tests.hideShop(app, store))
      it('POST /users/toggle-shop (показываем)', () => tests.showShop(app, store))
    })

    describe('Удалить обменник', () => {
      const tests = require('./users/delete-shop.tests')
      it('POST /users/delete-shop (SUCCESS)', () => tests.deleteShop(app, store))
    })

    describe('Сохранение профиля', () => {
      const tests = require('./users/set-profile-field.tests')
      it('POST /users/set-profile-field (FAIL)', () => tests.setProfileField_FAIL(app, store))
      it('POST /users/set-profile-field (наименование)', () => tests.setProfileField_NAME(app, store))
      it('POST /users/set-profile-field (ИИН/БИН)', () => tests.setProfileField_IIN(app, store))
    })

    describe('Удаление аккаунта', () => {
      const tests = require('./users/delete-account.tests')
      it('POST users/delete-account (FAIL)', () => tests.deleteAccount_FAIL(app, store))
      it('POST users/delete-account (SUCCESS)', () => tests.deleteAccount_SUCCESS(app, store))
    })

  })

  // - - - - - - - - - - - - - - - - - - - - - - - - - -
  // TESTS shops
  // - - - - - - - - - - - - - - - - - - - - - - - - - -
  describe('Модуль "Обменники"', () => {


  })
  
  // - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Очистка
  // - - - - - - - - - - - - - - - - - - - - - - - - - -
  afterAll(async () => {
    await app.close()
  })
})

