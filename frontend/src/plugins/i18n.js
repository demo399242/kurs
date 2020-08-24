import Vue from "vue"
import VueI18n from "vue-i18n"

Vue.use(VueI18n);

export default ({ app }) => {

	console.log("Plugin: i18n; SSR: " + process.server + " injected")

  app.i18n = new VueI18n({
    locale: "ru_RU",
		locales: ['ru_RU','en_US','kz_KZ'],
    fallbackLocale: "ru_RU",
    messages: {
      ru_RU: require("~/plugins/locale/ru_RU.json"),
      en_US: require("~/plugins/locale/en_US.json"),
      kz_KZ: require("~/plugins/locale/kz_KZ.json"),
    }
  })
}
