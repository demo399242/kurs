import Vue from 'vue'

const eventHub = new Vue();
Vue.prototype.$eventHub = eventHub;

export default ({ app }, inject) => {

	console.log("Plugin: eventHub; SSR: " + process.server + " injected")

  inject('eventHub', eventHub)

}

