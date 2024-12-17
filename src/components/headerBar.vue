<template>
    <div class="header" uk-sticky>
        <div :style="'margin-left: ' + sideBarWidth + ';'" class="toggle-bar">
            <i uk-icon="table" title="收起侧边栏" @click="widthToggle"></i>
        </div>
        <div class="right-bar">
            <nav class="uk-navbar-container uk-margin" uk-navbar="mode: click">
                <div class="uk-navbar-left">
                    <ul class="uk-navbar-nav">
                        <li>
                            <a class="user">admin</a>
                            <div class="uk-navbar-dropdown">
                                <ul class="uk-nav uk-navbar-dropdown-nav">
                                    <li><a @click="$router.push('/admin/userInfo')">个人资料</a></li>
                                    <li><a @click="logout">退出</a></li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
    props: {
        widthToggle: {
            type: Function,
            default: () => {}
        }
    },
    computed: {
        ...mapGetters(['sideBarWidth'])
    },
    methods: {
        ...mapMutations(['removeToken']),
        logout() {
            this.removeToken()
            this.$router.push('/')
        }
    }
}
</script>
<style lang="scss" scoped>
.header {
    width: 100%;
    height: 4rem;
    line-height: 4rem;
    padding: 0 1rem;
    background-color: #ffffff;
    -webkit-box-shadow: 0 1px 3px rgba(18,18,18,.1);
    box-shadow: 0 1px 3px rgba(18,18,18,.1);
    .uk-icon {
        cursor: pointer;
        &:hover {
            color: #42a5f5;
        }
    }
    .toggle-bar {
        transition: margin-left .2s ease-in;
        display: inline-block;
    }
    .right-bar {
        margin-right: 1rem;
        float: right;
        .uk-navbar-container {
            background-color: transparent;
            height: 100%;
            height: 4rem;
            line-height: 4rem !important;
            .uk-navbar-nav {
                height: 100%;
                a.user {
                    min-height: 4rem;
                    line-height: 4rem;
                }
                .uk-navbar-dropdown {
                    padding: 15px;
                    li {
                        height: 3rem;
                        line-height: 3rem;
                    }
                }
            }
        }
    }
}
</style>