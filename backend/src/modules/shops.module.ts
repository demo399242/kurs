import { Module } from '@nestjs/common'
import { ShopsController } from '@controllers/shops.controller'
import { ShopsService } from '@services/shops.service'
import { HelperModule } from './helper.module'

@Module({
  imports: [
    //TypeOrmModule.forFeature([User, SmsCode]),
    HelperModule,
  ],
  controllers: [ShopsController],
  providers: [ShopsService],
  exports: [],
})
export class ShopsModule {}
