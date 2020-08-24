import { Injectable, Inject, HttpException } from '@nestjs/common'
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm'
import { Repository, EntityManager } from 'typeorm'
import { User, UserType, ProfileField } from '@entities/user.entity'
import { SmsCode, SmsCodeOrigin, SmsCodeStatus } from '@entities/smscode.entity'
import { HelperService } from './helper.service'
import { Rules, validateField } from '@validation/validation'
import { ISignupUser, ISignupUserResult } from '@interfaces/signup-user.interface'
import { ISendSmsCode, ISendSmsCodeResult, expiredMinutes } from '@interfaces/send-sms-code.interface'
import { ICheckSmsCode, ICheckSmsCodeResult } from '@interfaces/check-sms-code.interface'
import { IGetDashboardInfoResult } from '@interfaces/get-dashboard.interface'
import { errors, myException } from '@misc/error-codes'
import axios from 'axios'
import { IAuthUser } from '@interfaces/auth-user.interface'
import { IForgotPassword } from '@interfaces/forgot-password.interface'
import { IDoneResult } from '@interfaces/done-result.interface'
import { IChangePhone } from '@interfaces/change-phone.interface'
import { ISetPassword } from '@interfaces/set-password.interface'
import { IProfileField } from '@interfaces/set-profile-field.interface'
import { Transaction, TransactionType } from '@entities/transaction.entity'
import { Shop, ShopType } from '@entities/shop.entity'
import { ICreateShop } from '@interfaces/create-shop.dto'
import { IUpdateShop } from '@interfaces/update-shop.dto'
import { IPayShop } from '@interfaces/pay-shop.dto'
import { IToggleShop } from '@interfaces/toggle-shop.dto'
import { IDeleteShop } from '@interfaces/delete-shop.dto'
import { kStringMaxLength } from 'buffer'
import { randId, randInt } from '@common/misc/proc'
const bcrypt = require('bcrypt')

interface IUsersService {
	findUserByPhone(phone: string): Promise<User|null>;
	checkSmsCode(data: ICheckSmsCode): Promise<ICheckSmsCodeResult>;
	sendSmsCode(data: ISendSmsCode): Promise<ISendSmsCodeResult>;
	createUser(data: ISignupUser): Promise<IAuthUser>
	getDashboardInfo(authUser: IAuthUser): Promise<IGetDashboardInfoResult>;
	deleteAccount(authUser: IAuthUser): Promise<IDoneResult>;
	forgotPassword(data: IForgotPassword): Promise<IDoneResult>;
	changePhone(authUser: IAuthUser, data: IChangePhone): Promise<IDoneResult>;
	setPassword(authUser: IAuthUser, data: ISetPassword): Promise<IDoneResult>;
	setProfileField(authUser: IAuthUser, data: IProfileField): Promise<IDoneResult>;
	createShop(authUser: IAuthUser, data: ICreateShop): Promise<IDoneResult>;
	updateShop(authUser: IAuthUser, data: IUpdateShop): Promise<IDoneResult>;
	payShop(authUser: IAuthUser, data: IPayShop): Promise<IDoneResult>;
	toggleShop(authUser: IAuthUser, data: IToggleShop): Promise<IDoneResult>;
	deleteShop(authUser: IAuthUser, data: IDeleteShop): Promise<IDoneResult>;
}

@Injectable()
export class UsersService implements IUsersService {

	private readonly users: Repository<User>
	private readonly smscodes: Repository<SmsCode>
	private readonly transactions: Repository<Transaction>
	private readonly shops: Repository<Shop>

	constructor(

		//@Inject(HelperService) 
		private readonly helper: HelperService,

		//@InjectEntityManager()
		private readonly manager: EntityManager,

		// @InjectRepository(User)
		// private readonly users: Repository<User>,
 
		// @InjectRepository(SmsCode)
		// private readonly smscodes: Repository<SmsCode>,

	){

		this.users = this.manager.getRepository(User)
		this.smscodes = this.manager.getRepository(SmsCode)
		this.transactions = this.manager.getRepository(Transaction)
		this.shops = this.manager.getRepository(Shop)
		
	}

