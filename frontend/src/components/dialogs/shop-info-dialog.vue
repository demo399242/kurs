<template lang="pug">
v-dialog(v-model="isOpen" max-width="300" height="500"  @click:outside="closeDialog")
	v-card()
		//- Заголовок диалога
		v-card-title.px-0.py-1.secondary
			v-list-item
				v-list-item-content
					v-list-item-title.text-h6.text--disabled {{ shop.name }}
				v-list-item-action
					v-icon(@click="closeDialog") $close

		v-divider
		div(v-if="mode=='workingdays'" ) workingdays
			div {{ shop }}
		div(v-if="mode=='phones'" ) phones
		div(v-if="mode=='features'" ) features

</template>

<script lang="ts">

import { defineComponent } from "@nuxtjs/composition-api"
import useLogic from "../../common/logic/shop-info-dialog.logic"

export default defineComponent({

	setup: useLogic

})
</script>
