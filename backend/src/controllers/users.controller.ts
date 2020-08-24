import { Controller, Get, Post, Delete, Body, UseGuards } from '@nestjs/common';
import { UsersService } from '@services/users.service';
import { IGetDashboardInfoResult } from '@interfaces/get-dashboard.interface'
import { JwtAuthGuard } from '@guard/jwt-auth.guard';
import { AuthUser } from '@decorators/auth-user.decorator';
import { IAuthUser } from '@interfaces/auth-user.interface';
import { ChangePhoneDto } from '@interfaces/change-phone.interface';
import { IDoneResult } from '@interfaces/done-result.interface';
import { SetPasswordDto } from '@interfaces/set-password.interface';
import { SetProfileField } from '@interfaces/set-profile-field.interface';
import { CreateShopDto } from '@interfaces/create-shop.dto';
import { UpdateShopDto } from '@interfaces/update-shop.dto';
import { PayShopDto } from '@interfaces/pay-shop.dto';
import { ToggleShopDto } from '@interfaces/toggle-shop.dto';
import { DeleteShopDto } from '@interfaces/delete-shop.dto';

interface IUsersController {
  getDashboard(authUser: IAuthUser): Promise<IGetDashboardInfoResult>;
  deleteAccount(authUser: IAuthUser): Promise<IDoneResult>;
  changePhone(authUser: IAuthUser, changePhoneDto: ChangePhoneDto): Promise<IDoneResult>;
  setPassword(authUser: IAuthUser, setPasswordDto: SetPasswordDto): Promise<IDoneResult>;
  setProfileField(authUser: IAuthUser, setProfileFieldDto: SetProfileField): Promise<IDoneResult>;
  createShop(authUser: IAuthUser, createShopDto: CreateShopDto): Promise<IDoneResult>;
  updateShop(authUser: IAuthUser, updateShopDto: UpdateShopDto): Promise<IDoneResult>;
  payShop(authUser: IAuthUser, payShopDto: PayShopDto): Promise<IDoneResult>;
  toggleShop(authUser: IAuthUser, toggleShopDto: ToggleShopDto): Promise<IDoneResult>;
  deleteShop(authUser: IAuthUser, deleteShopDto: DeleteShopDto): Promise<IDoneResult>;
}

// - - - - - - - - - - - - - - - - - - -
// Контроллер /users/
// - - - - - - - - - - - - - - - - - - -
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController implements IUsersController {

  constructor(
    private usersService: UsersService,
  ) {}

  // - - - - - - - - - - - - - - - - - - -
  // Получить DashboardInfo
  // /users/dashboard
  // - - - - - - - - - - - - - - - - - - -
  @Get('dashboard')
  async getDashboard(@AuthUser() authUser: IAuthUser): Promise<IGetDashboardInfoResult> {
    return await this.usersService.getDashboardInfo(authUser);
  }

  // - - - - - - - - - - - - - - - - - - -
  // Создать новый обменник
  // /users/create-shop
  // - - - - - - - - - - - - - - - - - - -
  @Post('create-shop')
  async createShop(
    @AuthUser() authUser: IAuthUser,
    @Body() createShopDto: CreateShopDto,
  ): Promise<IDoneResult> {
    return await this.usersService.createShop(authUser, createShopDto);
  }

  // - - - - - - - - - - - - - - - - - - -
  // Изменить обменник
  // /users/update-shop
  // - - - - - - - - - - - - - - - - - - -
  @Post('update-shop')
  async updateShop(
    @AuthUser() authUser: IAuthUser,
    @Body() updateShopDto: UpdateShopDto,
  ): Promise<IDoneResult> {
    return await this.usersService.updateShop(authUser, updateShopDto);
  }

  // - - - - - - - - - - - - - - - - - - -
  // Удалить аккаунт пользователя
  // /users/delete-account
  // - - - - - - - - - - - - - - - - - - -
  @Post('delete-account')
  async deleteAccount(@AuthUser() authUser: IAuthUser): Promise<IDoneResult> {
    return await this.usersService.deleteAccount(authUser);
  }

  // - - - - - - - - - - - - - - - - - - -
  // Удалить обменник пользователя
  // /users/delete-shop
  // - - - - - - - - - - - - - - - - - - -
  @Post('delete-shop')
  async deleteShop(@AuthUser() authUser: IAuthUser, @Body() deleteShopDto: DeleteShopDto): Promise<IDoneResult> {
    return await this.usersService.deleteShop(authUser, deleteShopDto);
  }

  // - - - - - - - - - - - - - - - - - - -
  // Оплатить обменник
  // /users/pay-shop
  // - - - - - - - - - - - - - - - - - - -
  @Post('pay-shop')
  async payShop(@AuthUser() authUser: IAuthUser, @Body() payShopDto: PayShopDto): Promise<IDoneResult> {
    return await this.usersService.payShop(authUser, payShopDto)
  }

  // - - - - - - - - - - - - - - - - - - -
  // Скрыть/Показать обменник
  // /users/toggle-shop
  // - - - - - - - - - - - - - - - - - - -
  @Post('toggle-shop')
  async toggleShop(@AuthUser() authUser: IAuthUser, @Body() toggleShopDto: ToggleShopDto): Promise<IDoneResult> {
    return await this.usersService.toggleShop(authUser, toggleShopDto)
  }

  // - - - - - - - - - - - - - - - - - - -
  // Сохранить поле данных в профиле
  // /users/set-profile-field
  // - - - - - - - - - - - - - - - - - - -
  @Post('set-profile-field')
  async setProfileField(@AuthUser() authUser: IAuthUser, @Body() setProfileFieldDto: SetProfileField): Promise<IDoneResult> {
    return await this.usersService.setProfileField(authUser, setProfileFieldDto)
  }

  // - - - - - - - - - - - - - - - - - - -
  // Сменить телефон
  // /users/change-phone
  // - - - - - - - - - - - - - - - - - - -
  @Post('change-phone')
  async changePhone(@AuthUser() authUser: IAuthUser, @Body() changePhoneDto: ChangePhoneDto): Promise<IDoneResult> {
    return await this.usersService.changePhone(authUser, changePhoneDto);
  }

  // - - - - - - - - - - - - - - - - - - -
  // Сменить пароль
  // /users/set-password
  // - - - - - - - - - - - - - - - - - - -
  @Post('set-password')
  async setPassword(@AuthUser() authUser: IAuthUser, @Body() setPasswordDto: SetPasswordDto): Promise<IDoneResult> {
    return await this.usersService.setPassword(authUser, setPasswordDto)
  }
  
}