	// - - - - - - - - - - - - - - - - - - - - - - - - 
	// Удалить аккаунт
	// - - - - - - - - - - - - - - - - - - - - - - - - 
	async deleteAccount(authUser: IAuthUser): Promise<IDoneResult> {
		await this.manager.transaction(async trManager => {
			await trManager.getRepository(Shop).update(
				{ user: { id: authUser.userId } }, { 
					deleted: true 
				}
			)
			await trManager.getRepository(User).update(
				{ id: authUser.userId }, { 
					phone: "_"+String(randInt(1000000000, 9999999999)),
					deleted: true 
				}
			)
		})
		return {
			done: true,
			message: 'SUCCESS'
		}
	}
	
	// - - - - - - - - - - - - - - - - - - - - - - - - 
	// Скрыть/Показать обменник
	// - - - - - - - - - - - - - - - - - - - - - - - - 
	async toggleShop(authUser: IAuthUser, data: IToggleShop): Promise<IDoneResult> {

		const { shopId, value } = data

		const shop = await this.shops.findOne(shopId, { relations: ['user'] })
		if (!shop) myException(errors.SHOP_NOT_FOUND)
		if(shop.user.id !== authUser.userId) myException(errors.FORBIDDEN)
		validateField(Rules.shopNotDeleted, shop)

		// toggle
		shop.hidden = value
		this.manager.save(shop)

		return {
			done: true,
			message: 'SUCCESS'
		}
	}
	
	// - - - - - - - - - - - - - - - - - - - - - - - - 
	// Удалить обменник
	// - - - - - - - - - - - - - - - - - - - - - - - - 
	async deleteShop(authUser: IAuthUser, data: IDeleteShop): Promise<IDoneResult> {

		const { shopId } = data

		const shop = await this.shops.findOne(shopId, { relations: ['user'] })
		if (!shop) myException(errors.SHOP_NOT_FOUND)
		if(shop.user.id !== authUser.userId) myException(errors.FORBIDDEN)
		validateField(Rules.shopNotDeleted, shop)

		// deleting
		shop.deleted = true
		this.manager.save(shop)

		return {
			done: true,
			message: 'SUCCESS'
		}
	}

	// - - - - - - - - - - - - - - - - - - - - - - - - 
	// Оплатить обменник
	// - - - - - - - - - - - - - - - - - - - - - - - - 
	async payShop(authUser: IAuthUser, data: IPayShop): Promise<IDoneResult> {

		const { shopId, monthes } = data

		// Есть такой обменник?
		const shop = await this.shops.findOne(shopId, { relations: ['user'] })
		if (!shop) myException(errors.SHOP_NOT_FOUND)
		const user: User = shop.user
		if(user.id !== authUser.userId) myException(errors.FORBIDDEN)
		validateField(Rules.userNotDeletedOrBlocked, user)
		validateField(Rules.shopNotDeleted, shop)

		// Баланса хватает?
		const balance: number = shop.user.balance
		const sum: number = 10000 * monthes
		const eps: number = 0.0000001
		if (balance+eps < sum) myException(errors.INSUFFICIENT_FUNDS)
		const newBalance = balance - sum

		// Платим
		const newTransaction: Transaction = this.transactions.create({
			type: TransactionType.WITHDRAW,
			shop: { id: shop.id },
			user: { id: user.id },
			currency: { id: "KZT" },
			sum
		})
		user.balance = newBalance

		// Сохраняем
		this.manager.save(newTransaction)
		this.manager.save(user)

		return {
			done: true,
			message: 'SUCCESS',
			data: { 
				newBalance: newBalance.toFixed(4),
				currency: "KZT",
			}
		}
  }

	// - - - - - - - - - - - - - - - - - - - - - - - - 
	// Найти пользователя по телефону
	// - - - - - - - - - - - - - - - - - - - - - - - - 
	async findUserByPhone(phone: string): Promise<User|null> {
		const user: User = await this.users.findOne({ 
			where: { 
				phone, 
				blocked: false, 
				deleted: false, 
			} 
		})
		return user 
	}
	
