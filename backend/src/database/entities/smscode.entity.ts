import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

//export const SmsCodeExpiredPeriod: number = 10*60*1000;

// Процесс-отправитель смс-кода
export enum SmsCodeOrigin { 
  SIGNUP_USER="signupUser", 
  FORGOT_PASSWORD="forgotPassword", 
  CHANGE_PHONE="changePhone" 
}

// Статус СМС-кода
export enum SmsCodeStatus { 
  CREATED="created", 
  VERIFIED="verified" 
}

@Entity()
export class SmsCode {

  // Идентификатор
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Телефон пользователя
  @Column({ length: 15 })
  phone: string;

  // Создан
  @CreateDateColumn()
  created: Date;

  // Актуален до
  @CreateDateColumn()
  expired: Date;

  // Количество попыток
  @Column({ default: 3 })
  chances: number;

  // Статус
  @Column({
    type: "enum",
    enum: Object.values(SmsCodeStatus),
    default: SmsCodeStatus.CREATED,
  })
  status: SmsCodeStatus;

  // Источник создания
  @Column({
    type: "enum",
    enum: Object.values(SmsCodeOrigin),
    default: SmsCodeOrigin.SIGNUP_USER,
  })
  origin: SmsCodeOrigin;

  // СМС-Код
  @Column({ length: 4 })
  code: string;

  // Статус доставки
  @Column({ default: false })
  delivered: boolean;

}