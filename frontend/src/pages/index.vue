<template lang="pug">
v-container.px-0.px-sm-4.pt-2(fluid)
	v-sheet.rounded-lg.shadow-box.px-4.list-header(
		:class="{ 'list-header-no': noHeader && $vuetify.breakpoint.smAndDown }"
	)
		shops-header(
			:cols-options="colsOptions"
			:cols="cols"
			:no-header="noHeader"
			:cols-classes="colsClasses"
			@setSorting="setSorting"
			@changeCurrency="changeCurrency"
		)
		vue-scroll.list-content(
			:ops="scrollOptions"
			:class="{ 'list-content-no': noHeader && $vuetify.breakpoint.smAndDown }"
			v-touch="swipeFunctions"
		)
			shop-item(
				v-for="(shop, index) in sortedShops" :key="shop.id"
				v-if="loading || index<listCount"
				:shop="shop"
				:cols-classes="colsClasses"
				:cols="cols"
				:best-rates="bestRates"
			)

</template>

<script lang="ts">

import { defineComponent, ref, computed, useMeta } from '@nuxtjs/composition-api'
import useLogic from '../common/logic/home.logic'
import { ScrollOptions } from '../common/lib/proc'

export default defineComponent({

	head: {},

	setup (props, context) {

		// Мета-данные
		useMeta({ title: 'EXCHANGE - Home' })

		// Данные + Логика
		const data = useLogic(props, context)

		// Опции для vue-скроллинга
		const scrollOptions = new ScrollOptions()

		// Классы видимости для 3-х колонок
		const colsClasses = ["", "hidden-sm-and-down", "hidden-md-and-down"]

		// Готовая коляска с данными
		return {
			...data, scrollOptions, colsClasses,
		}

	}

})

</script>

<style lang="sass" scoped>

.list-header
	padding-top: 90px
	position: relative
	overflow: hidden

.list-header-no
	padding-top: 0px

.list-content
	height: calc(100vh - 174px) !important
	width: calc(100% + 12px) !important

.list-content-no
	height: calc(100vh - 70px) !important

</style>





