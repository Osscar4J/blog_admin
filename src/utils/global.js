
export default {
	install: function(Vue, options) {
        if (!Vue.prototype.$toast){
            Vue.prototype.$toast = (msg, config) => {
                config = Object.assign({pos: 'top-center'}, config||{})
                UIkit.notification(msg, config)
            }
        }
        if (!Vue.prototype.$error){
            Vue.prototype.$error = (msg) => {
                Vue.prototype.$toast(msg, {status: 'danger'})
            }
        }
        if (!Vue.prototype.$success){
            Vue.prototype.$success = (msg) => {
                Vue.prototype.$toast(msg, {status: 'success'})
            }
        }
	}
}
