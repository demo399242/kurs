import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity'
import { Shop } from './shop.entity';
import { Currency } from './currency.entity';

@Entity()
export class ShopRate {

  // Обменник
  @ManyToOne(type => Shop, shop => shop.rates, { primary: true, nullable: false, onDelete: 'CASCADE' })
  shop: Shop;

  // Валюта
  @ManyToOne(type => Currency, currency => currency.rates, { primary: true, nullable: false, onDelete: 'CASCADE' })
  currency: Currency;

  @Column({ length: 10 })
  buy_value: string;

  @Column({ length: 10 })
  sell_value: string;

}