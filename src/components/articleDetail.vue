<template>
	<div class="uk-position-relative">
		<div class="uk-position-absolute" style="right: 10px; top: 10px">
			<button type="button" uk-close @click="close"></button>
		</div>
		<div class="uk-padding-small uk-text-left" style="border-bottom: 1px dashed #edeeef;">
			<div class="uk-text-center">
				<div v-show="loading" uk-spinner></div>
			</div>
			<div v-if="!!entity">
				<div v-html="entity.content"></div>
				<div v-if="entity.createDate" class="uk-text-right"><small class="color-gray">{{entity.createDate.Format('yyyy/MM/dd')}}</small></div>
			</div>
		</div>
	</div>
</template>
<script type="text/javascript">
	export default {
		props: {
			articleId: {
				type: Number,
				default: null
			}
		},
		watch: {
			articleId(n, o){
				this.entity = null
				this.getData(n)
			}
		},
		data() {
			return {
				height: 0,
				loading: false,
				entity: {content: null}
			}
		},
		methods: {
			close() {
				this.$emit("onClose")
			},
			getData(id) {
				this.loading = true
				
				setTimeout(() => {
					this.loading = false
					this.entity = {
						createDate: new Date(),
						content: '<div> content <br> 1<br> 2<br> 3<br> 4<br> 5<br> </div>' + '<pre><code class="hljs html"><span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">id</span>=<span class="hljs-string">"demo"</span>&gt;</span>'+
  '<span class="hljs-tag">&lt;<span class="hljs-name">button</span> <span class="hljs-attr">v-on:click</span>=<span class="hljs-string">"show = !show"</span>&gt;</span>'+
 '   Toggle'+
'  <span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span>'+
'  <span class="hljs-tag">&lt;<span class="hljs-name">transition</span> <span class="hljs-attr">name</span>=<span class="hljs-string">"fade"</span>&gt;</span>'+
'    <span class="hljs-tag">&lt;<span class="hljs-name">p</span> <span class="hljs-attr">v-if</span>=<span class="hljs-string">"show"</span>&gt;</span>hello<span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span>'+
'  <span class="hljs-tag">&lt;/<span class="hljs-name">transition</span>&gt;</span>'+
'<span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span></code></pre><div><img src="https://cn.vuejs.org/images/transition.png"></div>'
					}
				}, 200)
			}
		}
	}
</script>
