	// - - - - - - - - - - - - - - - - - - - 
	// Случайное целое число в диапазоне

import { Shop } from "@entities/shop.entity"

	// - - - - - - - - - - - - - - - - - - - 
	export const randInt = function (min: number, max: number): number {
    return Math.floor(Math.random() * (max+1 - min)) + min
	}
	
	// - - - - - - - - - - - - - - - - - - - 
	// Случайный элемент из массива
	// - - - - - - - - - - - - - - - - - - - 
	export const randArr = function (arr: Array<any>): any {
		const i = randInt(0, arr.length-1)
		return arr[i]
  }

  // - - - - - - - - - - - - - - - - - - - 
	// Случайное True | False
	// - - - - - - - - - - - - - - - - - - - 
	export const randBool = function (p: number = 0.5): boolean {
		return Math.random() < p
  }

  // - - - - - - - - - - - - - - - - - - - 
	// Случайный идентификатор
	// - - - - - - - - - - - - - - - - - - - 
  export const randId = function (length: number, tp: string): string {
    let result = ''
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz0123456789'
    const digits = '0123456789'
    let characters = letters
    if (tp=="9")  characters = digits
    if (tp=="A9")  characters += digits
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  const dateStr = function (dt: Date) {
    return `${dt.getDate().toString().padStart(2, "0")}/${(dt.getMonth()+1).toString().padStart(2, "0")}/${dt.getFullYear().toString().padStart(4, "0")}T${dt.getHours().toString().padStart(2, "0")}:${dt.getMinutes().toString().padStart(2, "0")}:${dt.getSeconds().toString().padStart(2, "0")}`
  }

  export const fastRates = function (shop: Shop) {
    const frates = {}
    for (let rate of shop.rates) {
      if (rate.currency)
        frates[rate.currency.id] = { buy: rate.buy_value, sell: rate.sell_value }
    }
    return frates
  }

  export const extraInfo = function (shop) {
    const now = +Date.now()
    const ts = +new Date()
    const str = dateStr(new Date(ts))
    const status = (now - ts < 12*3600*1000) ? "live" : (now - ts < 24*3600*1000 ? "actual" : "expired")
    return {
      dt: str.slice(0,10),
      tm: str.slice(11,16),
      status: status,
    }
  }