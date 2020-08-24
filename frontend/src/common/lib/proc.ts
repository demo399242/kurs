import { TUserToken, TUserObject } from "../types/users.types"
import { TCurrency, TShopRates, TShop } from "../types/shops.types"
import { TCalcChain } from "../types/calc.types"
import { SetupContext } from "@nuxtjs/composition-api"

// 79653121212 -> +7(965)312-12-12
export const phoneStr = function (phone: string): string {
	if(!phone) return ""
	return "+" + phone.slice(0,1) + " ("+phone.slice(1,4)+") " +
		phone.slice(4,7)+"-"+phone.slice(7,9)+"-"+phone.slice(9,11)
}

// date -> "21/12/2020 15:59:56"
export const dateStr = function (dt: Date): string {
	return `${dt.getDate().toString().padStart(2, "0")}/${(dt.getMonth()+1).toString().padStart(2, "0")}/${dt.getFullYear().toString().padStart(4, "0")}T${dt.getHours().toString().padStart(2, "0")}:${dt.getMinutes().toString().padStart(2, "0")}:${dt.getSeconds().toString().padStart(2, "0")}`
}

// Java Web Token decoding
export const decodeJWT = function (token: TUserToken): TUserObject|null {
	if (!token) return null
	try {
		return JSON.parse(window.atob(token.split(".")[1]))
	} catch {
		return null
	}
}

// format sum (for calculator) - перенести потом
export const formatSum = function (sum: number): string {
	const res = sum.toFixed(0)
	if (Number(res)===0 || String(res).length>9) return ""
	return res
}

// 123345 -> "123,345"
export const numberWithCommas = function (x: number, sep="\u202F") {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, sep);
}

// Сформировать объект цепочка (for calculator) - перенести потом
export const calcChain = function (
	rates: TShopRates, crn1: TCurrency, crn2: TCurrency,
	sum1: string, sum2: string, rtl: boolean, crnKZT: TCurrency
): TCalcChain {
	const name1 = crn1.name
	const name2 = crn2.name
	const nSum1 = Number("0"+sum1)
	const nSum2 = Number("0"+sum2)
	const rate1 = Number((name1=="KZT" || name1==name2) ? 1 : rates[name1].buy)
	const rate2 = Number((name2=="KZT" || name1==name2) ? 1 : rates[name2].sell)
	// Расчет
	const res = rtl ? nSum2 * rate2 : nSum1 * rate1
	if (rtl) {
		sum1 = formatSum(res / rate1)
		sum2 = formatSum(nSum2)
	} else {
		sum1 = formatSum(nSum1)
		sum2 = formatSum(res / rate2)
	}
	return [
		{ name1, name2: "KZT", sum1, sum2: formatSum(res), rate: rate1, text1: crn1.text, text2: crnKZT.text },
		{ name1: "KZT", name2, sum1: formatSum(res), sum2, rate: rate2, text1: crnKZT.text, text2: crn2.text },
	]
}

// Оплачен ли обменник
export const shopIsPaid = function (shop: TShop): boolean {
	if (!shop) return false
	return shop.paid_dtm > new Date()
}

interface TI18n {
	t: Function
}

export const fromContext = (context: SetupContext) => {

	return {
		$axios: context.root.$axios,
		$eventHub: (context.root.$options as any).$eventHub,
		$store: context.root.$store,
		$set: context.root.$set,
		$v: (context.root.$options as any).$v,
		$vuetify: context.root.$vuetify,
		$recaptcha: (context.root.$options as any).$recaptcha,
		$i18n: context.root.$options.i18n as TI18n,
		$router: context.root.$router,
		$route: context.root.$route,
		$nextTick: context.root.$nextTick,
		$parent: context.parent,
		$emit: context.emit,
		//context
	}

}

export class ScrollOptions {

	vuescroll = {}

	scrollPanel=  {
		scrollingX: false,
	}

	rail = {
		size: "10px",
		gutterOfEnds: '4px',
		gutterOfSide: '0px',
	}

	bar = {
		keepShow: true,
		background: "#2D85DD",
		opacity: 0.3,
		size: "8px",
	}

}
