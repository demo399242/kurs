<template>
  <v-app dark class="pa-6">
    <h1 v-if="error.statusCode === 404">
      {{ pageNotFound }}
    </h1>
    <h1 v-else>
      {{ otherError }} <br/>
    </h1>
    <NuxtLink to="/">
      Home page
    </NuxtLink>
  </v-app>
</template>

<script lang="ts">



import { defineComponent, computed, ref } from '@nuxtjs/composition-api'
export default defineComponent({
	layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  setup ({ error }) {
		const pageNotFound = '404 Not Found'
		const otherError = 'An error occurred'
		// head(() => {
	  //   const title = error.statusCode === 404 ? pageNotFound : otherError
    // 	return { title }
		// })
    return {
      pageNotFound,
      otherError
    }
	},
})




// CLASSICS
//----------------------------------------------------------------------
// export default {
//   layout: 'empty',
//   props: {
//     error: {
//       type: Object,
//       default: null
//     }
//   },
//   data () {
//     return {
//       pageNotFound: '404 Not Found',
//       otherError: 'An error occurred'
//     }
//   },
//   head (): any {
//     const title =
//       this.error.statusCode === 404 ? this.pageNotFound : this.otherError
//     return {
//       title
//     }
//   }
// }

// COMPOSITION API
//------------------------------------------------------------------------
// import { defineComponent, computed, ref } from '@vue/composition-api'
// interface User {
//   firstName: string
//   lastName: string
// }
// export default defineComponent({
//   props: {
//     user: {
//       type: Object as () => User,
//       required: true
//     }
//   },
//   setup ({ user }) {
//     const fullName = computed(() => `${user.firstName} ${user.lastName}`)
//     const message = ref('This is a message')
//     return {
//       fullName,
//       message
//     }
//   }
// })

// CLASS STYLE
//------------------------------------------------------___-
// import { Vue, Component, Prop } from 'vue-property-decorator'
// interface User {
//   firstName: string
//   lastName: string
// }
// @Component
// export default class YourComponent extends Vue {
//   @Prop({ type: Object, required: true }) readonly user!: User
//   message: string = 'This is a message'
//   get fullName (): string {
//     return `${this.user.firstName} ${this.user.lastName}`
//   }
// }

</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
