import { SetupContext, ref } from '@nuxtjs/composition-api'
import { fromContext } from '../lib/proc'

export default function (_: any, context: SetupContext) {

	const { $i18n, $v, $eventHub } = fromContext(context)

	const isOpen = ref(false)
	const shop = ref({})
	const mode = ref('')

	// eventHub
	$eventHub.$on("ShopFeaturesDialog_SHOW", (shopData: object, modeData: string) => {
		mode.value = modeData
		shop.value = shopData
		isOpen.value = true
	})

	// Закрыть диалог
	function closeDialog () {
		isOpen.value = false
	}

	return {
		isOpen, closeDialog, shop, mode
	}
}
