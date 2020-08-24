import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersController } from '@controllers/users.controller'
import { UsersService } from '@services/users.service'
import { User } from '@entities/user.entity'
import { SmsCode } from '@entities/smscode.entity'
import { HelperModule } from './helper.module'
@Module({
  imports: [
    //TypeOrmModule.forFeature([User, SmsCode]),
    HelperModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
