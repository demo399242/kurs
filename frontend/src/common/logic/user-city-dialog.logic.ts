import { ref, computed, SetupContext, onMounted, Ref, ComputedRef } from '@nuxtjs/composition-api'
import { TCity, TRegion } from '../types/shops.types'
import { TUserCity } from '../types/users.types'
import { fromContext } from '../lib/proc'

export default function (props: any, context: SetupContext) {

	// Из контекста
	const { $store, $eventHub } = fromContext(context)

	// Модель, режим, города, выбранный регион
	const isOpen = ref(false)
	const mode = ref("regions")
	const cities: Ref<TCity[]|null> = ref(null)
	const selectedRegion: Ref<TRegion|null> = ref(null)

	// v-scroll
	const vScroll: Ref<any> = ref(null)

	// Регионы, текущий город
	const regions: ComputedRef<TRegion[]> = computed(() => $store.state.regions)
	const userCity: ComputedRef<TUserCity> = computed(() => $store.getters.userCity)

	// Коллбэк
	let callback: any = null

	// eventHub
	$eventHub.$on("UserCityDialog_SHOW", (cb: any) => {
		callback = cb
		isOpen.value = true
	})

	// Это главный город?
	function isMainCity(obj: TCity) {
		return obj.status<=2 || obj.isCity
	}

	// Клик по городу
	function cityClick (city: TCity) {
		closeDialog()
		$store.dispatch("startLoading")
		$store.dispatch("setCityId", city.id)
		.then(() => {
			if (callback) callback(city)
		})
		.finally(() => $store.dispatch("finishLoading"))
	}

	// Закрыть диалог
	function closeDialog () {
		mode.value = "regions"
		isOpen.value = false
		scrollTop()
	}

	// Клик по региону
	function regionClick (region: TRegion) {
		if (region.isCity) {
			cityClick(region.cities2[0])
			return
		}
		selectedRegion.value = region
		cities.value = region.cities
		mode.value = "cities"
		scrollTop()
	}

	// Назад к регионам
	function goBack () {
		mode.value = "regions"
		scrollTop()
	}

	// В самый вверх
	function scrollTop () {
		vScroll.value.scrollTo({ y: 0 }, 0)
	}

	return {
		isOpen, mode, cities, selectedRegion, regions, vScroll,
		userCity, isMainCity, regionClick, cityClick, goBack, closeDialog,
	}

}
