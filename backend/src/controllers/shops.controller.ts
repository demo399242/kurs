import { Controller, Get, Param, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
//import { CityValidationPipe } from '@validation/validation.pipes'
import { ShopsService } from '@services/shops.service'
import { ICollectionItems } from '@interfaces/done-result.interface';
import { Shop, ExtraShop } from '@entities/shop.entity';

interface IShopController {
  getShops(cityId: number): Promise<ICollectionItems>;
  getShopDetails(shopId: number): Promise<ExtraShop>;
}

@Controller('shops')
export class ShopsController {

  constructor(
    private shopsService: ShopsService,
  ) {}
  
  @Get()
  async getShops(
    @Query('city', new DefaultValuePipe(112), ParseIntPipe) cityId: number,
    @Query('all', new DefaultValuePipe(0), ParseIntPipe) all: number,
  ): Promise<ICollectionItems> {
    if (all===1)
      return await this.shopsService.getAllShops()
    else
      return await this.shopsService.getShops(cityId)    
  }

  @Get(':shopId')
  async getShopDetails(
    @Param('shopId', new DefaultValuePipe(0), ParseIntPipe) shopId: number
  ): Promise<ExtraShop> {
    return await this.shopsService.getShopDetails(shopId)
  }

}
