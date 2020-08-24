<template lang="pug">
div DASHBOARD

</template>

<script lang="ts">

import { defineComponent, ref, computed, useMeta } from '@nuxtjs/composition-api'
import useLogic from '../common/logic/dashboard.logic'
import { ScrollOptions } from '../common/lib/proc'

export default defineComponent({

	middleware: 'dashboard',

	head: {},

	setup (props, context) {

		// Мета-данные
		useMeta({ title: 'EXCHANGE - Dashboard' })

		// Данные + Логика
		const data = useLogic(props, context)

		// Готовая коляска с данными
		return {
			...data,
		}

	}

})

</script>
