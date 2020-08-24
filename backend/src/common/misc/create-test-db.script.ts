import { EntityManager, Repository } from "typeorm"
import { User, UserRole, UserType } from "../../database/entities/user.entity"
import { Shop, ShopType, IFeatures, IWorkingDay, IWholeSale } from "../../database/entities/shop.entity"
import { SmsCode } from "../../database/entities/smscode.entity"
import { Currency } from "../../database/entities/currency.entity"
import * as currenciesInfo from './json/currencies-info.json'
import * as citiesInfo from './json/cities.json'
import * as streetsInfo from './json/streets.json'
import * as names1Info from './json/names1.json'
import * as names2Info from './json/names2.json'
import { randInt, randId, randArr, randBool } from "./proc"
import { ShopRate } from "../../database/entities/shoprate.entity"
import { City } from "../../database/entities/city.entity"
import { Region } from "../../database/entities/region.entity"
import { Transaction, TransactionType } from "../../database/entities/transaction.entity"
const bcrypt = require('bcrypt')

export class TestDbBuilder {

  private readonly users: Repository<User>
  private readonly smscodes: Repository<SmsCode>
  private readonly shops: Repository<Shop>
  private readonly regions: Repository<Region>
  private readonly cities: Repository<City>
  private readonly currencies: Repository<Currency>
	private readonly shoprates: Repository<ShopRate>
	private readonly transactions: Repository<Transaction>

  constructor(
    private readonly manager: EntityManager
  ){
    this.users = this.manager.getRepository(User)
    this.smscodes = this.manager.getRepository(SmsCode)
		this.shops = this.manager.getRepository(Shop)
		this.currencies = this.manager.getRepository(Currency)
		this.regions = this.manager.getRepository(Region)
		this.cities = this.manager.getRepository(City)
		this.shoprates = this.manager.getRepository(ShopRate)
		this.transactions = this.manager.getRepository(Transaction)
	}

	// - - - - - - - - - - - - - - - - - - - 
	// Создать Валюты
	// - - - - - - - - - - - - - - - - - - - 
  private async createCurrencies(): Promise<void> {
		for (const crn of currenciesInfo) {

			const value = Number(crn.sample)
				 
			crn.digits = 
				value < 8 ? 3 :
					value < 80 ? 2 :
						value < 800 ? 1 : 0

			const newCrn: Currency = this.currencies.create({ 
				id: crn.name,
				...crn,
			})	
			await this.manager.save(newCrn)

		}
	}

	// - - - - - - - - - - - - - - - - - - - 
	// Создать Пользователей
	// - - - - - - - - - - - - - - - - - - - 
  private async createUsers(): Promise<void> {

		const count = 50

		const password_raw = "1234567"

		for (let i=0; i<count; i++) {
		
			const phone: string = 
				(i==0) ? "77777777777" : 
					(i>=1 && i<=5) ? String(i).repeat(11) : 
						"7705"+randInt(1000000, 9999999)

			const roles: UserRole[] = 
				(i==0) ? [UserRole.ADMIN, UserRole.USER] : 
					[UserRole.USER]

			const password: string = await bcrypt.hash(password_raw, 10)
			
			const type: UserType = 
				(i==0) ? UserType.IE : 
					(i==1) ? UserType.IE : 
						(i==2) ? UserType.LLP : 
							randArr(Object.values(UserType))

			const name: string = 
				(i==0) ? "Roman Kairis" : 
					(i==1) ? "Петров Сергей Геннадьевич" : 
						(i==2) ? "Валютные инновации" : 
							randId(25, "A")

			const iin: string = 
				(i==0) ? "000000000000" :
					(i==1) ? "701225350112" : 
						randId(12, "9")

			//const currency: string = "KZT" 
			const newUser: User = this.users.create({ 
				id: i+1, phone, name, password, type, roles, iin, balance: 0,
				currency: { id: "KZT" },
			})
			await this.manager.save(newUser)

			// balance
			const balanceCount = randInt(1, 3)
			let balance = 0
			for (let b=0; b<balanceCount; b++) {
				const sum: number = randInt(1, 12) * 1000
				balance = balance + sum
				const newTransaction: Transaction = this.transactions.create({
					user: { id: (i+1) },
					shop: { id: null },
					type: TransactionType.BALANCE,
					currency: { id: "KZT" },
					sum: sum,
				})
				await this.manager.save(newTransaction)
			}

			newUser.balance = balance
			await this.manager.save(newUser)
		}
	}

