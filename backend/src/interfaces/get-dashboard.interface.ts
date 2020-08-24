import { User } from '../database/entities/user.entity'
import { Shop } from '../database/entities/shop.entity'
import { Transaction } from '../database/entities/transaction.entity'

export interface IGetDashboardInfoResult {
  userInfo: User;
  shops: Array<Shop>;
  transactions: Array<Transaction>
}