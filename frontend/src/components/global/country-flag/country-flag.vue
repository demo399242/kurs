<template functional lang="pug">
//-props.styleName
img(
	v-bind="data.attrs"
	:class="data.staticClass || ''"
	:style="$options.flagStyles(props)"
	:src="require(`./svg/${props.country}.svg`)"
	role="img"
)


</template>

<script>
export default {
	name: "country-flag",
	props: {
		country: {
			type: String,
			default: "ru"
		},
		styleName: {
			default: null
		},
		width: {
			type: [Number, String],
			default: 25
		},
		height: {
			type: [Number, String],
			default: 18
		},
		small: {
			type: Boolean,
			default: false
		},
		large: {
			type: Boolean,
			default: false
		},
	},
	flagStyles(props) {
		let style = {
			width: this.flagWidth(props)+"px!important",
			height: this.flagHeight(props)+"px!important",
		}
		if(props.styleName) return Object.assign(style, props.styleName)
		return style
	},
	flagWidth(props) {
		if (props.small) return 20
		if (props.large) return 60
		return props.width
	},
	flagHeight(props) {
		if (props.small) return 15
		if (props.large) return 40
		return props.height
	},
}
</script>
