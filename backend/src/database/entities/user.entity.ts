import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, ManyToOne } from 'typeorm'
import { Shop } from './shop.entity'
import { Currency } from './currency.entity';
import { Transaction } from './transaction.entity';

// Тип пользователя (ИП / ТОО)
export enum UserType { IE='ie', LLP='llp' }

// Роль пользователя (Администратор, Обычный юзер)
export enum UserRole { ADMIN='admin', USER='user' }

// Поле профиля пользователя (name, iin)
export enum ProfileField { NAME='name', IIN='iin' }

@Entity()
export class User {

  // Идентификатор пользователя
  @PrimaryGeneratedColumn()
  id: number;

  // Телефон пользователя
  @Column({ length: 15, unique: true })
  phone: string;

  // Наименование пользователя
  @Column({ length: 500 })
  name: string;

  // Пароль
  @Column({ length: 500, select: true })
  password: string;

  // Тип пользователя (ИП или ТОО)
  @Column({
    type: "enum",
    enum: Object.values(UserType),
    default: UserType.IE,
  })
  type: UserType;

  // ИИН пользователя (или БИН)
  @Column({ length: 12 })
  iin: string;

  // Роли пользователя
  @Column({
    type: "set",
    enum: Object.values(UserRole),
    default: [UserRole.USER]
  })
  roles: UserRole[];

  //  Пользователь активен?
  @Column({ default: true })
  active: boolean;

  // Баланс
  @Column("decimal", { default: 0, precision: 10, scale: 4 })
  balance: number;

  // Удаленный аккаунт
  @Column({ default: false })
  deleted: boolean;

  // Блокированный аккаунт
  @Column({ default: false })
  blocked: boolean;

  // Валюта
  @ManyToOne(type => Currency, currency => currency.users, { nullable: false, onDelete: 'CASCADE' })
  currency: Currency;

  // Обменники
  @OneToMany(type => Shop, shop => shop.user)
  shops: Shop[];

  // Транзакции
  @OneToMany(type => Transaction, transaction => transaction.user)
  transactions: Transaction[];

}
