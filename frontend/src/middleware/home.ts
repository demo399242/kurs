import { Middleware } from '@nuxt/types'

const middleware: Middleware = async ({ store, error }) => {

	if (store.state.dataOk) return

	try {

		await Promise.all([
			store.dispatch('fetchShops'),
			store.dispatch('fetchRegions'),
			store.dispatch('fetchCurrencies'),
			store.dispatch('fetchAllShops'),
		])

		console.log("Data received")

		store.dispatch('setDataOk')

	} catch (err) {

		error(err)

	}

}

export default middleware