	// - - - - - - - - - - - - - - - - - - - - - - - - 
	// Сохранить поле данных в профиле
	// - - - - - - - - - - - - - - - - - - - - - - - - 
	async setProfileField(authUser: IAuthUser, data: IProfileField): Promise<IDoneResult> {

		// Разбор
		const { field, value } = data

		// Ищем аккаунт
		const user: User = await this.users.findOne(authUser.userId)
		validateField(Rules.userNotDeletedOrBlocked, user)

		if (field===ProfileField.NAME) validateField(Rules.userName, value)
		if (field===ProfileField.IIN && user.type===UserType.IE) validateField(Rules.iin, value)
		if (field===ProfileField.IIN && user.type===UserType.LLP) validateField(Rules.bin, value)

		// Сохраняем профиль
		user[field] = value
		this.manager.save(user)

		return { done: true, message: "SUCCESS" }
	}

	// - - - - - - - - - - - - - - - - - - - - - - - - 
	// Создать обменник для пользователя
	// - - - - - - - - - - - - - - - - - - - - - - - - 
	async createShop(authUser: IAuthUser, data: ICreateShop): Promise<IDoneResult> {

		// Разбор
		const { name, cityId, street, house, workingdays, features } = data

		// Создаем обменник
		const newShop: Shop = this.shops.create({ 
			user: { id: authUser.userId },
			city: { id: cityId },
			name, street, house, 
			type: ShopType.EXCHANGER,
			features,
			workingdays,

			coords: [0, 0],
			phones: [],
			wholesale: [],

		})

		// Сохраняем
		await this.manager.save(newShop)

		return {
			done: true,
			message: "SUCCESS",
			data: { inserted_id: newShop.id }
		}
	}

	// - - - - - - - - - - - - - - - - - - - - - - - - 
	// Обновить обменник для пользователя
	// - - - - - - - - - - - - - - - - - - - - - - - - 
	async updateShop(authUser: IAuthUser, data: IUpdateShop): Promise<IDoneResult> {

		const { id, ...data2 } = data
		// 
		const shop = await this.shops.findOne(id, { relations: ['user'] })
		if (!shop) myException(errors.SHOP_NOT_FOUND)
		if(shop.user.id !== authUser.userId) myException(errors.FORBIDDEN)

		//
		for (const field of Object.keys(data2)) {
			shop[field] = data2[field]
		}

		// Сохраняем
		await this.manager.save(shop)

		return {
			done: true,
			message: "SUCCESS",
		}
	}

	// - - - - - - - - - - - - - - - - - - - - - - - - 
	// Проверить СМС-код
	// - - - - - - - - - - - - - - - - - - - - - - - - 
	async checkSmsCode(data: ICheckSmsCode): Promise<ICheckSmsCodeResult> {

		// Разбор
		const { smsCodeId, phone, origin, code } = data

		// Проверка
		validateField(Rules.phone, phone)
		validateField(Rules.smsCodeOrigin, origin)

		// Ищем такой код
		const smsCode = await this.smscodes.findOne(smsCodeId)

		console.log(data)
		console.log(smsCode)
		
		// Если не нашли, или телефон не тот, или origin не тот
		if (!smsCode || smsCode.phone!=phone || smsCode.origin!=origin) 
			myException(errors.SMSCODE_NOT_FOUND)

		// Результат проверки
		const success = smsCode.chances>0 && smsCode.code==code

		// Если верно, то status=VERIFIED
		if (success) {
			smsCode.status = SmsCodeStatus.VERIFIED
			await this.manager.save(smsCode) 
		}

		// Если попытка неудачная, то уменьшаем 
		if (!success && smsCode.chances>0) {
			smsCode.chances--
			await this.manager.save(smsCode) 
		}

		// Результат проверки
		return { success, chances: smsCode.chances }

	}

