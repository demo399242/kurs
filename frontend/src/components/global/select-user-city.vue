<template lang="pug">
v-list-item.rounded(
	@click="pickUserCity()"
	:dark="dark"
	style="overflow:hidden; min-height: 36px;"
)
	v-list-item-icon(
		:class="className"
		style="margin-top: 5px"
	)
		v-icon(
			:class="{ 'primary--text': !dark }"
		) $userCity
	v-list-item-content.py-0
		v-list-item-subtitle.mb-n1.text-overline(
			style="opacity:.6"
		) {{ userCity.region.name }}
		v-list-item-title.text-body-2(
			:class="{ 'primary--text': !dark }"
		) {{ userCity.name }}

</template>

<script>
// Script import
import { computed } from "@nuxtjs/composition-api"

export default {

	props: {
		dark: {
			type: Boolean,
			default: false
		},
		tablet: {
			type: Boolean,
			default: false
		},
	},

	setup (props, { root: { $store, $options: { $eventHub } } }) {

		const userCity = computed(() => $store.getters.userCity)
		const className = props.tablet ? ['mr-4', 'mr-md-0', 'mr-lg-4', 'mb-0'] : ['mr-4', 'mb-0']

		function pickUserCity () {
			$eventHub.$emit("UserCityDialog_SHOW")
		}

		return { userCity, pickUserCity, className }
	},
}
</script>
