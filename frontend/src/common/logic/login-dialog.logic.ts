import { ref, computed, SetupContext, ComputedRef, useContext } from "@nuxtjs/composition-api"
import { clearedPhone, Rules } from "../lib/validation"
import { fromContext } from "../lib/proc"

export default function (props: any, context: SetupContext) {

	const { $v, $store, $eventHub, $router, $nextTick } = fromContext(context)

	// Для отладки
	const PHONE: string = process.env.LOGIN_PHONE || ""
	const PASSWORD: string = process.env.LOGIN_PASSWORD || ""

	// Данные
	const loading: ComputedRef<boolean> = computed(() => $store.state.loading)
	const isOpen = ref(false)

	// Флаг финальной валидации
	const final = ref(false)

	// Телефон
	const phone = ref("")

	// Маска телефона
	const phoneMask = '+# (###) ###-##-##'

	// Динамический плейсхолдер
	const phonePlaceholder = phoneMask.replace(/#/g, '_')
	const phoneLabel = computed(() => phone.value+phonePlaceholder.slice(phone.value.length))

	// Телефон (только цифры)
	const phone2 = computed(() => clearedPhone(phone.value))

	// Ошибка валидации телефона
	const phoneError = computed(() => $v.validate(Rules.phone, phone.value, final.value))

	// Пароль
	const password = ref("")
	const showPassword = ref(false)

	// Ошибка валидации пароля
	const passwordError = computed(() => $v.validate(Rules.password, password.value, final.value))

	// Ошибка API с сервера
	const error = ref(null)

	// Общая проверка
	const verifiedErrors = [ phoneError, passwordError ]
	const submitValid = computed(() => verifiedErrors.every(field => !field.value))

	// Колбэк обратного вызова
	let callback: any = null

	// Ловим сообщение "showLoginDialog" от ...
	$eventHub.$on("LoginDialog_SHOW", (cb: any) => {
		callback = cb
		phone.value = PHONE
		password.value = PASSWORD
		isOpen.value = true
		error.value = null
		final.value = false
	})

	// Обработчик нажатия на кнопку submit()
	function submit () {

		final.value = true
		$nextTick(() => {

			if (!submitValid.value) return

			//- Данные для запроса
			const data = {
				phone: phone2.value,
				password: password.value,
			}

			//- Пробуем авторизироваться
			$store.dispatch("startLoading", "mini"),
			$store.dispatch("loginUser", data)
			.then(() => {
				isOpen.value = false
				if (callback) callback()
				$router.push("/dashboard")
			})
			.catch(err => {
				error.value = err
				$store.dispatch("alert", { error: error.value })
			})
			.finally(() => $store.dispatch("finishLoading"))

		})
	}

	// Забыл пароль
	function forgotPassword () {
		$eventHub.$emit("ForgotPasswordDialog_SHOW")
		isOpen.value = false
	}

	// Регистрация
	function signupUser () {
		$router.push("/signup")
		isOpen.value = false
	}

	// Готовые данные
	return {
		loading, phone, phoneMask, phoneLabel, password, showPassword, submitValid,
		submit, isOpen, error, forgotPassword,
		phoneError, passwordError, signupUser,
	}

}
