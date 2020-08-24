
export default function ({ $axios, redirect, app: { i18n } }) {

	console.log("Plugin: axios; SSR: " + process.server + " injected")

	// onRequest
  $axios.onRequest(config => {
		//console.log('AXIOS REQUEST '+config.url)
	})

	// onResponse
	$axios.onResponse(config => {
		//console.log('AXIOS RESPONSE')
		if (Math.random() > 0.99) throw i18n.t("ИМИТАЦИЯ_РАЗРЫВА_СВЯЗИ")
		if (config.data.code==100) {
			config.data = config.data.response
		} else {
			throw i18n.t("SERVER."+config.data.error)
		}
	})

	$axios.onError(error => {
		console.log('AXIOS ERROR', error)
	})

}

// Подсказки

// export default function ({ $axios, redirect }) {
//   $axios.onRequest(config => {
//     console.log('Making request to ' + config.url)
//   })

//   $axios.onError(error => {
//     const code = parseInt(error.response && error.response.status)
//     if (code === 400) {
//       redirect('/400')
//     }
//   })
// }

// // Set baseURL (both client and server)
// this.$axios.setBaseURL('http://api.example.com')

// // Change URL only for client
// if (process.client) {
//   this.$axios.setBaseURL('http://api.example.com')
// }

// // Change URL only for server
// if (process.server) {
//   this.$axios.setBaseURL('http://api.example.com')
// }

// // Adds header: `Authorization: 123` to all requests
// this.$axios.setHeader('Authorization', '123')

// // Overrides `Authorization` header with new value
// this.$axios.setHeader('Authorization', '456')

// // Adds header: `Content-Type: application/x-www-form-urlencoded` to only post requests
// this.$axios.setHeader('Content-Type', 'application/x-www-form-urlencoded', [
//   'post'
// ])

// // Removes default Content-Type header from `post` scope
// this.$axios.setHeader('Content-Type', false, ['post'])


// Adds header: `Authorization: 123` to all requests
// this.$axios.setToken('123')

// // Overrides `Authorization` header with new value
// this.$axios.setToken('456')

// // Adds header: `Authorization: Bearer 123` to all requests
// this.$axios.setToken('123', 'Bearer')

// // Adds header: `Authorization: Bearer 123` to only post and delete requests
// this.$axios.setToken('123', 'Bearer', ['post', 'delete'])

// // Removes default Authorization header from `common` scope (all requests)
// this.$axios.setToken(false)











// // axios instance
// const apiClient = axios.create({
//   baseURL: "http://127.0.0.1/api/",
// 	withCredentials: false,
// 	timeout: process.env.VUE_APP_AXIOS_TIMEOUT || 10000,
//   headers: {
//     Accept: "application/json",
// 		"Content-Type": "application/json",
// 		"X-Requested-With": i18n.locale, // текущая локаль
//   }
// })

// // Добавляем заголовок Authorization: Bearer <Token>
// apiClient.interceptors.request.use(function (config) {
// 	if (localStorage.token)
// 		config.headers.Authorization = "Bearer "+localStorage.token
// 	return config
// })

// // Обрабатываем возможную ошибку от серверного API
// apiClient.interceptors.response.use(
// 	function (response) {
// 		if (Math.random() > 0.99) throw "Имитация разрыва связи"
// 		if (response.data.code==100) {
// 			return response.data.response
// 		} else {
// 			throw i18n.t(response.data.error)
// 		}
// 	},
// 	function (error) {
// 		return Promise.reject(error)
// 	}
// )
