<template lang="pug">
div
	div(v-if="!!userToken")

		v-btn(
			@click="logoffUser()"
		) Выход

		v-btn(@click="$router.push({ name: 'dashboard' }).catch(() => {})") LK


	div(v-else)
		//- Пока в процессе разработки
		v-btn.mr-12(
			@click="eventHub.$emit('LoginDialog_SHOW')"
			min-width="40"
			elevation="1"
			rounded
			color="primary"
		)
			v-icon.ml-n2(
				style="margin-top:-2px"
				size="19"
			) $plusCircle
			v-divider.mx-2.my-1(vertical dark)

			span {{ $t('HEADER.КУРС') }}

</template>

<script lang="ts">

import { computed, defineComponent, SetupContext, PropOptions } from "@vue/composition-api"

export default defineComponent({

	setup (props, { root: { $store, $router } }: SetupContext) {

		const userToken = computed(() => $store.state.userToken)

		function logoffUser () {
			$store.dispatch("logoffUser")
			$router.push("/")
		}

		return { userToken, logoffUser }
	}

})

</script>
