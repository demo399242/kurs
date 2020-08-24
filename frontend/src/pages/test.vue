<template lang="pug">
div.pa-3
	v-sheet
		span COUNTER: {{ counter }}
		v-btn.accent.mx-3(small @click="counter=counter+1" ) Increment
	v-sheet.py-1
		v-btn.accent.mr-3(small @click="fetchRegions()" ) Load regions
		v-btn.accent.mr-3(small @click="clear()" ) Clear
		v-btn.accent(small @click="fetchRegions2()" ) Load regions2
	v-sheet
		template( v-for="region in regions" )
			div {{ region.name }}

</template>

<script lang="ts">

import { ref, defineComponent, useAsync, useFetch, useMeta, useContext, SetupContext } from '@nuxtjs/composition-api'
import { fromContext } from '../common/lib/proc'

export default defineComponent({

	head: {},

	setup (props, context: SetupContext ) {

		const { $axios } = fromContext(context)

		useMeta({ title: "EXCHANGE - Test" })

		const counter = ref(0)
		const regions = ref([])


		const fetchRegions = async () => {
			const response = await $axios.get('/regions')
			console.log(response)
			regions.value = response.data.items
		}

		const clear = () => regions.value = []

		const fetchRegions2 = async () => {
			const response:any = await $axios.get('/shops')
			regions.value = response.data.items
		}

		return { counter, regions, fetchRegions, clear, fetchRegions2  }
	}

})
</script>
