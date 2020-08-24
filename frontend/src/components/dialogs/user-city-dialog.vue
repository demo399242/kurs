<template lang="pug">
v-dialog(v-model="isOpen" max-width="600" @click:outside="closeDialog")
	v-card(height="500")
		//- Заголовок диалога
		v-card-title.px-0.py-1.secondary
			v-list-item
				v-list-item-content
					v-list-item-title.text-h6.text--disabled {{ $t('SIDEBAR.ВЫБЕРИТЕ_ГОРОД') }}
				v-list-item-action
					v-icon(@click="closeDialog") $close

		v-divider

		//- Контент диалога
		v-card-text.px-0

			//- Кнопка "Назад в Регионы"
			template(v-if="mode=='cities'")
				v-list-item(
					@click="goBack"
				)
					v-list-item-icon.mr-2.ml-n1.my-3
						v-icon.mr-1 $chevronLeft
						v-divider(vertical)
					v-list-item-content
						v-list-item-title.accent--text {{ selectedRegion.name }}

				v-divider

			//- Список
			vue-scroll(
				:style="mode=='regions' ? 'height:300px' : 'height:252px' "
				:ops="scrollOptions"
				ref="vScroll"
			)

				//- Регионы
				template(v-if="mode=='regions'")
					template(v-for="region in regions")
						v-list-item(
							@click="regionClick(region)"
						)
							v-list-item-content
								v-list-item-title.pl-2(:class="{ 'font-weight-bold': isMainCity(region) }") {{ region.name }}
							v-list-item-action(v-if="!region.isCity")
								v-icon $chevronRight
							v-list-item-action(v-if="region.isCity && region.cities2[0].id==userCity.id")
								v-icon.success--text(size="30") $complete

						v-divider

				//- Города
				template(v-if="mode=='cities'")
					template(v-for="city in cities")
						v-list-item(
							@click="cityClick(city)"
						)
							v-list-item-content
								v-list-item-title.pl-2(:class="{ 'font-weight-bold': isMainCity(city) }") {{ city.name }}

							v-list-item-action(v-if="city.id==userCity.id")
								v-icon.success--text(size="30") $complete
						v-divider

</template>

<script lang="ts">

import { ref, defineComponent, computed, onMounted } from "@nuxtjs/composition-api"
import useLogic from "../../common/logic/user-city-dialog.logic"

export default defineComponent({

	setup (props, context) {

		// Данные + логика
		const data = useLogic(props, context)

		// Опции скроллинга
		const scrollOptions = {
			vuescroll: {},
			scrollPanel: {
				scrollingX: false,
			},
			rail: {
				size: "6px",
			},
			bar: {
				keepShow: true,
				background: "#c1c1c1",
				opacity: 0.5,
				size: "4px",
			},
		}

		// Готовая коляска с данными
		return {
			...data, scrollOptions,
		}

	},
})

</script>
