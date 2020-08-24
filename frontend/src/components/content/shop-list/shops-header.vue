<template lang="pug">
v-app-bar(
	flat absolute tag="div"
	height="88"
	:inverted-scroll="noHeader && $vuetify.breakpoint.smAndDown"
)
	v-row.mx-n2.align-center
		v-col.pa-2( cols="7" sm="5" md="4" )
			span.text-subtitle-2.text-sm-h6.text--disabled {{ $t('HOME.ОБМЕННИКИ') }}

		template( v-for="( currency, index ) in cols"	)
			v-col.pa-2.text-center(
				:class="colsClasses[index]"
				cols="5" md="3" lg="2"
			)
				v-btn.text-body-2.text-sm-subtitle-1(
					@click="pickCurrency( index, currency.name )"
					outlined color="primary"
					width="110"
					:small="$vuetify.breakpoint.xsOnly"
				)
					country-flag( :country="currency.flag" )
					span.ml-2.text--primary {{ currency.name }}

		v-col.px-2.py-0( cols="7" sm="4" md="3" )
			select-user-city.px-2.mx-n2

		v-col.px-2.py-0.hidden-xs-only( cols="2" md="1" )
			span.text-caption {{ $t('HOME.ВРЕМЯ') }}

		template( v-for="( currency, index ) in cols" )
			v-col.pa-0.text-center(
				:class="colsClasses[index]"
				cols="5" sm="3" lg="2"
			)
				//- Кнопка сортировать по полю "buy"
				v-btn.px-0.mr-0.mr-sm-2(
					@click="$emit('setSorting', index, 'buy')"
					x-small text
					:class="colsOptions.colIndex!=index || colsOptions.operation!='buy' ? 'text--secondary' : ''"
					:color="colsOptions.colIndex==index && colsOptions.operation=='buy' ? 'primary' : 'primary--text'"
				)
					span.text-overline.text-sm-caption {{ $t('HOME.ПРОДАЖА') }}
					v-icon( size="20" ) {{ currency.buyAz ? 'mdi-menu-down' : 'mdi-menu-up' }}

				//- Кнопка сортировать по полю "sell"
				v-btn.px-0(
					@click="$emit('setSorting', index, 'sell')"
					x-small text
					:class="colsOptions.colIndex!=index || colsOptions.operation!='sell' ? 'text--secondary' : ''"
					:color="colsOptions.colIndex==index && colsOptions.operation=='sell' ? 'primary' : 'primary--text'"
				)
					span.text-overline.text-sm-caption {{ $t('HOME.ПОКУПКА') }}
					v-icon( size="20" ) {{ currency.sellAz ? 'mdi-menu-down' : 'mdi-menu-up' }}

		v-col.px-2.py-0.text-center.hidden-xs-only( cols="3" md="2" )
			span.text-caption Информация

		v-col.pa-0( cols="12" )
			v-sheet.accent.mx-n2( height="2" style="opacity:.1" )

</template>

<script lang="ts">

import { ref, computed, defineComponent, SetupContext } from "@nuxtjs/composition-api"
import { TCurrency } from "../../../common/types/shops.types"

export default defineComponent({

	props: ["noHeader", "colsOptions", "colsClasses", "cols", "setSorting", "changeCurrency"],

	setup (props: any, context) {

		// Из контекста
		const emit = context.emit
		const $store = context.root.$store
		const $eventHub = (context.root.$options as any).$eventHub

		// Список валют для выбора (кроме золота и тенге)
		const currencies = computed(
			() => $store.state.currencies
			.filter((c: TCurrency) => c.name!="GOLD" && c.name!="KZT")
		)

		// Клик по столбцу-валюте
		function pickCurrency (colIndex: number, name: string) {
			$eventHub.$emit(
				"CurrencyDialog_SHOW", currencies.value, name,
				(crn: TCurrency) => { emit("changeCurrency", colIndex, crn) }
			)
		}

		// Коляска
		return { pickCurrency }

	},
})
</script>

<style lang="sass">

</style>
