import { watch, ref, computed, SetupContext, ComputedRef } from "@nuxtjs/composition-api"
import { clearedPhone, Rules } from "../lib/validation"
import { fromContext } from "../lib/proc"
import { ERRORS } from "../lib/error-codes"

enum STEPS { PHONE, SMSCODE, PASSWORD, DONE }

export default function (props: any, context: SetupContext) {

	const { $set, $i18n, $v, $store, $eventHub, $nextTick } = fromContext(context)

	// Данные
	const isOpen = ref(false)
	let callback: any = null
	const loading = computed(() => $store.state.loading)
	const steps = ["PHONE", "SMSCODE", "PASSWORD", "DONE"]
	const stepIndex  = ref(0)
	const step = computed(() => stepIndex.value>=0 ? steps[stepIndex.value] : "")
	const noErrors = steps.reduce((a: any, b: string)=> (a[b]=null,a), {})
	const errors = ref(noErrors)
	const final = ref(false)
	const phone = ref("")
	const phoneError = computed(() => $v.validate(Rules.phone, phone.value, final.value))
	const phone2 = computed(() => clearedPhone(phone.value))
	const token = ref("")
	const tokenError = computed(() => $v.validate(Rules.captchaToken, token.value, final.value))
	const smsCode = ref("")
	const smsCodeId = ref("")
	const showPassword = ref(false)
	const password1 = ref("")
	const password1Error = computed(() => $v.validate(Rules.newPassword, password1.value, final.value))
	const password2 = ref("")
	const password2Error = computed(() => $v.validate(Rules.newPassword, password2.value, final.value, password1.value))
	const submitValid = computed(() => {
		if (step.value=="PHONE") return !phoneError.value && !tokenError.value
		if (step.value=="SMSCODE") return smsCode.value && smsCode.value.length==4
		if (step.value=="PASSWORD") return !password1Error.value && !password2Error.value
	})

	// Прием сигналов с шины событий
	$eventHub.$on("ForgotPasswordDialog_SHOW", (cb: any) => {
		callback = cb
		stepIndex.value = 0
		resetStep()
		isOpen.value = true
	})

	// Каптча
	function clearToken() {	token.value = "" }
	function getToken(newToken: string) {	token.value = newToken }

	// watcher на smsCode
	watch(() => smsCode.value, (value: string) => {
		if (!value) return
		$set(errors.value, "SMSCODE", null)
		if (value.length!=4) return
		$nextTick(() => submit())
	})

	// События из компоненты SmsCode
	function sendSmsCodeAgain () {
		$set(errors.value, "SMSCODE", null)
		$store.dispatch("startLoading", "mini")
		$store.dispatch("sendSmsCode", {
			origin: "forgotPassword",
			phone: phone2.value,
			captcha: null,
			sendAgain: true
		})
		.then(() => $store.dispatch("alert", $i18n.t("ОТПРАВЛЕНО_ПОВТОРНО")))
		.catch(err => $set(errors.value, "SMSCODE", err))
		.finally(() => $store.dispatch("finishLoading"))
	}

	// Сброс данных
	function resetStep() {
		final.value = false
		if (stepIndex.value==0) {
			phone.value = ""
			token.value = ""
			$set(errors.value, "PHONE", null)
		}
		if (stepIndex.value==1) {
			smsCode.value = ""
			$set(errors.value, "SMSCODE", null)
		}
		if (stepIndex.value==2) {
			password1.value = ""
			password2.value = ""
			showPassword.value = false
			$set(errors.value, "PASSWORD", null)
		}
	}

	// Закрыть диалог
	function close() {
		isOpen.value = false
		setTimeout(() => {
			stepIndex.value = -1
		}, 300)
	}

	// Назад, на предыдущий шаг
	function back() {
		stepIndex.value--
		resetStep()
	}

	// submitPhone
	function submitPhone() {
		const data = { phone: phone2.value, captcha: token.value, origin: "forgotPassword" }
		$set(errors.value, "PHONE", null)
		$store.dispatch("startLoading", "mini")
		$store.dispatch("sendSmsCode", data)
		.then((data: any) => {
			stepIndex.value++
			smsCodeId.value = data.smsCodeId
			resetStep()
		})
		.catch(err => $set(errors.value, step.value, err))
		.finally(() => $store.dispatch("finishLoading"))
	}

	// submitSmsCode
	function submitSmsCode() {
		const data = {
			smsCodeId: smsCodeId.value,
			phone: phone2.value,
			code: smsCode.value,
			origin: "forgotPassword"
		}
		$store.dispatch("startLoading", "mini")
		$store.dispatch("checkSmsCode", data)
		.then(data => {
			if (data.success) {
				stepIndex.value++
				resetStep()
			} else if (data.chances==0) {
				$v.throw(ERRORS.SMSCODE_NO_CHANCES)
			} else {
				$v.throw(ERRORS.SMSCODE_WRONG, { chances: data.chances })
			}
		})
		.catch(err => $set(errors.value, step.value, err))
		.finally(() => $store.dispatch("finishLoading"))
	}

	// submitPassword
	function submitPassword() {
		const data = {
			smsCodeId: smsCodeId.value,
			password: password1.value
		}
		$store.dispatch("startLoading", "mini")
		$store.dispatch("forgotPassword", data)
		.then(() => {
			stepIndex.value++
			resetStep()
		})
		.catch(err => $set(errors.value, step.value, err))
		.finally(() => $store.dispatch("finishLoading"))
	}

	// submit()
	function submit() {
		final.value = true
		$nextTick(() => {
			if (!submitValid.value) return
			if (step.value=="PASSWORD") submitPassword()
			if (step.value=="SMSCODE") submitSmsCode()
			if (step.value=="PHONE") submitPhone()
		})
	}

	// done()
	function done() {
		close()
		//$eventHub.$emit("LoginDialog_SHOW", null, phone.value)
	}

	// Коляска
	return {
		isOpen, step, errors, submitValid, loading,
		phone, phoneError, clearToken, getToken,
		smsCode, sendSmsCodeAgain, tokenError,
		password1, password2, showPassword, password1Error, password2Error,
		close,	back, submit,	done,
	}

}
