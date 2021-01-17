
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
        if (!Vue.prototype.$confirm){
            Vue.prototype.$confirm = config => {
                config.labels = config.labels || {ok: '确定', cancel: '取消'}
                UIkit.modal.confirm(config.msg, config).then(res => {
                    config.confirm && config.confirm()
                }, err => {
                    config.cancel && config.cancel()
                })
            }
        }
	}
}
