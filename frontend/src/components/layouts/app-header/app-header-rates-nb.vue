<template lang="pug">
//- Курсы НБ
v-card.px-2.pt-2(flat color="rgba(0, 0, 0, 0)" two-lines)
	v-list-item
		v-list-item-content
			v-list-item-subtitle.text-caption(style="margin-bottom: 0px") {{ $t("HEADER.КУРС_НБ") }}
			v-list-item-title.d-flex.align-center
				//- Проход по всем валютам от НБанка
				template(v-for="item in ratesNB")
					//- Флаг
					v-sheet.rounded-circle.ml-1(
						style="overflow: hidden"
						width="16"
						height="16"
					)
						country-flag(
							:country="item.country"
							width="24"
							:styleName="{ position: 'relative', left: '-4px', top: '-1px' }"
						)

					//- Название
					span.text-body-2.ml-2.mr-1 {{ item.currency }}
					//- Курс
					span.mr-2.d-flex.align-center
						span.mr-1(
							:class="item.updown ? 'success--text' : 'error--text'"
						) {{ item.value }}
						v-icon(
							size="8"
							:class="item.updown ? 'success--text' : 'error--text'"
						) {{ item.updown ? "$nbkUpArrow" : "$nbkDownArrow" }}

</template>

<script lang="ts">

import { ref, defineComponent } from "@nuxtjs/composition-api"

export default defineComponent({

	setup (props, { root: { $store } }) {

		const ratesNB = ref([
			{ currency: "USD", value: "452.0", country: "us", updown: true },
			{ currency: "EUR", value: "491.0", country: "eu", updown: false },
			{ currency: "RUB", value: "6.08", country: "ru", updown: false },
		])

		return { ratesNB }
	}
})

</script>
