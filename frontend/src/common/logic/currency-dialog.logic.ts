import { ref, SetupContext, onMounted, Ref, ComputedRef } from '@nuxtjs/composition-api'
import { TCurrency } from '../types/shops.types'
import { fromContext } from '../lib/proc'

export default function (_: any, context: SetupContext) {

	// Из контекста
	const { $store, $eventHub } = fromContext(context)

	// Данные
	const isOpen = ref(false)
	const vScroll: Ref<any> = ref(null)

	// Список валют, текущая валюта
	const currencyList = ref([] as TCurrency[])
	const currentName = ref("")

	// Модель для списка (чтобы потом сбросить выделение)
	const selection = ref(null)

	// Обратный вызов
	let callback: any = null

	// Закрыть диалог
	function closeDialog () {
		isOpen.value = false
		selection.value = null
		scrollTop()
	}

	// Клик по валюте
	function currencyClick (currency: TCurrency) {
		closeDialog()
		if (!callback) return
		setTimeout(() => callback(currency), 80)
	}

	// Скролл в верх списка
	function scrollTop () {
		vScroll.value.scrollTo({ y: 0 }, 0)
	}

	// eventHub
	$eventHub.$on("CurrencyDialog_SHOW",
		(currencies: TCurrency[], name: string, cb: any) => {
			currencyList.value = currencies
			currentName.value = name
			callback = cb
			isOpen.value = true
		}
	)

  // Коляска
	return {
		currentName, selection, isOpen, closeDialog,
		vScroll, currencyClick, currencyList
	}

}

