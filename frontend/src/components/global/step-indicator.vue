<template lang="pug">
div.delimiter(
	style="text-align: center"
)
	v-icon.mx-1(
		v-for="index in Number(count)"
		:key="index"
		size="10"
		:color="index==current ? 'accent' : 'secondary' "
	) $dot
</template>

<script>
export default {
	props: [ "count", "current" ],
}
</script>

<style lang="sass" scoped>
.delimiter
	position: absolute
	bottom: 0
	left: 0
	right: 0
	text-align: center

</style>
