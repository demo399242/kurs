

export default {

	server: {
    port: 8080,
		host: '0.0.0.0',
	},

	srcDir: 'src/',

	mode: 'spa',

	target: 'server',

	loading: {
    color: 'blue',
	},

	head: {
		title: 'EXCHANGE',
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
		],
		link: [
			{ rel: 'icon', type: 'image/png', href: '/favicon.png' },
			{ rel: 'stylesheet', type: 'text/css', href: 'https://fonts.googleapis.com/css?family=Open Sans:100,300,400,500,600,700,900' },
			{ rel: 'stylesheet', type: 'text/css', href: 'https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons.min.css' },
		]
	},

	css: [
		'~/assets/styles/main.sass',
	],

	plugins: [
		"~/plugins/i18n",
		"~/plugins/event-hub",
		"~/plugins/validator",
		'~/plugins/vuescroll',
		"~/plugins/vue-the-mask",
		"~/plugins/axios",
	],

	components: true,

	buildModules: [
		'@nuxt/typescript-build',
		'@nuxtjs/composition-api',
		'@nuxtjs/vuetify',
	],

	modules: [
		'@nuxtjs/axios',
		'@nuxtjs/recaptcha',
	],

	recaptcha: {
		siteKey: '6LfW1OYUAAAAABxyqIqUr0eWfGnSTf1G-QTNaSEA', //process.env.RECAPTCHA_SITEKEY,
		version: 2,
		size: 'invisible',
		hideBadge: false,
  },

	axios: {
		//baseURL: 'http://localhost:3000',
	},

	publicRuntimeConfig: {
    axios: {
			browserBaseURL: process.env.AXIOS_BROWSER_BASE_URL,
			timeout: process.env.AXIOS_TIMEOUT,
    }
  },

  privateRuntimeConfig: {
    axios: {
      baseURL: process.env.AXIOS_BASE_URL,
    }
  },

	vuetify: {
		customVariables: ["~/assets/styles/variables.scss"],
		treeShake: true,
		defaultAssets: false,
		optionsPath: '~/plugins/vuetify.options.js',
	},

	build: {
	},

	env: {
		//RECAPTCHA_SITEKEY: process.env.RECAPTCHA_SITEKEY || '',
    LOGIN_PHONE: process.env.LOGIN_PHONE || '',
    LOGIN_PASSWORD: process.env.LOGIN_PASSWORD || '',
  }
}
