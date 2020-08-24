import { Entity, Column, PrimaryColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { ShopRate } from './shoprate.entity';
import { User } from './user.entity';
import { Transaction } from './transaction.entity';

@Entity()
export class Currency {

  // Идентификатор
  @PrimaryColumn({ length: 5 })
  id: string;

  // Наименование
  @Column({ length: 5 })
  name: string;

  // Наименование
  @Column({ length: 30 })
  text: string;

  // Количество цифр после запятой в курсах
  @Column('tinyint')
  pp: number;

  // Флаг
  @Column({ length: 30 })
  flag: string;
  
  // Базовая
  @Column()
  base: boolean;

  // Золото?
  @Column()
  gold: boolean;

  // Количество цифр после запятой в курсах
  @Column('tinyint')
  digits: number;

  // Курсы
  @OneToMany(type => ShopRate, shopRate => shopRate.currency)
  rates: ShopRate[];

  // Пользователи
  @OneToMany(type => User, user => user.currency)
  users: User[];

  // Транзакции
  @OneToMany(type => Transaction, transaction => transaction.currency)
  transactions: Transaction[];

}