import { Validator } from "~/common/lib/validation"


export default ({ app }, inject) => {

	console.log("Plugin: validator; SSR: " + process.server + " injected")

	const validator = new Validator(app.i18n)

  inject('v', validator)

}

