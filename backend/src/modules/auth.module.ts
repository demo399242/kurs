import { Module } from '@nestjs/common'
import { AuthService } from '@services/auth.service'
import { JwtStrategy } from '@guard/jwt.strategy'
import { UsersModule } from './users.module'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { jwtConstants } from '@guard/constants'

@Module({

  imports: [

    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '24h' },
    }),

  ],

  providers: [AuthService, JwtStrategy],
  controllers: [],
  exports: [AuthService],

})

export class AuthModule {}