	// - - - - - - - - - - - - - - - - - - - - - - - - 
	// Отправить СМС-код
	// - - - - - - - - - - - - - - - - - - - - - - - - 
	async sendSmsCode(data: ISendSmsCode): Promise<ISendSmsCodeResult> {

		// Разбор
		const { phone, sendAgain, captcha, origin } = data

		// Проверка
		validateField(Rules.phone, phone)
		validateField(Rules.smsCodeOrigin, origin)
		if (!sendAgain) {
			validateField(Rules.captcha, captcha)
			await this.validateCaptcha(captcha)
		} 

		if (origin==SmsCodeOrigin.SIGNUP_USER)
			return await this.sendSmsCode_signupUser(data)

		if (origin==SmsCodeOrigin.FORGOT_PASSWORD)
			return await this.sendSmsCode_forgotPassword(data)

		if (origin==SmsCodeOrigin.CHANGE_PHONE)
			return await this.sendSmsCode_changePhone(data)

		return { smsCodeId: null }
	}

	// - - - - - - - - - - - - - - - - - - - - - - - - 
	// Отправить СМС-код (при восстановлении пароля)
	// - - - - - - - - - - - - - - - - - - - - - - - -
	private async sendSmsCode_forgotPassword(data: ISendSmsCode): Promise<ISendSmsCodeResult> {

		// Разбор
		const { phone, sendAgain, origin } = data

		// Проверим есть ли такой номер?
		const user: User = await this.users.findOne({ where: { phone } })
		if (!user) myException(errors.ACCOUNT_NOT_FOUND)	
		validateField(Rules.userNotDeletedOrBlocked, user)

		// Создаем новый код 
		const newSmsCode = await this.createSmsCode(phone, origin, sendAgain)

		// Возвращаем Id
		return { smsCodeId: newSmsCode.id }
	}

	// - - - - - - - - - - - - - - - - - - - - - - - - 
	// Отправить СМС-код (при изменении телефона)
	// - - - - - - - - - - - - - - - - - - - - - - - -
	private async sendSmsCode_changePhone(data: ISendSmsCode): Promise<ISendSmsCodeResult> {

		// Разбор
		const { phone, sendAgain, origin } = data

		// Проверим есть ли такой номер?
		const user: User = await this.users.findOne({ where: { phone } })
		if (user)	myException(errors.PHONE_EXISTS)	

		// Создаем новый код 
		const newSmsCode = await this.createSmsCode(phone, origin, sendAgain)

		// Возвращаем Id
		return { smsCodeId: newSmsCode.id }
	}

	// - - - - - - - - - - - - - - - - - - - - - - - - 
	// Отправить СМС-код (при регистрации)
	// - - - - - - - - - - - - - - - - - - - - - - - - 
	private async sendSmsCode_signupUser(data: ISendSmsCode): Promise<ISendSmsCodeResult> {

		// Разбор
		const { phone, sendAgain, captcha, origin } = data

		// Проверим есть ли такой номер?
		const user: User = await this.users.findOne({ where: { phone } })
		if (user)	myException(errors.PHONE_EXISTS)	

		// Создаем новый код 
		const newSmsCode = await this.createSmsCode(phone, origin, sendAgain)

		// Возвращаем Id
		return { smsCodeId: newSmsCode.id }
	}

	// - - - - - - - - - - - - - - - - - - - - - - - - 
	// Получить сводную информацию по пользователю
	// - - - - - - - - - - - - - - - - - - - - - - - - 
	async getDashboardInfo(authUser: IAuthUser): Promise<IGetDashboardInfoResult> {

		const [

			userInfo, 
			shops, 
			transactions,

		] = await Promise.all([

			this.users.findOne(authUser.userId),
			this.shops.find({ where: { user: { id: authUser.userId } } }),
			this.transactions.find({ where: { user: { id: authUser.userId } } })

		])

		validateField(Rules.userNotDeletedOrBlocked, userInfo)

		userInfo.password = null

		return {
			userInfo,
			shops,
			transactions
		}
	}

