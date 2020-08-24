<template lang="pug">
v-dialog(v-model="isOpen" max-width="300px" persistent)
	//- Карточка диалога
	v-card

		//- Заголовок диалога
		v-card-title.pa-1.secondary.lighten-1
			v-list-item
				v-list-item-content
					v-list-item-title.pl-2 {{ $t('DIALOG.АВТОРИЗАЦИЯ') }}
				v-divider.my-2(vertical)
				v-list-item-action
					v-icon(@click="isOpen=false") $close

		v-divider

		//- Содержимое диалога
		v-card-text.px-5.pt-10.pb-1(style="min-height:240px")

			//- Телефон (логин)
			//- div.phone-label {{ phoneLabel }}
			v-text-field.text-body-2.mx-6.mb-4(
				v-model="phone"
				onfocus="this.value = this.value;"
				type="tel"
				tabindex="1"
				dense
				:error-messages="phoneError"
				:label="$t('USER.ТЕЛЕФОН')"
				v-mask="phoneMask"
				color="accent"
			)
				template(v-slot:prepend-inner)
					v-icon(size="18" style="margin-top: 7px;color: inherit") mdi-account

			//- Пароль
			v-text-field.text-body-2.mx-6(
				v-model="password"
				:error-messages="passwordError"
				:type="showPassword ? 'text' : 'password'"
				tabindex="2"
				:label="$t('USER.ПАРОЛЬ')"
				color="accent"
				dense
				placeholder=" "
			)
				template(v-slot:prepend-inner)
					v-icon(size="16" style="margin-top: 8px;color: inherit") mdi-lock
				template(v-slot:append)
					v-icon(
						size="17"
						tabindex="-1"
						style="margin-top: 8px"
						@click='showPassword = !showPassword'
					) {{ showPassword ? 'mdi-eye' : 'mdi-eye-off' }}

			//- Сообщение об ошибке
			div.pa-2.text-caption.error--text(
				:class="{ 'error-div': !!error }"
				style="min-height:36px;line-height: 1rem"
			) {{ error }}

		//- Забыли пароли | Регистрация
		div.text-body-2.text-center.pt-1.mt-7
			a.text-decoration-underline(
				@click.prevent="forgotPassword"
			).accent--text {{ $t('USER.ЗАБЫЛ_ПАРОЛЬ') }}
			|  |
			a.text-decoration-underline(
				@click.prevent="signupUser"
			).accent--text {{ $t('USER.РЕГИСТРАЦИЯ') }}

		//- Кнопки диалога
		v-card-actions.py-4.px-10

			//- Авторизироваться
			v-btn.accent.text-body-2(
				@click="submit"
				style="text-transform: none"
				:loading="loading"
				block
			) {{ $t('DIALOG.ВОЙТИ') }}

</template>

<script lang="ts">

import { defineComponent } from "@nuxtjs/composition-api"
import useLogic from "../../common/logic/login-dialog.logic"

export default defineComponent({

	setup: useLogic

})

</script>


