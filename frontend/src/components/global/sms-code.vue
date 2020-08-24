<template lang="pug">
v-sheet.rounded(min-height="170" )
	div.text-body-2.pb-3(
		v-if="!hideText"
		style="line-height: 1rem"
	) {{ $t('USER.ВВЕДИТЕ_СМС') }} {{ phone }}

	//- поле ввода СМС-кода
	div.text-center.text-subtitle-1.pt-3 СМС-код
	div.mx-auto(
		style="width:150px"
	)
		v-text-field.text-h5.sms-input(
			type="tel"
			v-model="smsCode"
			v-mask="'####'"
			color="accent"
			outlined
			hide-details
			autofocus
			dense
		)

	//- Таймер
	div.text-center.my-2(
		v-if="timerFlag"
		style="line-height: .5rem"
	)
		span.text-caption.text--secondary {{ $t('USER.ВЫСЛАТЬ_ПОВТОРНО') }}
		br
		span.accent--text.text-subtitle-2 {{ counter }} {{ $t('USER.СЕК') }}

	//- Ссылка отправить повторно
	div.text-center.my-2(v-else-if="!noAgain")
		a.accent--text(href="#" @click.prevent="sendAgain") {{ $t('USER.ОТПРАВИТЬ_ПОВТОРНО') }}

</template>

<script>

import { onBeforeUnmount, ref, computed } from "@nuxtjs/composition-api"

export default {
	props: {
		"value": { type: String },
		"phone": { type: String },
		"hide-text": { type: Boolean, default: false },
		"send-sms-code-again": { type: Function },
	},
	setup (props, { emit }) {

		const smsCode = computed({
			get: () => props.value,
			set: val => {
				emit("input", val)
			}
		})
		const noAgain = ref(false)
		const timerFlag = ref(true)
		const counter = ref(10)
		const intervalId = setInterval(() => {
			counter.value--
			if(counter.value==0) {
				timerFlag.value = false
				clearInterval(intervalId)
			}
		}, 1000)

		function sendAgain () {
			noAgain.value = true
			emit("send-sms-code-again")
		}

		onBeforeUnmount(() => {
			clearInterval(intervalId)
		})

		return { counter, timerFlag, sendAgain, smsCode, noAgain }
	}
}
</script>

<style lang="sass">
.sms-input input
	max-height: 50px!important
	padding: 10px 0px 10px 15px
	letter-spacing:.9rem!important
</style>
