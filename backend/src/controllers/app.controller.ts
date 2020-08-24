import { Controller, Get, Request, Post, UseGuards, Body } from '@nestjs/common'
import { AuthService } from '@services/auth.service'
import { AppService } from '@services/app.service'
import { UsersService } from '@services/users.service'
import { LoginUserDto, ILoginUserResult  } from '@interfaces/login-user.interface'
import { SignupUserDto, ISignupUserResult  } from '@interfaces/signup-user.interface'
import { SendSmsCodeDto, ISendSmsCodeResult } from '@interfaces/send-sms-code.interface'
import { CheckSmsCodeDto, ICheckSmsCodeResult } from '@interfaces/check-sms-code.interface'
import { IDoneResult, ICollectionItems } from '@interfaces/done-result.interface'
import { ForgotPasswordDto } from '@interfaces/forgot-password.interface'

interface IAppController {
  login(loginUserDto: LoginUserDto): Promise<ILoginUserResult>;
  sendSmsCode(sendSmsCodeDto: SendSmsCodeDto): Promise<ISendSmsCodeResult>
  checkSmsCode(checkSmsCodeDto: CheckSmsCodeDto): Promise<ICheckSmsCodeResult>;
  signup(signupUserDto: SignupUserDto): Promise<ISignupUserResult>;
  createTestDb(): Promise<IDoneResult>;
  forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<IDoneResult>;
  cities(): Promise<ICollectionItems>;
  regions(): Promise<ICollectionItems>;
  currencies(): Promise<ICollectionItems>;
}  

// - - - - - - - - - - - - - - - - - - -
// Общий контроллер /
// - - - - - - - - - - - - - - - - - - -
@Controller()
export class AppController implements IAppController {

  constructor(
    private appService: AppService,
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  // - - - - - - - - - - - - - - - - - - -
  // Авторизовать пользователя
  // /auth/login
  // - - - - - - - - - - - - - - - - - - -
  @Post('auth/login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<ILoginUserResult> {
    return this.authService.login(loginUserDto)
  }

  // - - - - - - - - - - - - - - - - - - -
  // Восстановить забытый пароль
  // /forgot-password
  // - - - - - - - - - - - - - - - - - - -
  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<IDoneResult> {
    return await this.usersService.forgotPassword(forgotPasswordDto)
  }

  // - - - - - - - - - - - - - - - - - - -
  // Инициализировать БД тестовыми данными
  // /create-test-db
  // - - - - - - - - - - - - - - - - - - -
  @Get('create-test-db')
  async createTestDb(): Promise<IDoneResult> {
    return this.appService.createTestDb()
  }

  // - - - - - - - - - - - - - - - - - - -
  // Отправить СМС-код
  // /send-sms-code
  // - - - - - - - - - - - - - - - - - - -
  @Post('send-sms-code')
  async sendSmsCode(@Body() sendSmsCodeDto: SendSmsCodeDto): Promise<ISendSmsCodeResult> {
    return await this.usersService.sendSmsCode(sendSmsCodeDto)
  }

  // - - - - - - - - - - - - - - - - - - -
  // Проверить СМС-код
  // /check-sms-code
  // - - - - - - - - - - - - - - - - - - -
  @Post('check-sms-code')
  async checkSmsCode(@Body() checkSmsCodeDto: CheckSmsCodeDto): Promise<ICheckSmsCodeResult> {
    return await this.usersService.checkSmsCode(checkSmsCodeDto)
  }

  // - - - - - - - - - - - - - - - - - - -
  // Зарегистрировать пользователя
  // /signup
  // - - - - - - - - - - - - - - - - - - -
  @Post('user/signup')
  async signup(@Body() signupUserDto: SignupUserDto): Promise<ISignupUserResult> {
    return await this.authService.signupUser(signupUserDto)
  }

  // Получить список городов
  // /cities
  // - - - - - - - - - - - - - - - - - - -
  @Get('cities')
  async cities(): Promise<ICollectionItems> {
    return await this.appService.getCities()
  }

  // Получить список регионов (с городами)
  // /regions
  // - - - - - - - - - - - - - - - - - - -
  @Get('regions')
  async regions(): Promise<ICollectionItems> {
    return await this.appService.getRegions()
  }

  // Получить список валют
  // /currencies
  // - - - - - - - - - - - - - - - - - - -
  @Get('currencies')
  async currencies(): Promise<ICollectionItems> {
    return await this.appService.getCurrencies()
  }

}