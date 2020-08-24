<template lang="pug">
v-app
	app-navigation
	app-header
	v-main
		nuxt( keep-alive )


	dialogs

</template>

<script lang="ts">

import { defineComponent } from "@nuxtjs/composition-api"

export default defineComponent({
	middleware: 'home',
})
</script>
