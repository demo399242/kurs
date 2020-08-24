import { HttpException } from "@nestjs/common"
import { UserType, User, ProfileField } from '../../database/entities/user.entity'
import { SmsCodeOrigin } from '../../database/entities/smscode.entity'
import { errors, myException } from '../../common/misc/error-codes'
import { Shop } from "../../database/entities/shop.entity";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Валидируемые поля
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
export enum Rules {
  bin, 
  captcha, 
  iin, 
  newPassword, 
  password, 
  phone, 
  profileField,
  shopNotDeleted,
  shopNotHidden, 
  smsCodeId, 
  smsCodeOrigin,
  userNotBlocked, 
  userNotDeleted,
  userNotDeletedOrBlocked,
  userName, 
  userType, 
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Правила валидации
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
type RuleResult = Number | Boolean;
const validationFieldRules = {

  phone: [
    (v: string): RuleResult => !!v || errors.PHONE_REQUIRED,
    (v: string): RuleResult => v.replace(/\D/g, '').length==11 || errors.PHONE_INCORRECT,
  ],

  userName: [
    (v: string): RuleResult => !!v || errors.USERNAME_REQUIRED,
  ],

  captcha: [
    (v: string): RuleResult => !!v || errors.CAPTCHA_REQUIRED,
  ],

  password: [
    (v: string): RuleResult => !!v || errors.PASSWORD_REQUIRED,
  ],

  iin: [
    (v: string): RuleResult => !!v || errors.IIN_REQUIRED,
    (v: string): RuleResult => v.replace(/\D/g, '').length==12 || errors.IIN_INCORRECT,
  ],

  bin: [
    (v: string): RuleResult => !!v || errors.BIN_REQUIRED,
    (v: string): RuleResult => v.replace(/\D/g, '').length==12 || errors.BIN_INCORRECT,
  ],

  newPassword: [
    (v: string): RuleResult => !!v || errors.PASSWORD_REQUIRED,
    (v: string): RuleResult => v.length>=6 || errors.PASSWORD_MINLENGTH,
  ],

  userType: [
    (v: UserType): RuleResult => (Object.values(UserType).includes(v)) || errors.USERTYPE_INCORRECT,
  ],

  smsCodeOrigin: [
    (v: SmsCodeOrigin): RuleResult => (Object.values(SmsCodeOrigin).includes(v)) || errors.SMSCODEORIGIN_INCORRECT,
  ],

  profileField: [
    (v: ProfileField): RuleResult => (Object.values(ProfileField).includes(v)) || errors.PROFILEFIELD_INCORRECT,
  ],

  userNotBlocked: [
    (user: User): RuleResult => !user.blocked || errors.USER_BLOCKED,
  ],

  userNotDeleted: [
    (user: User): RuleResult => !user.deleted || errors.USER_DELETED,
  ],

  userNotDeletedOrBlocked: [
    (user: User): RuleResult => !user.deleted || errors.USER_DELETED,
    (user: User): RuleResult => !user.blocked || errors.USER_BLOCKED,
  ],

  shopNotHidden: [
    (shop: Shop): RuleResult => !shop.hidden || errors.SHOP_HIDDEN,
  ],
  
  shopNotDeleted: [
    (shop: Shop): RuleResult => !shop.deleted || errors.SHOP_DELETED,
  ]


};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Проверить поле field со значением value
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
export const validateField = (field: Rules, value: any): void => {
  const rules = validationFieldRules[Rules[field]];
  if (!rules) return;
  for (const rule of rules) {
    const result = rule(value);
    if (result!==true) myException(result);
  }
};



