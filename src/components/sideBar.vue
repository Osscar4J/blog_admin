<template>
	<div class="side-bar">
		<nav class="side-bar-nav open">
			<ul class="nav">
				<li class="nav-title">导航</li>
				<li class="nav-item">
					<span class="nav-link">
						<span class="icon uk-icon-link" uk-icon="icon: home; ratio: .8"></span>
						控制台
					</span>
				</li>
				<li class="nav-item">
					<span class="nav-link active">
						<span class="icon uk-icon-link" uk-icon="icon: file-text; ratio: .8"></span>
						文章管理
					</span>
				</li>
				<li class="nav-item">
					<span class="nav-link">
						<span class="icon uk-icon-link" uk-icon="icon: comments; ratio: .8"></span>
						留言
					</span>
				</li>
				<li class="nav-item nav-dropdown" @click="navToggle">
					<span class="nav-link">
						<span class="icon uk-icon-link" uk-icon="icon: laptop; ratio: .8"></span>
						工具
						<span class="icon uk-icon-link" uk-icon="icon: chevron-left; ratio: .8"></span>
					</span>
					<ul class="nav-dropdown-items">
						<li class="nav-item">
							<a href="/user/wechat" class="nav-link ">
								<i class="icon-bubbles"></i> 菜单列表
							</a>
						</li>
						<li class="nav-item">
							<a href="/user/reply" class="nav-link ">
								<i class="icon-earphones-alt"></i> 自动回复
							</a>
						</li>
					</ul>
				</li>
			</ul>
		</nav>
	</div>
</template>
<script type="text/javascript">
	export default {
		data() {
			return {
				menus: [
					{
						name: '首页',
						path: '/'
					},
					{
						name: '留言',
						path: '/guestBook'
					},
					{
						name: '工具',
						subMenus: [
							{
								name: '端口扫描',
								path: '/port-scanner'
							}
						]
					}
				]
			}
		},
		mounted() {
			// console.log(this.$route.path)
		},
		methods: {
			navToggle(e) {
				if (/open/.test(e.target.parentNode.className)){
					e.target.parentNode.className = e.target.parentNode.className.replace(' open', '')
				} else {
					e.target.parentNode.className += ' open'
				}
				console.log(e.target.parentNode)
			}
		}
	}
</script>
<style lang="scss" scoped>
.side-bar {
	display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    width: 240px;
    background-color: #272727;
    min-height: calc(100vh - 60px);
    -ms-flex-negative: 0;
    flex-shrink: 0;
    top: 0;
    bottom: 0;
    left: 0;
    -webkit-transition: all .3s;
    transition: all .3s;
    z-index: 99;
	position: fixed;
	margin-top: 5rem;
	nav {
		display: block;
		-webkit-box-flex: 1;
		-ms-flex: 1;
		flex: 1;
		position: relative;
		width: 100%;
		overflow-y: auto;
		overflow-x: hidden;
		.nav {
			display: -webkit-box;
			display: -ms-flexbox;
			display: flex;
			-ms-flex-wrap: wrap;
			flex-wrap: wrap;
			padding-left: 0;
			margin-bottom: 0;
			list-style: none;
			width: 100%;
    		list-style: none;
			.nav-title {
				font-size: 80%;
				text-transform: uppercase;
				padding: .8rem 1rem;
				color: #777;
			}
			.nav-item {
				width: 100%;
    			position: relative;
				.nav-link {
					display: block;
					text-decoration: none;
					padding: 16px 24px;
					color: #9d9d9d;
					cursor: pointer;
					&>.icon:first-of-type {
						display: inline-block;
						width: 24px;
						margin-right: 4px;
						margin-top: 5px;
						position: relative;
						top: -2px;
						color: #c4c3c3;
						font-size: 14px;
					}
					&:hover {
						color: #dddddd;
						&>.icon {
							color: #ffffff;
						}
					}
					&.active {
						color: #ffffff;
						background: #222;
						&>.icon {
							color: #42a5f5;
						}
					}
				}
			}
			.nav-dropdown {
				&>.nav-link>.icon:last-of-type {
					float: right;
					margin-top: 4px;
				}
				&.open>.nav-link>.icon:last-of-type {
					-webkit-transform: rotate(270deg);
    				transform: rotate(270deg);
				}
				.nav-dropdown-items {
					padding: 0;
					margin: 0;
					overflow: hidden;
					max-height: 0!important;
					-webkit-transition: max-height .3s ease-in-out;
					transition: max-height .3s ease-in-out;
				}
				&.open {
					.nav-dropdown-items {
						max-height: 1000px!important;
    					background-color: #1f1f1f;
					}
				}
			}
		}
	}
}
</style>
