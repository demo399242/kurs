<template lang="pug">
v-list.py-0(
	dark
	style="margin-top:-2px"
)
	template( v-for="item in menuItems" )
		v-list-item.px-2.mx-n2.navigation-menu(
			:to="item.to"
		)
			v-list-item-icon.mr-4.mr-md-0.mr-lg-4.my-3
				v-icon {{ item.icon }}
			v-list-item-content
				v-list-item-title.text-body-2 {{ item.title }}

</template>

<script>
export default {

	setup (props, { root: { $options: { i18n } } }) {

		//- Список пунктов меню
		const menuItems = [
			{
				title: i18n.t("SIDEBAR.ОБМЕННИКИ"),
				to: "/",
				icon: "$shopLists"
			},
			{
				title: i18n.t("SIDEBAR.ДИНАМИКА_КУРСА"),
				to: "/ratesdynamics",
				icon: "$ratesDynamics"
			},
			{
				title: i18n.t("SIDEBAR.АРХИВ_КУРСОВ"),
				to: "/ratesarchive",
				icon: "$ratesArchive"
			},
			{
				title: i18n.t("SIDEBAR.КАЛЬКУЛЯТОР"),
				to: "/calculator",
				icon: "$calculator"
			},
			{
				title: i18n.t("SIDEBAR.КАРТА_ОБМЕННИКОВ"),
				to: "/shopsmap",
				icon: "$shopsMap"
			},
			// {
			// 	title: i18n.t("SIDEBAR.РЕКЛАМА"),
			// 	to: "/ad", icon: "$advertising"
			// },
			// {
			// 	title: i18n.t("SIDEBAR.О_НАС"),
			// 	to: "/about",
			// 	icon: "$aboutUs"
			// },
			{
				title: "ControlPanel",
				to: "/test2",
				icon: "$info"
			},
			{
				title: "Test",
				to: "/test",
				icon: "$info"
			},
		]

		return { menuItems, }
	},
}
</script>

<style lang="sass">
.theme--dark.navigation-menu.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled)
	color: rgba(255,255,255,.6)!important
.theme--dark.navigation-menu.v-list-item--active:hover::before,
.theme--dark.navigation-menu.v-list-item--active::before
	opacity: 0.1
.navigation-menu.v-list-item--active
	border-left: 2px solid var(--v-success-base)
	padding-left: 6px !important
</style>
