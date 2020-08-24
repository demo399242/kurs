<template lang="pug">
v-dialog(v-model="isOpen" max-width="300px" persistent)

	v-card

		//- Заголовок диалога
		v-card-title.pa-1.secondary.lighten-1
			v-list-item
				v-list-item-content
					v-list-item-title.pl-2 Восстановление пароля
				v-divider.my-2(vertical)
				v-list-item-action
					v-icon(@click="close") $close

		v-divider

		//- Шаг-1 (телефон и каптча)
		v-card-text.px-10.pt-4.pb-1(v-if="step=='PHONE'" style="min-height:240px;position:relative")

			//- Текст
			div.text-body-2.pb-5.text--primary(
				style="line-height: 1rem"
			) {{ $t('USER.ДЛЯ_ВОССТАНОВЛЕНИЯ') }}

			//- Телефон
			v-text-field.text-body-2.mt-3.mx-3(
				type="tel"
				autofocus
				dense
				v-model="phone"
				:error-messages="phoneError"
				:label="$t('USER.ТЕЛЕФОН')"
				v-mask="'+#(###)###-##-##'"
				color="accent"
				placeholder="+7(___)___-__-__"
			)
				template(v-slot:prepend-inner)
					v-icon(size="18" style="margin-top: 7px;color: inherit") mdi-account

			//- Каптча
			google-captcha.mt-3(
				:error-messages="tokenError"
				@error='clearToken'
				@expired='clearToken'
				@verify='getToken'
			)

			//- Сообщение об ошибке
			div.pa-2.text-caption.error--text(
				:class="{ 'error-div': !!errors.PHONE }"
				style="min-height:36px; line-height: 1rem"
			) {{ errors.PHONE }}
			//- v-alert(dense v-if="errors.PHONE" type="error") {{ errors.PHONE }}

			StepIndicator(count="4" current="1")

		//- Шаг-2 (СМС-код)
		v-card-text.px-10.pt-4.pb-1(v-if="step=='SMSCODE'" style="min-height:240px;position:relative")

			sms-code(
				v-model="smsCode"
				:phone="phone"
				@send-sms-code-again="sendSmsCodeAgain"
			)

			//- Сообщение об ошибке
			div.pa-2.text-caption.error--text.mx-auto(
				:class="{ 'error-div': !!errors.SMSCODE }"
				style="min-height:36px; line-height: 1rem;width:150px"
			) {{ errors.SMSCODE }}

			StepIndicator(count="4" current="2")

		//- Шаг-3 (Новый пароль)
		v-card-text.px-10.pt-6.pb-1(v-if="step=='PASSWORD'" style="min-height:240px;position:relative")
			div.text-body-2.pb-5.text--primary(
				style="line-height: 1rem"
			) {{ $t('USER.ПРИДУМАЙТЕ_ПАРОЛЬ') }}

			v-text-field.text-body-2.mx-3.mb-3(
				v-model="password1"
				:type="showPassword ? 'text' : 'password'"
				:error-messages="password1Error"
				:label="$t('USER.НОВЫЙ_ПАРОЛЬ')"
				placeholder=" "
				dense
				color="accent"
			)
				template(v-slot:prepend-inner)
					v-icon(size="16" style="margin-top: 8px;color: inherit") mdi-lock
				template(v-slot:append)
					v-icon(
						tabindex="-1"
						size="17"
						style="margin-top: 8px"
						@click='showPassword = !showPassword'
					) {{ showPassword ? 'mdi-eye' : 'mdi-eye-off' }}

			v-text-field.text-body-2.mx-3(
				v-model="password2"
				:type="showPassword ? 'text' : 'password'"
				:error-messages="password2Error"
				:label="$t('USER.ПОВТОРИТЕ_ПАРОЛЬ')"
				placeholder=" "
				dense
				color="accent"
			)
				template(v-slot:prepend-inner)
					v-icon(size="16" style="margin-top: 8px;color: inherit") mdi-lock
				template(v-slot:append)
					v-icon(
						tabindex="-1"
						size="17"
						style="margin-top: 8px"
						@click='showPassword = !showPassword'
					) {{ showPassword ? 'mdi-eye' : 'mdi-eye-off' }}

			//- Сообщение об ошибке
			div.pa-2.text-caption.error--text(
				:class="{ 'error-div': !!errors.PASSWORD }"
				style="min-height:36px; line-height: 1rem"
			) {{ errors.PASSWORD }}

			StepIndicator(count="4" current="3")

		//- Шаг-4 (Завершение)
		v-card-text.px-10.pt-6.pb-1(v-if="step=='DONE'" style="min-height:240px;position:relative")
			div
				v-img.mx-auto(width="70" height="78" src="@/assets/img/shield.svg" )

			div.text-h6.py-4.text--primary.text-center(
				style="line-height: 1.5rem"
			) {{ $t('USER.ПАРОЛЬ_ИЗМЕНЕН') }}

			StepIndicator(count="4" current="4")

		//- Кнопки диалога
		v-card-actions.py-4.px-9.justify-space-around
			//- Отмена
			v-btn.accent--text.text-body-2(
				v-if="step=='PHONE' || step=='PASSWORD'"
				style="text-transform: none"
				min-width="100"
				@click="close"
				outlined
			) {{ $t('DIALOG.ОТМЕНА') }}
			//- Назад
			v-btn.accent--text.text-body-2(
				v-if="step=='SMSCODE'"
				style="text-transform: none"
				min-width="100"
				@click="back"
				outlined
			) {{ $t('DIALOG.НАЗАД') }}
			//- Далее
			v-btn.accent.text-body-2(
				v-if="step!='DONE'"
				style="text-transform: none"
				min-width="100"
				:loading="loading"
				@click="submit"
			) {{ $t('DIALOG.ДАЛЕЕ') }}
			//- ОК
			v-btn.accent.text-body-2(
				v-if="step=='DONE'"
				style="text-transform: none"
				min-width="100"
				@click="done"
			) {{ $t('DIALOG.ОК') }}

</template>

<script lang="ts">

import { defineComponent } from "@nuxtjs/composition-api"
import useLogic from "../../common/logic/forgot-password-dialog.logic"

export default defineComponent({

	setup: useLogic

	// isOpen, step, errors, submitValid, loading,
	// phone, phoneError, clearToken, getToken,
	// smsCode, sendSmsCodeAgain, tokenError,
	// password1, password2, showPassword, password1Error, password2Error,
	// close,	back, submit,	done,

})

</script>
