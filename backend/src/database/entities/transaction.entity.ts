import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { Shop } from './shop.entity';
import { Currency } from './currency.entity';
import { User } from './user.entity';

export enum TransactionType {
  BALANCE="balance",
  WITHDRAW="withdraw",
}

@Entity()
export class Transaction {

  // Идентификатор
  @PrimaryGeneratedColumn()
  id: number;

  // Статус
  @Column({
    type: "enum",
    enum: Object.values(TransactionType),
    default: TransactionType.WITHDRAW,
  })
  type: TransactionType;
  
  // Создан
  @CreateDateColumn()
  created: Date;

  // Сумма транзакции
  @Column("decimal", { precision: 10, scale: 4 })
  sum: number;

  // Сумма транзакции в KZT
  // @Column("decimal", { precision: 10, scale: 4 })
  // baseSum: number;

  @ManyToOne(type => Shop, shop => shop.transactions, { nullable: true, onDelete: 'CASCADE' })
  shop: Shop;

  @ManyToOne(type => User, user => user.transactions, { nullable: false, onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(type => Currency, currency => currency.transactions, { nullable: false, onDelete: 'CASCADE' })
  currency: Currency;

}