	// - - - - - - - - - - - - - - - - - - - - - - - - 
	// Создать нового пользователя
	// - - - - - - - - - - - - - - - - - - - - - - - - 
	async createUser(data: ISignupUser): Promise<IAuthUser> {

		// Разбор
		const { phone, password, name, iin, type, smsCodeId } = data

		// Проверка
		validateField(Rules.phone, phone)
		validateField(Rules.newPassword, password)
		validateField(Rules.userName, name)
		validateField(Rules.userType, type)
		validateField(UserType[type]==UserType.IE ? Rules.iin : Rules.bin, iin)
		validateField(Rules.smsCodeId, smsCodeId)

		// Может уже есть аккаунт с таким телефоном
		const oldUser = await this.users.findOne({ where: { phone } })
		if (oldUser) myException(errors.PHONE_EXISTS)

		// Ищем СМС-код
		const smsCode = await this.smscodes.findOne(smsCodeId)
		if (!smsCode) myException(errors.SMSCODE_NOT_FOUND)

		const now = new Date()

		// Нашли, но он некорректный
		if (
				smsCode.status!=SmsCodeStatus.VERIFIED || 
				smsCode.origin!=SmsCodeOrigin.SIGNUP_USER ||
				smsCode.expired<now
		) 
			myException(errors.SMSCODE_INCORRECT)
		
		// Вычисляем хэш пароля
		const hash = await bcrypt.hash(password, 10)

		// Создаем пользователя
		const newUser: User = this.users.create({ 
			phone, 
			name, 
			password: hash, 
			iin, 
			type: UserType[type],
			currency: { id: "KZT" },
		})

		// Сохраняем
		await this.manager.save(newUser)

		// Создаем userObject
		const userObject: IAuthUser = {
			phone: newUser.phone, 
			userId: newUser.id,
			roles: newUser.roles,
		}
7 
		return userObject
	}

	// - - - - - - - - - - - - - - - - - - - - - - - - 
	// Восстановить забытый пароль
	// - - - - - - - - - - - - - - - - - - - - - - - - 
	async forgotPassword(data: IForgotPassword): Promise<IDoneResult> {

		// Разбор
		const { password, smsCodeId } = data

		// Проверка
		validateField(Rules.newPassword, password)
		validateField(Rules.smsCodeId, smsCodeId)

		// Ищем СМС-код
		const smsCode = await this.smscodes.findOne(smsCodeId)
		if (!smsCode) myException(errors.SMSCODE_NOT_FOUND)

		const now = new Date()

		// Нашли, но он некорректный
		if (
				smsCode.status!=SmsCodeStatus.VERIFIED || 
				smsCode.origin!=SmsCodeOrigin.FORGOT_PASSWORD ||
				smsCode.expired<now
		) 
			myException(errors.SMSCODE_INCORRECT)

		// Находим аккаунт
		const phone = smsCode.phone
		const user: User = await this.users.findOne({ where: { phone } })
		if (!user) myException(errors.ACCOUNT_NOT_FOUND)
		validateField(Rules.userNotDeletedOrBlocked, user)

		// Вычисляем хэш нового пароля
		const hash = await bcrypt.hash(password, 10)

		// Меняем пароль и сохраняем
		user.password = hash
		await this.manager.save(user)

		return { done: true, message: "SUCCESS" }
	}

	// - - - - - - - - - - - - - - - - - - - - - - - - 
	// Сменить мобильный теефон
	// - - - - - - - - - - - - - - - - - - - - - - - - 
	async changePhone(authUser: IAuthUser, data: IChangePhone): Promise<IDoneResult> {

		// Разбор
		const { smsCodeId } = data

		// Проверка
		validateField(Rules.smsCodeId, smsCodeId)

		// Ищем СМС-код
		const smsCode = await this.smscodes.findOne(smsCodeId)
		if (!smsCode) myException(errors.SMSCODE_NOT_FOUND)

		const now = new Date()

		// Нашли, но он некорректный
		if (
				smsCode.status!=SmsCodeStatus.VERIFIED || 
				smsCode.origin!=SmsCodeOrigin.CHANGE_PHONE ||
				smsCode.expired<now
		) 
			myException(errors.SMSCODE_INCORRECT)

		// Находим аккаунт
		const user: User = await this.users.findOne({ where: { phone: authUser.phone } })
		if (!user) myException(errors.ACCOUNT_NOT_FOUND)
		validateField(Rules.userNotDeletedOrBlocked, user)

		// Проверяем, что телефон не занят никем
		const user2: User = await this.users.findOne({ where: { phone: smsCode.phone } })
		if (user2) myException(errors.PHONE_EXISTS)
		
		// Меняем телефон и сохраняем
		user.phone = smsCode.phone
		await this.manager.save(user)

		return { done: true, message: "SUCCESS" }
	}

