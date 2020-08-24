import { ERRORS, myException } from './error-codes'
import { TUserType } from '../types/users.types';

export const clearedPhone = (v: string) => v ? v.replace(/\D/g, "") : ""

export const phoneMask = "+#(###)###-##-##"
export const binMask = "############"

// // C_USER_TYPES array
// export const C_USER_TYPES = [
// 	{ value: "ie", text: "Индивидуальный предприниматель (ИП)" },
// 	{ value: "llp", text: "Товарищество (ТОО)" },
// ]

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
  ieName,
  llpName,
	userType,
	captchaToken,
}

type ValidationFieldRules = {
	[key in Rules]: Array<Function>;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Правила валидации
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
type RuleResult = Number | Boolean;
const validationFieldRules: ValidationFieldRules = {

	[Rules.phone]: [
		(v: string, f: boolean): RuleResult => !f || !!v || ERRORS.PHONE_REQUIRED,
		(v: string, f: boolean): RuleResult => !f || clearedPhone(v).length==11 || ERRORS.PHONE_INCORRECT,
	],

	[Rules.ieName]: [
		(v: string, f: boolean): RuleResult => !f || !!v || ERRORS.IENAME_REQUIRED,
    (v: string, f: boolean): RuleResult => !f || v.length>=2 || ERRORS.IENAME_MINLENGTH,
  ],

	[Rules.llpName]: [
		(v: string, f: boolean): RuleResult => !f || !!v || ERRORS.LLPNAME_REQUIRED,
    (v: string, f: boolean): RuleResult => !f || v.length>=2 || ERRORS.LLPNAME_MINLENGTH,
  ],

	[Rules.captcha]: [
		(v: string, f: boolean): RuleResult => !f || !!v || ERRORS.CAPTCHA_REQUIRED,
	],

	[Rules.password]: [
		(v: string, f: boolean): RuleResult => !f || !!v || ERRORS.PASSWORD_REQUIRED,
  ],

	[Rules.captchaToken]: [
		(v: string, f: boolean): RuleResult => !f || !!v || ERRORS.CAPTCHA_REQUIRED,
  ],

	[Rules.iin]: [
		(v: string): RuleResult => !!v || ERRORS.IIN_REQUIRED,
		(v: string, f: boolean): RuleResult => !f || v.replace(/\D/g, '').length==12 || ERRORS.IIN_INCORRECT,
	],

	[Rules.bin]: [
		(v: string, f: boolean): RuleResult => !f || !!v || ERRORS.BIN_REQUIRED,
		(v: string, f: boolean): RuleResult => !f || v.replace(/\D/g, '').length==12 || ERRORS.BIN_INCORRECT,
  ],

	[Rules.newPassword]: [
		(v: string, f: boolean): RuleResult => !f || !!v || ERRORS.PASSWORD_REQUIRED,
		(v: string, f: boolean, p2: string): RuleResult => !f || !p2 || v==p2 || ERRORS.PASSWORDS_NOT_EQUAL,
		(v: string, f: boolean): RuleResult => !f || v.length>=6 || ERRORS.PASSWORD_MINLENGTH,
	],

	[Rules.userType]: [
		(v: TUserType, f: boolean): RuleResult => !f || !!v || ERRORS.USERTYPE_REQUIRED,
	],

}

export class Validator {

	i18n: any = null

	constructor (i18n: any) {
		this.i18n = i18n
	}

	throw(errCode: number, params: any): never {
		throw this.i18n.t("CLIENT."+ERRORS[errCode], params)
	}

	validate (field: Rules, value: any, final?: boolean, value2?: any): string|undefined {
		const rules = validationFieldRules[field]
		if (!rules) return
		for (const rule of rules) {
			const result = rule(value, final, value2)
			if (result!==true) return this.i18n.t("CLIENT."+ERRORS[result])
		}
	}

}






