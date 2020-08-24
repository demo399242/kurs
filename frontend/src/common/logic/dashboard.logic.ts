import { SetupContext, ComputedRef, computed } from "@nuxtjs/composition-api"
import { TUserDashboard } from "../types/users.types"
import { fromContext } from "../lib/proc"

export default function (props: any, context: SetupContext) {

	const { $i18n, $v, $store, $eventHub, $nextTick } = fromContext(context)

	const dashboard = computed(() => $store.state.dashboard)

	return { dashboard }

}
