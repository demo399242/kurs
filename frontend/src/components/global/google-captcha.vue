<template lang="pug">
v-sheet
	v-btn.text-body-2.px-2.justify-start(
		@click="startCaptcha()"
		style="text-transform: none"
		large
		block
		text
		:ripple="status=='initial' || status=='error' ? true : false"
	)
		span.d-inline-block(
			style="width: 30px;overflow: hidden;"
		)
			v-icon.accent--text(
				v-if="status=='initial'"
				size="24"
			) mdi-cursor-default-click

			v-icon.error--text(
				v-if="status=='error'"
				style="margin-top: 1px"
				size="24"
			) mdi-block-helper

			v-progress-circular(
				v-if="status=='pending'"
				indeterminate
				:size="24"
				:width="3"
				color="accent"
			)

			v-scale-transition(origin="50% 50%")
				v-icon.success--text(
					v-if="status=='verified'"
					size="28"
				) $complete

		span.text-left(v-if="status!='verified'")
			span.d-inline-block.ml-2.mb-n2.text-subtitle-1.font-weight-medium Я не робот
			br
			span.d-inline-block.ml-2.text-caption Нажмите для проверки
		span.ml-2.text-subtitle-1.font-weight-medium(v-else) Проверено

	span.text-caption.error--text(
		style="min-height:36px"
	) {{ errorMessages }}

	recaptcha(
		@success="onSuccess",
		@error="onError",
		@expired="onExpired",
		size="invisible",
		style="display:none"
	)
</template>

<script lang="ts">

// import VueRecaptcha from "vue-recaptcha";
import { Ref, ref, onBeforeUnmount, SetupContext } from "@nuxtjs/composition-api"

enum STATUS {
	INITIAL="initial", PENDING="pending", ERROR="error", VERIFIED="verified",
}

export default {
  props: [ "error-messages", "captchaType", "error", "verify", "expired", "render" ],
	setup (props: any, context: SetupContext) {

		const debug = true
		const $recaptcha = (context.root as any).context.$recaptcha
		const status: Ref<STATUS> = ref(STATUS.INITIAL)

		async function startCaptcha () {
			if(status.value==STATUS.PENDING || status.value==STATUS.VERIFIED) return
			try {
				await $recaptcha.reset()
				status.value = STATUS.PENDING
				await $recaptcha.getResponse()
				await $recaptcha.reset()
			} catch (err) {
				status.value = STATUS.ERROR
			}
		}

		onBeforeUnmount(() => {
		})

		function onError (error: any) {
			status.value = STATUS.ERROR
			context.emit("error", error)
    }

    function onSuccess (token: string) {
			status.value = STATUS.VERIFIED
			context.emit("verify", token)
    }

    function onExpired () {
			status.value = STATUS.ERROR
			context.emit("expired")
    }

		//if (debug) context.emit("verify", process.env.RECAPTCHA_TOKEN)

		return {
			startCaptcha,
			status, debug,
			onError,
			onExpired,
			onSuccess,
		}
	},
}
</script>
