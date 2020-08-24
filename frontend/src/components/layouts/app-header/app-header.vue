<template lang="pug">
v-app-bar(
	app
	elevation="0"
)
	//- Гамбургер
	v-app-bar-nav-icon.hidden-md-and-up( @click="$eventHub.$emit('AppNavigation_TOGGLE')" )

	//- Курсы НБ
	app-header-rates-nb.hidden-sm-and-down

	v-spacer

	//- Добавить курс/Профиль
	//- AppHeaderUserArea

	div.pr-6.pt-1.d-flex.align-center
		v-btn(
			@click=""
			fab x-small icon
		)
			v-icon.primary--text(
				size="16"
			)  $search

		v-divider.my-2.ml-1.primary( vertical )

		v-btn(v-if="!!userToken" @click="$router.push('/dashboard')") LK
		v-btn(v-if="!!userToken" @click="$store.dispatch('logoffUser')") Log Out

		v-divider.my-2.ml-1.primary( vertical )

		v-menu( offset-y )
			//- Кнопка переключения языков
			template( v-slot:activator="{ on }" )
				v-btn.primary--text.text-subtitle-1(
					v-on="on"
					small
					text
					width="60"
				)
					span RU
					v-icon.mx-0( small ) $dropdown

			//- Список доступных языков
			v-list
				v-list-item(
					v-for="lang in languages"
					:key="lang.locale"
					@click="setActiveLanguage(lang)"
					dense
				)
					v-list-item-content
						v-list-item-title.text-subtitle-1 {{ lang.title }}

		v-divider.my-2.mr-1.primary( vertical )

		v-btn(
			@click="toggleNightMode"
			fab x-small icon
		)
			v-icon(
				:class="nightMode ? 'warning--text':'primary--text'"
				size="16"
			)  {{ nightMode ? '$sun' : '$moon' }}


</template>

<script>

import { ref, computed } from "@nuxtjs/composition-api"

export default {

	setup (props, { root: { $store } }) {

		const userToken = computed(() => $store.state.userToken)

		// night mode
		const nightMode = ref(false) //ref(JSON.parse(localStorage.nightMode || "false"))
		function toggleNightMode() {
			root.$vuetify.theme.dark = !root.$vuetify.theme.dark
			nightMode.value = root.$vuetify.theme.dark
			localStorage.nightMode = root.$vuetify.theme.dark
		}
		// Lang
		const languages = [
			{ title: "RU", locale: "ru_RU" },
			{ title: "EN", locale: "en_US" },
			{ title: "KZ", locale: "kz_KZ" },
		]
		function setActiveLanguage (lang) {
			root.$options.i18n.locale = lang.locale
			// localStorage.locale = lang.locale
			// window.location.reload()
		}

		return {
			userToken,

			//night mode
			nightMode, toggleNightMode,

			//lang
			languages, setActiveLanguage
		}
	}
}
</script>
