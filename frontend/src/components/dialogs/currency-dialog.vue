<template lang="pug">
v-dialog(v-model="isOpen" max-width="300px" @click:outside="closeDialog")
	//- Карточка диалога
	v-card
		//- Заголовок диалога
		v-card-title.pa-1.primary
			v-list-item(dark)
				v-list-item-content
					v-list-item-title.pl-2 {{ $t('DIALOG.СПИСОК_ВАЛЮТ') }}
				v-divider.my-2(vertical)
				v-list-item-action
					v-icon(@click="closeDialog") $close

		//- конткнт
		v-card-text.pa-1
			vue-scroll(style="height: 300px" :ops="scrollOptions" ref="vScroll")
				v-list(subheader)
					v-list-item-group(v-model="selection")
						template(v-for="currency in currencyList")
							//- элемент списка
							v-list-item(
								v-if="currency.name!='GOLD'"
								@click="currencyClick(currency)"
								:class="currency.name==currentName ? 'secondary lighten-1' : ''"
								v-ripple="{ class: 'primary--text'}"
								dense
							)
								v-list-item-avatar.rounded
									country-flag.rounded(
										:country="currency.flag"
										width="30"
										height="20"
									)

								v-list-item-content
									v-list-item-title.text-subtitle-1.font-weight-bold {{ currency.name }}
									v-list-item-subtitle.text-caption {{ currency.text }}

								v-list-item-action(v-if="currency.name==currentName")
									v-icon.success--text(size="30") $complete
							v-divider


	//- v-card
	//- 	v-card-text
	//- 		div {{ 123 }}
	//- 		//- div {{ currencyList }}
	//- 		//- v-btn(@click="currencyClick({ name:'EUR' })")
</template>

<script lang="ts">

import { ref, defineComponent } from "@nuxtjs/composition-api"
import useLogic from "../../common/logic/currency-dialog.logic"

export default defineComponent({

	setup (props, context) {

		// Данные + Логика
		const data = useLogic(props, context)

		// Опции для скроллинга
		const scrollOptions = {
			vuescroll: {},
			scrollPanel: {
				scrollingX: false,
			},
			rail: {
				size: "8px",
			},
			bar: {
				keepShow: true,
				background: "#c1c1c1",
				opacity: 0.5,
				size: "6px",
			},
		}

		// Готовая коляска с данными
		return { ...data, scrollOptions }

	},


})
</script>
