import { ref, computed, SetupContext } from '@nuxtjs/composition-api'
import { TCurrency, TShopOperation } from '../types/shops.types'
import { fromContext } from '../lib/proc'

export default function (props: any, context: SetupContext) {

	// Из контекста
	//const { $set, $i18n, $v, $store, $eventHub, $nextTick } = fromContext(context)

	// Более выгодный курс
	function isBestOffer(currency: TCurrency, op: TShopOperation) {
		if (!props.bestRates[currency.name]) return false
		if (!props.shop.rates[currency.name]) return false
		return (props.shop.rates[currency.name][op]===props.bestRates[currency.name][op+"_value"])
	}

	// Обменник открыт в данный момент?
	function shopIsOpen(shop: any) {
		return Math.floor(Math.random()*2)
	}


	// Данные + Логика
	return {
		shopIsOpen, isBestOffer,
	}
}



