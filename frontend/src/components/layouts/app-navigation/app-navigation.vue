<template lang="pug">
v-navigation-drawer(
	v-model="appNavigationStatus"
	class="pl-0 pl-md-4"
	app	floating
	width="280"
	:mini-variant="$vuetify.breakpoint.md"
	mini-variant-width="72"
	:permanent="$vuetify.breakpoint.md"
)
	//- Logo
	template( v-slot:prepend )
		v-list-item.pt-1.pb-4.pb-lg-2.px-2( @click="$router.push('/')")
			v-list-item-avatar.mr-1.mr-lg-3( tile height="36" width="36" )
				img(alt="logo" src="~/static/logo.svg")
			v-list-item-content
				v-list-item-title.text-h5 {{ $t('GLOBAL.ИМЯ_САЙТА') }}

	//- Navigation conteiner
	v-sheet.gradient-to-bottom.rounded-t-lg.pa-4.pa-md-2.pa-lg-4(	height="100%" )
		v-btn.text-uppercase.text-button(
			@click="$eventHub.$emit('LoginDialog_SHOW')"
			rounded color="success" elevation="0"
			:block="!$vuetify.breakpoint.mdOnly"
			:large="!$vuetify.breakpoint.mdOnly"
			:fab="$vuetify.breakpoint.mdOnly"
			:small="$vuetify.breakpoint.mdOnly"
			min-width="36"
		)
			v-icon.rounded-circle.ml-n6.ml-md-0.ml-lg-n3.mr-2.mr-md-0.mr-lg-2.pa-1(
				style="background: rgba(255,255,255,.2)"
				size="26"
			) mdi-plus
			span.pr-8.hidden-md-only Добавить курс

		v-divider.my-4.secondary

		//- Выбор города
		select-user-city.px-2.mx-n2( :dark="true" :tablet="true" )

		//- Меню
		v-list-item.mt-3.px-0.px-md-1.px-lg-0( dark )
			v-list-item-content
				v-list-item-title.text-body-2.text-md-overline.text-lg-body-2(
					style="opacity:.3"
				) {{ $t('SIDEBAR.МЕНЮ') }}
		//- Navigation item
		v-sheet( color="transparent" )
			app-navigation-menu

</template>

<script>

import { ref, onMounted } from "@nuxtjs/composition-api"

export default {

	setup (props, { root }) {
		const appNavigationStatus = ref(root.$vuetify.breakpoint.mdAndUp)
		root.$options.$eventHub.$on("AppNavigation_TOGGLE", () => appNavigationStatus.value = !appNavigationStatus.value)
		return { appNavigationStatus }
	}
}
</script>

<style lang="sass" scoped>
.gradient-to-bottom
	background: linear-gradient(to bottom, var(--v-primary-base), var(--v-accent-base))
</style>
