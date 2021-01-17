<template>
	<div>
		<div style="margin-top: 10rem;">
			<div class="uk-card uk-card-default uk-card-body uk-width-1-2@m" style="margin:auto;">
				<h3 class="uk-card-title">登 录</h3>
				<form class="uk-form-stacked">
					<div class="uk-margin">
						<label class="uk-form-label">账 号</label>
						<div class="uk-form-controls">
							<input class="uk-input" v-model="entity.account" type="text" placeholder="输入账号">
						</div>
					</div>

					<div class="uk-margin">
						<label class="uk-form-label">密 码</label>
						<div class="uk-form-controls">
							<input class="uk-input" v-model="entity.passwd" type="password" placeholder="输入密码">
						</div>
					</div>

					<div class="uk-margin">
						<button class="uk-button uk-button-primary uk-border-rounded" :disabled="loading" @click="submit">
							<span v-show="!loading">登 录</span>
							<span v-show="loading">正在登录...</span>
						</button>
					</div>

				</form>
			</div>
		</div>
	</div>
</template>
<script>
	import CommonAPi from '@/api/commonApi'
	import { mapMutations, mapGetters } from 'vuex'

	export default {
		data(){
			return {
				loading: false,
				entity: {
					account: null,
					passwd: null
				},
			}
		},
		computed: {
			...mapGetters(['userToken'])
		},
		mounted(){
			this.userToken && this.$router.push('/admin/dashboard')
		},
		methods: {
			...mapMutations(['setUserToken']),
			submit() {
				this.loading = true
				CommonAPi.login({
					toast: false,
					data: this.entity,
					success: ({data}) => {
						this.setUserToken(data.content.token)
						this.$router.push('/admin/dashboard')
					},
					always: res => this.loading = false
				})
			}
		}
	}
</script>
<style lang="scss">
	
</style>