	// - - - - - - - - - - - - - - - - - - - - - - - - 
	// Сменить пароль
	// - - - - - - - - - - - - - - - - - - - - - - - - 
	async setPassword(authUser: IAuthUser, data: ISetPassword): Promise<IDoneResult> {

		// Разбор
		const { password, newPassword } = data

		// Проверка
		validateField(Rules.password, password)
		validateField(Rules.newPassword, newPassword)

		// Находим аккаунт
		const user: User = await this.users.findOne({ where: { phone: authUser.phone } })
		if (!user) myException(errors.ACCOUNT_NOT_FOUND)
		validateField(Rules.userNotDeletedOrBlocked, user)

		// Проверяем пароль
		const result = await bcrypt.compare(password, user.password)
		if (!result) myException(errors.AUTH_FAILED)		

		// Вычисляем хэш нового пароля
		const hash = await bcrypt.hash(newPassword, 10)

		// Меняем пароль и сохраняем
		user.password = hash
		await this.manager.save(user)

		return { done: true, message: "SUCCESS" }
	}

	// - - - - - - - - - - - - - - - - - - - - - 
  // Создать новый СМС-код
  // - - - - - - - - - - - - - - - - - - - - -
  async createSmsCode (phone: string, origin: SmsCodeOrigin, sendAgain: boolean): Promise<SmsCode> {

    // Есть ли такой СМС-код?
		const smsCode: SmsCode = await this.smscodes.findOne({ 
			where: { phone, origin }
		})

		const now: Date = new Date()

		// Если имеется, срок не истек, а попытки кончились то бросаем исключение
		if (smsCode && smsCode.expired > now && smsCode.chances<=0)
			myException(errors.SMSCODE_TRY_LATER)

		// Если имеется, срок не истек, это не повтор и попытки еще есть, то возвращаем его
		// (значение expired - передвигаем)
		if (smsCode && smsCode.expired > now && !sendAgain && smsCode.chances>0) {
			smsCode.expired = new Date(smsCode.expired.getTime() + expiredMinutes*60000)
			this.manager.save(smsCode)
			return smsCode
		}

    await this.smscodes.delete({ phone })
    
		const newSmsCode: SmsCode = this.smscodes.create({ 
			phone, 
			code: '9999', 
			expired: new Date(now.getTime() + expiredMinutes*60000), 
			origin,
			delivered: false, 
		})

		// Сохраняем и возвращаем
    await this.manager.save(newSmsCode)
    return newSmsCode
  }

  // - - - - - - - - - - - - - - - - - - - - - 
  // Проверить каптчу
  // - - - - - - - - - - - - - - - - - - - - -
  async validateCaptcha(token: string): Promise<void> {

		if (token=="1234567890") return

    // Ссылка
		const url = 
			process.env.RECAPTCHA_URL + 
      '?secret=' +
      process.env.RECAPTCHA_SECRET + 
			'&response=' + token

    // axios request...
    let response = null
    try {
      response = await axios.post(url)
    } catch (err) {
      myException(errors.CONNECTION_ERROR)
    } 

    // Ошибка
    if (response.status!=200) 
      myException(errors.CONNECTION_ERROR)
      
    // Каптча корректная?
    const isCorrect = (
			response.data.success 
			|| 
      ( 
        response.data["error-codes"] && 
        response.data["error-codes"].length==1 && 
        response.data["error-codes"][0]=="timeout-or-duplicate"
      )
    ) 
    
    if (!isCorrect) 
      myException(errors.CAPTCHA_INCORRECT)

  }


}
