import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { TShop, TCurrency, TRegion, TCity } from '~/common/types/shops.types'
import { TUserCity, TUserToken, TUserDashboard } from '~/common/types/users.types'

export const state = () => ({

	// Базовые данные готовы?
	dataOk: false,

	// Токен пользователя
	userToken: null as TUserToken,

	// dashboard
	dashboard: {} as TUserDashboard,

	// Идентификатор текущего города
	cityId: parseInt(localStorage.cityId) || 108,

	// Обменники в текущем городе
	shops: [] as TShop[],

	// Обменники все
	allShops: [] as TShop[],

	// Полный список валют
	currencies: [] as TCurrency[],

	// Список регионов
	regions: [] as TRegion[],

	// Прогресс-бар
	loading: false,

})

export type State = ReturnType<typeof state>

export const mutations: MutationTree<State> = {

	SET_SHOPS (state: State, shops: Array<TShop>) {
		state.shops = shops
	},

	SET_ALL_SHOPS (state: State, shops: Array<TShop>) {
		state.allShops = shops
	},

	SET_CURRENCIES (state: State, currencies: Array<TCurrency>) {
		state.currencies = currencies
	},

	SET_REGIONS (state: State, regions: Array<TRegion>) {
		state.regions = regions
	},

	LOGON_USER (state: State, value: string) {
		state.userToken = value
	},

	LOGOFF_USER (state: State) {
		state.userToken = null
	},

	SET_CITY_ID (state: State, cityId: number) {
		state.cityId = cityId
		localStorage.cityId = String(cityId)
	},

	SET_LOADING (state: State, value=false) {
		state.loading = value
	},

	SET_DASHBOARD (state: State, value) {
		state.dashboard = value
	},

	SET_DATA_OK (state: State) {
		state.dataOk = true
	}

}

export const actions: ActionTree<State, State> = {

	async fetchShops ({ commit, state }, cityId: number): Promise<void> {
		const response = await this.$axios.$get('/shops?city='+(cityId || state.cityId))
		commit('SET_SHOPS', response.items)
	},

	async fetchAllShops ({ commit, state }): Promise<void> {
		const response = await this.$axios.$get('/shops?all=1')
		commit('SET_ALL_SHOPS', response.items)
	},

	async fetchDashboard ({ commit }): Promise<void> {
		const response = await this.$axios.$get('/users/dashboard')
		commit('SET_DASHBOARD', response)
	},

	async fetchCurrencies ({ commit }): Promise<void> {
		const response = await this.$axios.$get('/currencies')
		commit('SET_CURRENCIES', response.items)
	},

	async fetchRegions ({ commit }): Promise<void> {
		const response = await this.$axios.$get('/regions')
		commit('SET_REGIONS', response.items)
	},

	async setCityId ({ commit, dispatch }, cityId: number): Promise<void> {
		await dispatch("fetchShops", cityId)
		commit("SET_CITY_ID", cityId)
	},

	startLoading ({ commit }) {
		commit("SET_LOADING", true)
	},

	finishLoading ({ commit }) {
		commit("SET_LOADING", false)
	},

	alert(context, options) {
	},

	setDataOk ({ commit }) {
		commit("SET_DATA_OK")
	},

	async loginUser({ commit }, data) {
		const response = await this.$axios.$post("/auth/login", data)
		this.$axios.setToken(response.token, 'Bearer')
		commit("LOGON_USER", response.token)
		return response
	},

	async logoffUser({ commit }, data) {
		this.$axios.setToken(false)
		commit("LOGOFF_USER")
	},

	async signupUser(context, data) {
		return await this.$axios.$post("/user/signup", data)
	},

	async sendSmsCode(context, data) {
		return await this.$axios.$post("/send-sms-code", data)
	},

	async checkSmsCode(context, data) {
		return await this.$axios.$post("/check-sms-code", data)
	},

	async forgotPassword(context, data) {
		return await this.$axios.$post("/forgot-password", data)
	},
}

export const getters: GetterTree<State, State> = {

	userCity: state => {

		let userCity: TUserCity = {
			id: -1, name: '',
			region: { id: -1, name: '' }
		}

		for (const region of state.regions) {
			const city = region.cities.find(c => c.id === state.cityId)
			if (city) {
				userCity = {
					id: city.id, name: city.name,
					region: { id: region.id, name: region.name }
				}
				break
			}
		}

		return userCity

	},



}
