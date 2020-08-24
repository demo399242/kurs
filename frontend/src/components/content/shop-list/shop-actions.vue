<template lang="pug">
v-sheet.d-flex.justify-center( style="background-color:transparent;" )
	//- Режим работы 24/7 - иконка
	v-btn.px-0.mx-1.orange--text(
		v-if="shop.features['24/7']"
		min-width="36"
		text
	)
		v-icon( size="24" ) $roundTheClock

	//- Режим работы - кнопка
	v-hover( v-else v-slot:default="{ hover }" )
		v-btn.px-0.mx-1(
			@click.stop="shopFeaturesDialog('workingdays')"
			min-width="36"
			text
			:class=" hover ? 'primary' : 'primary--text' "
		)
			v-icon.mr-n1.mb-n1( size="24" ) $workDays

	v-divider.my-1( vertical )

	//- Телефоны - кнопка
	v-hover( v-slot:default="{ hover }" )
		v-btn.px-0.mx-1(
			@click.stop="shopFeaturesDialog('phones')"
			min-width="36"
			text
			:class=" hover ? 'primary' : 'primary--text' "
		)
			v-icon( size="24"  ) $phones

	v-divider.my-1( vertical )

	//- Особености - кнопка
	v-hover( v-slot:default="{ hover }" )
		v-btn.px-0.mx-1(
			@click.stop="shopFeaturesDialog('features')"
			min-width="36"
			text
			:class=" hover ? 'primary' : 'primary--text' "
			:disabled="noFeatures"
		)
			v-icon.mr-n1.mb-n1( size="26"  ) $aboutUs

</template>

<script lang="ts">

import { computed, ComputedRef, SetupContext } from '@nuxtjs/composition-api'

export default {
	props: [ "shop" ],

	setup (props: any, { root: { $options } }: SetupContext) {

		const noFeatures: ComputedRef<boolean>
			= computed(() => (["guard", "gold", "wholesale"]
				.every(feature => !props.shop[feature])))

		function shopFeaturesDialog (mode: string) {
			($options as any).$eventHub.$emit('ShopFeaturesDialog_SHOW', props.shop, mode)
		}

		return { noFeatures, shopFeaturesDialog }

	}

}
</script>

<style lang="sass">

</style>
