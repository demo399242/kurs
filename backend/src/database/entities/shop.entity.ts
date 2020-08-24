import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity'
import { ShopRate } from './shoprate.entity';
import { City } from './city.entity';
import { Transaction } from './transaction.entity';

// Тип шопа (обменник или ломбард)
export enum ShopType { EXCHANGER="exchanger", LOMBARD="lombard" }

// [ Latitude, Longitude ]
export type GeoCoords = [number, number]

// Features
export interface IFeatures {
  "24/7": boolean; 
  gold: boolean;
  guard: boolean;
  wholesale: boolean;
}

// WorkingDay
export interface IWorkingDay {
  day: string;
  active: boolean;
  from: string;
  till: string;
}

// WholeSale
export interface IWholeSale {
  currency: string;
  from: number;
}

// PhoneInfo
export interface IPhone {
  phone: string,
  whatsapp: boolean,
  telegram: boolean;
  telegram_name?: string;
}

@Entity()
export class Shop {

  // Идентификатор
  @PrimaryGeneratedColumn()
  id: number;

  // Наименование
  @Column({ length: 100 })
  name: string;

  @Column({
    type: "enum",
    enum: Object.values(ShopType),
    default: ShopType.EXCHANGER
  })
  type: ShopType;

  // Улица
  @Column({ length: 50 })
  street: string;

  // Номер дома
  @Column({ length: 7, default: '' })
  house: string;

  // Комментарий
  @Column({ length: 200, default: '' })
  comment: string;

  // Featues
  @Column('simple-json')
  features: IFeatures;

  // WorkingDays
  @Column('simple-json')
  workingdays: IWorkingDay[];

  @Column('simple-json')
  coords: GeoCoords;

  @Column('simple-json')
  phones: IPhone[];

  @Column('simple-json')
  wholesale: IWholeSale[];

  // Скрытый обменник
  @Column({ default: false })
  hidden: boolean;

  // Удаленный обменник
  @Column({ default: false })
  deleted: boolean;

  // Владелец
  @ManyToOne(type => User, user => user.shops, { nullable: false, onDelete: 'CASCADE' })
  user: User;

  // Город
  @ManyToOne(type => City, city => city.shops, { nullable: false, onDelete: 'CASCADE' })
  city: City;

  // Курсы
  @OneToMany(type => ShopRate, shoprate => shoprate.shop)
  rates: ShopRate[];

  // Транзакции
  @OneToMany(type => Transaction, transaction => transaction.shop)
  transactions: Transaction[];

}

export class ExtraShop {
  rates: any;
  extra: any;
  ratesupdated: any;
}