	// - - - - - - - - - - - - - - - - - - - 
	// Создать Регионы
	// - - - - - - - - - - - - - - - - - - - 
  private async createRegions(): Promise<void> {

		const citiesInfo2: any[] = citiesInfo

		const regionsData = []
		let regionId = 100
		for (const c of citiesInfo2) {
			//const c = { regionId2: null, regionId: null, ...c2 }
			if (c.status=="1") {
				regionId++
				regionsData.push({ 
					id: regionId, 
					name: c.runame, 
					isCity: true,
					//cities: [ c.id ], 
				})
				c.regionId2 = regionId
			}
			
			const elem = regionsData.find(item => item.name===c.regionName)
			if (elem) {
				c.regionId = elem.id
				//elem.cities.push(c.id)
			} else {
				regionId++
				regionsData.push({ id: regionId, name: c.regionName, cities: [ c.id ], isCity: false })
				c.regionId = regionId
			}
		}
			
		// Создать Регионы
		for (const r of regionsData) {
			const newRegion: Region = this.regions.create({ 
				id: r.id,
				name: r.name,
				//cities: r.cities,
				isCity: r.isCity,
			})	
			await this.manager.save(newRegion)
		}
			
		// Создать Города
		for (const c of citiesInfo2) {
			const newCity: City = this.cities.create({ 
				id: +c.id,
				name_russia: c.runame_rus,
				name: c.runame,
				kzname: c.kzname,
				population: +c.population,
				status: +c.status,
				region: { id: c.regionId },
				region2: { id: c.regionId2 },
			})	
			await this.manager.save(newCity)
		}
	}

	// - - - - - - - - - - - - - - - - - - - 
	// Создать Обменники
	// - - - - - - - - - - - - - - - - - - - 
  private async createShops(): Promise<void> {

		const users: User[] = await this.users.find()
		const cities: City[] = await this.cities.find()

		let shopId = 0

		for (const city of cities) {

			const shopCount = (city.id==108 || city.id==112) ? 35 : 
				city.id==185 ? 0 : randInt(1, 5)

			for (let i=0; i<shopCount; i++) {

				const street: string = randArr(streetsInfo)
				const house: string = String(randInt(12, 180))
				const user: User = randArr(users)
				const name: string = randArr(names1Info) + " " + randArr(names2Info)
				const features: IFeatures = {
					"24/7": randBool(), 
					gold: randBool(), 
					guard: randBool(), 
					wholesale: randBool(), 
				}
				const comment = randBool() ? randId(50, 'A') : ''
				const days = ["Пн","Вт","Ср","Чт","Пт","Сб","Вс"]
				const workingdays: IWorkingDay[] = days.map(day => {
					const active = randBool(0.80)
					const from = active ? String(randInt(10,14))+":00" : "--:--"
					const till = active ? String(randInt(17,20))+":00" : "--:--"
					return { day, active, from, till }
				})
				const coords = [ 
					51.10+Math.floor(Math.random() * 10)/100, 
					71.35+Math.floor(Math.random() * 20)/100, 
				]
				const phones = []
				const phoneCount = randInt(1, 5)
				for (let j=0; j<phoneCount; j++) {
					const telegram = randBool(0.40)
					phones.push({
						phone: 
							"7"+randArr(["777", "727", "714", "701","708", "771", "705", "702"])+
							randInt(1000000, 9999999),
						whatsapp: randBool(),
						telegram: telegram,
						telegram_name: telegram ? "tele"+randInt(1000, 9999) : null
					})
				}
				const wholesale: IWholeSale[] = []
				if (randBool()) {
					wholesale.push({
						currency: "EUR", from: randArr([8000, 10000, 12000])
					})
					wholesale.push({
						currency: "USD", from: randArr([10000, 12000, 15000])
					})
				}

				shopId++

				const newShop: Shop = this.shops.create({
					id: shopId,
					type: ShopType.EXCHANGER,
					name: name.charAt(0).toUpperCase() + name.slice(1),
					city: { id: city.id },
					user: { id: user.id },
					street,
					house,
					comment,
					features,
					workingdays,
					coords,
					phones,
					wholesale,
				})	
				await this.manager.save(newShop)

				// shoprates
				currenciesInfo.filter(c=>c.name!="KZT").forEach(async info => {

					const value = Number(info.sample)

					const buy = randBool(0.04) ? "" : (value * randInt(995, 999)/1000).toFixed(info.digits)
					const sell = randBool(0.04) ? "" : (value * randInt(1001, 1005)/1000).toFixed(info.digits)

					const newShopRate: ShopRate = this.shoprates.create({
						shop: newShop,
						currency: { id: info.name },
						buy_value: buy,
						sell_value: sell,
					})
					await this.manager.save(newShopRate)

				})


			}

		}
	}

	// - - - - - - - - - - - - - - - - - - - 
	// Очистить БД
	// - - - - - - - - - - - - - - - - - - - 
  private async clearDb(): Promise<void> {

    await Promise.all([
      this.shoprates.delete({}),
			this.smscodes.delete({}),
			this.transactions.delete({}),
		])
		
		await Promise.all([
      this.shops.delete({}),
			this.currencies.delete({}),
		])

		await Promise.all([
      this.cities.delete({}),
      this.users.delete({}),
		])

		await Promise.all([
      this.regions.delete({}),
		])
  }

	// - - - - - - - - - - - - - - - - - - - 
	// Построить тестовую БД
	// - - - - - - - - - - - - - - - - - - - 
  async build(): Promise<void> {
		await this.clearDb()
		await this.createCurrencies()
		await this.createRegions()
		await this.createUsers()
		await this.createShops()
  }

}
