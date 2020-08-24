import { Middleware } from '@nuxt/types'

// let ts: number = 0

const middleware: Middleware = async ({ store, error }) => {

	console.log('middleware (dashboard)')

	try {

		await store.dispatch('fetchDashboard'),

		console.log('middleware done')

	} catch (err) {

		error(err)

	}

}

export default middleware
