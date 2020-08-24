import { Injectable } from '@nestjs/common';
import { Repository, EntityManager } from 'typeorm'
import { User } from '@entities/user.entity'
import { SmsCode } from '@entities/smscode.entity'
import { HelperService } from './helper.service';
import { Region } from '@entities/region.entity';
import { City } from '@entities/city.entity';
import { Shop, ExtraShop } from '@entities/shop.entity';
import { ICollectionItems } from '@interfaces/done-result.interface';
import { myException, errors } from '@misc/error-codes';
import { extraInfo, fastRates } from '@common/misc/proc';

interface IShopsService {
  getShops(cityId: number): Promise<ICollectionItems>;
  getAllShops(): Promise<ICollectionItems>;
  getShopDetails(shopId: number): Promise<ExtraShop>;
}

@Injectable()
export class ShopsService implements IShopsService {

  private readonly users: Repository<User>
  private readonly smscodes: Repository<SmsCode>
  private readonly cities: Repository<City>
  private readonly regions: Repository<Region>
  private readonly shops: Repository<Shop>

  constructor(
    private readonly manager: EntityManager,
    private readonly helper: HelperService,
  ) {
    this.users = this.manager.getRepository(User)
    this.smscodes = this.manager.getRepository(SmsCode)
    this.cities = this.manager.getRepository(City)
    this.regions = this.manager.getRepository(Region)
    this.shops = this.manager.getRepository(Shop)
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - 
  // Получить список ВСЕХ обменников (кратко)
  // - - - - - - - - - - - - - - - - - - - - - - - - 
  async getAllShops(): Promise<ICollectionItems> {

    const items = await this.shops.createQueryBuilder("shop")
      .select(["shop.id", "shop.name", "city.id", "city.name", "region.id", "region.name"]) 
      .leftJoin("shop.city", "city")
      .leftJoin("city.region", "region")
      .getMany()
      
    return {
        collection: "shops",
        count: items.length,
        items: items,
      }
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - 
  // Получить список обменников по некоторому городу
  // - - - - - - - - - - - - - - - - - - - - - - - - 
  async getShops(cityId: number): Promise<ICollectionItems> {

    const items = await this.shops.createQueryBuilder("shop")
      .select() 
      .leftJoinAndSelect("shop.city", "city")
      .where("shop.cityId=:cityId", { cityId })
      .leftJoinAndSelect("city.region", "region")
      .leftJoinAndSelect("shop.rates", "rate")
      .leftJoinAndSelect("rate.currency", "currency")
      .getMany()

    const ts = +new Date()

    return {
      collection: "shops",
      count: items.length,
      items: items.map(shop => ({
        ...shop,
        extra: extraInfo(shop),
        rates: fastRates(shop),
        ratesupdated: ts - Math.floor(Math.random()*36*3600*1000),
      })),
    }

  }

  // - - - - - - - - - - - - - - - - - - - - - - - - 
  // Получить информацию по обменнику
  // - - - - - - - - - - - - - - - - - - - - - - - - 
  async getShopDetails(shopId: number): Promise<ExtraShop> {
    const shop = await this.shops.findOne(
      shopId, { relations: ['rates', 'rates.currency'] }
    )
    if (!shop) myException(errors.SHOP_NOT_FOUND)

    const ts = +new Date()

    return {
      ...shop,
      extra: extraInfo(shop),
      rates: fastRates(shop),
      ratesupdated: ts - Math.floor(Math.random()*36*3600*1000),
    }
  }

}

//.where("shop.id = :id", { id: 1 })

    // const items = await this.shops.find({
    //   select: [ 
    //     "id", "name",
    //     "street", "house", "comment",
    //     "features", "workingdays", "coords", 
    //     "phones", "wholesale",
    //     "city",
    //   ],
    //   relations: [ "city", "city.region", "rates", "rates.currency" ],
    //   where: { city: cityId },
    //   order: [{ id: "ASC" }],
    // })

      // skip: 5,
      // take: 10,
      // cache: true,
      // title: Not("About #1")
      // LessThan, MoreThan, LessThanOrEqual, MoreThanOrEqual, Equal, Like
      // title: Like("%out #%")
      // likes: Between(1, 10)
      // title: In(["About #2", "About #3"])
      // title: Any(["About #2", "About #3"])
      // IsNull, title: IsNull()
      // likes: Raw("dislikes - 4")
      // currentDate: Raw(alias =>`${alias} > NOW()`)
