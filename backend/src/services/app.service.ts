import { Injectable } from '@nestjs/common'
import { UsersService } from './users.service'
import { IDoneResult, ICollectionItems } from '@interfaces/done-result.interface'
import { EntityManager, Repository } from 'typeorm'
import { SmsCode } from '@entities/smscode.entity'
import { User } from '@entities/user.entity'
import { TestDbBuilder } from '@misc/create-test-db.script'
import { City } from '@entities/city.entity'
import { Region } from '@entities/region.entity'
import { Currency } from '@entities/currency.entity'

// - - - - - - - - - - - - - - - - - - - - -
// Интерфейс IAppService
// - - - - - - - - - - - - - - - - - - - - -
interface IAppService {
  createTestDb(): Promise<IDoneResult>;
  getCities(): Promise<ICollectionItems>;
  getRegions(): Promise<ICollectionItems>;
  getCurrencies(): Promise<ICollectionItems>;
}

@Injectable()
export class AppService implements IAppService {

  private readonly users: Repository<User>
  private readonly smscodes: Repository<SmsCode>
  private readonly cities: Repository<City>
  private readonly regions: Repository<Region>
  private readonly currencies: Repository<Currency>

  constructor(
    private readonly manager: EntityManager,
    //private usersService: UsersService,
  ) {
    this.users = this.manager.getRepository(User)
    this.smscodes = this.manager.getRepository(SmsCode)
    this.cities = this.manager.getRepository(City)
    this.regions = this.manager.getRepository(Region)
    this.currencies = this.manager.getRepository(Currency)
  }

  // - - - - - - - - - - - - - - - - - - - - -
  // Получить список городов
  // - - - - - - - - - - - - - - - - - - - - -
  async getCities(): Promise<ICollectionItems> {
    const items = await this.cities.find({ relations: [ "region" ] })
    return {
      collection: 'cities',
      count: items.length,
      items: items,
    }
  }

  // - - - - - - - - - - - - - - - - - - - - -
  // Получить список регионов
  // - - - - - - - - - - - - - - - - - - - - -
  async getRegions(): Promise<ICollectionItems> {
    //const items = await this.regions.find()
    const items = await this.regions.createQueryBuilder("region")
      .select() 
      .leftJoinAndSelect("region.cities", "city")
      .leftJoinAndSelect("region.cities2", "city2")
      .orderBy('region.isCity', 'DESC')
      .addOrderBy('region.name', 'ASC')
      .addOrderBy('city.name', 'ASC')
      .getMany()
    return {
      collection: 'regions',
      count: items.length,
      items: items,
    }
  }

  // - - - - - - - - - - - - - - - - - - - - -
  // Получить список валют
  // - - - - - - - - - - - - - - - - - - - - -
  async getCurrencies(): Promise<ICollectionItems> {
    const items = await this.currencies.find()
    return {
      collection: 'currencies',
      count: items.length,
      items: items,
    }
  }
  
  // - - - - - - - - - - - - - - - - - - - - -
  // Создать тестовую БД
  // - - - - - - - - - - - - - - - - - - - - -
  async createTestDb(): Promise<IDoneResult> {
    const testDbBuilder = new TestDbBuilder(this.manager)
    await testDbBuilder.build()
    return { done: true, message: "SUCCESS", data: null }
  }

}
