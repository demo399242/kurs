<template functional lang="pug">
//- Нестандартные иконки
span.v-custom-icon(
	v-bind="data.attrs"
	:class="data.staticClass || ''"
	:style="props.styleName"
)
	svg(
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		:viewBox="props.viewBox"
		:width="$options.iconWidth(props)"
		:height="$options.iconHeight(props)"
		role="img"
	)
		path(
			v-for="path in $options.paths(props)" 
			:opacity="path.opacity" 
			:d="path.d" 
			:fill="path.fill"
			:stroke="path.stroke"
			:stroke-width="path.strokeWidth"
		)

</template>

<script>
import { custom_icons } from "./custom-icons.js"

export default {

	name: "customIcon",
	props: {
		name: {
			type: String,
			default: "default"
		},
		styleName: {
			default: null
		},
		size: {
			type: [Number, String],
			default: 24
		},
		width: {
			type: [Number, String],
			default: 0
		},
		height: {
			type: [Number, String],
			default: 0
		},
		small: {
			type: Boolean,
			default: false
		},
		large: {
			type: Boolean,
			default: false
		},
		viewBox: {
			type: String,
			default: "0 0 24 24"
		},
	},

	iconSize(props) {
		if (props.small) return 18
		if (props.large) return 36
		return props.size
	},
	iconWidth(props) {
		if (props.width) return props.width
		return this.iconSize(props)
	},
	iconHeight(props) {
		if (props.height) return props.height
		return this.iconSize(props)
	},
	paths(props) {
		return custom_icons[props.name] ? custom_icons[props.name] : custom_icons.default
	},

}
</script>

<style lang="sass" scoped>
.v-custom-icon
	-webkit-box-align: center
	-ms-flex-align: center
	align-items: center
	display: -webkit-inline-box
	display: -ms-inline-flexbox
	display: inline-flex
	-webkit-font-feature-settings: "liga"
	font-feature-settings: "liga"
	font-size: 24px
	-webkit-box-pack: center
	-ms-flex-pack: center
	justify-content: center
	letter-spacing: normal
	line-height: 1
	position: relative
	text-indent: 0
	-webkit-transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1), visibility 0s
	transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1), visibility 0s
	vertical-align: middle
	-webkit-user-select: none
	-moz-user-select: none
	-ms-user-select: none
	user-select: none
</style>