import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '@entities/user.entity'
import { SmsCode } from '@entities/smscode.entity'
import { HelperService } from '@services/helper.service'

@Module({
  imports: [
    //TypeOrmModule.forFeature([]),
    //TypeOrmModule.forFeature([User, SmsCode]),
  ],
  controllers: [],
  providers: [HelperService],
  exports: [HelperService],
})

export class HelperModule {}
