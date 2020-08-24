import { Injectable, Inject } from '@nestjs/common';
import { UsersService } from './users.service'
import { JwtService } from '@nestjs/jwt'
import { User } from '@entities/user.entity'
import { ILoginUser, ILoginUserResult } from '@interfaces/login-user.interface'
import { ISignupUser, ISignupUserResult } from '@interfaces/signup-user.interface'
import { validateField, Rules } from '@validation/validation'
import { myException, errors } from '@misc/error-codes'
import { IAuthUser } from '@interfaces/auth-user.interface';
const bcrypt = require('bcrypt')

interface IAuthService {
  validateUser(phone: string, password: string): Promise<any>;
  login({ phone, password }: ILoginUser): Promise<ILoginUserResult>;
  signupUser(data: ISignupUser): Promise<ISignupUserResult>;
}

// - - - - - - - - - - - - - - - - - - -
// Служба AuthService
// - - - - - - - - - - - - - - - - - - -
@Injectable()
export class AuthService implements IAuthService {

  constructor(
    
    private readonly usersService: UsersService,

    private readonly jwtService: JwtService,
    
  ) {}

  // - - - - - - - - - - - - - - - - - - -
  // Проверить токен пользователя
  // - - - - - - - - - - - - - - - - - - -
  async validateUser(phone: string, password: string): Promise<any> {

    const user: User = await this.usersService.findUserByPhone(phone);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // - - - - - - - - - - - - - - - - - - -
  // Проверить логин и пароль
  // - - - - - - - - - - - - - - - - - - -
	async login({ phone, password }: ILoginUser): Promise<ILoginUserResult> {

		// Проверка
		validateField(Rules.phone, phone)
		validateField(Rules.password, password)

		// Основная проверка на логин и пароль
		const user = await this.usersService.findUserByPhone(phone)
    if (!user) myException(errors.AUTH_FAILED)
    		
		// Сравниваем хэши
		const result = await bcrypt.compare(password, user.password)

		// Неверный пароль
		if (!result) myException(errors.AUTH_FAILED)

		// Все в порядке, формируем токен
		const userObject: IAuthUser = { 
      phone, 
      userId: user.id, 
			roles: user.roles,
    }
    
    return { token: this.jwtService.sign(userObject) }
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - 
	// Регистрация пользователя
	// - - - - - - - - - - - - - - - - - - - - - - - - 
	async signupUser(data: ISignupUser): Promise<ISignupUserResult> {

		const userObject: IAuthUser = await this.usersService.createUser(data)

		return { token: this.jwtService.sign(userObject) }

	}

}