<template>
	<div class="side-bar" :style="'width:' + sideBarWidth">
		<nav class="side-bar-nav open">
			<ul class="nav" :style="'width:' + sideBarMaxWidth">
				<li class="nav-title">导航</li>
				<li class="nav-item" 
					v-for="item in menus" :key="item.name" :class="item.subMenus ? 'nav-dropdown': ''" 
					@click="handleNav($event, item)">
					<span class="nav-link" :class="$route.path == item.path ? 'active':''">
						<span class="icon uk-icon-link" :uk-icon="'icon: '+item.icon+'; ratio: .8'"></span>
						{{item.name}}
						<span v-if="item.subMenus" class="icon uk-icon-link" uk-icon="icon: chevron-left; ratio: .8"></span>
					</span>
					<ul v-if="item.subMenus" class="nav-dropdown-items">
						<li class="nav-item" v-for="subItem in item.subMenus" :key="subItem.name">
							<a @click="$router.push(subItem.path)" class="nav-link" :class="$route.path == subItem.path ? 'active':''">
								<span class="icon uk-icon-link" :uk-icon="'icon: '+subItem.icon+'; ratio: .8'"></span>
								{{subItem.name}}
							</a>
						</li>
					</ul>
				</li>
			</ul>
		</nav>
	</div>
</template>
<script type="text/javascript">
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				sideBarMaxWidth: 0,
				menus: [
					{name: '控制台', path: '/admin/dashboard', icon: 'home'},
					{name: '文章管理', path: '/admin/articles', icon: 'file-text'},
					{name: 'Banners', path: '/admin/banners', icon: 'world'},
					{name: '留言', path: '/admin/guestBook', icon: 'comments'},
					{
						name: '工具',
						icon: 'laptop',
						subMenus: [
							{
								name: '端口扫描',
								icon: 'nut',
								path: '/admin/portScanner'
							}
						]
					}
				]
			}
		},
		computed: {
			...mapGetters(['sideBarWidth'])
		},
		mounted() {
			this.sideBarMaxWidth = this.sideBarWidth
		},
		methods: {
			handleNav(e, menu) {
				if (menu.subMenus){
					this.navToggle(e)
				} else {
					this.$router.push(menu.path)
				}
			},
			navToggle(e) {
				if (/open/.test(e.target.parentNode.className)){
					e.target.parentNode.className = e.target.parentNode.className.replace(' open', '')
				} else {
					e.target.parentNode.className += ' open'
				}
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
    width: 17rem;
    background-color: #272727;
    min-height: 100vh;
    -ms-flex-negative: 0;
    flex-shrink: 0;
    top: 0;
    bottom: 0;
    left: 0;
    -webkit-transition: all .3s;
    transition: all .3s;
    z-index: 999;
	position: fixed;
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
					transition: transform .2s ease-in;
				}
				&.open>.nav-link>.icon:last-of-type {
					-webkit-transform: rotate(-90deg);
    				transform: rotate(-90deg);
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
