<template>
    <div>
        <side-bar></side-bar>
        <header-bar v-bind:widthToggle="widthToggle"></header-bar>
        <div :style="'margin-left: ' + sideBarWidth" 
            style="transition: width,margin-left .2s ease-in;-webkit-transition: width,margin-left .2s ease-in;">
            <div class="uk-position-relative">
                <div class="blog-content uk-position-relative">
                    <transition name="fadeInBottom">
                        <router-view/>
                    </transition>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import SideBar from '@/components/sideBar'
import HeaderBar from '@/components/headerBar'
import { mapGetters, mapMutations } from 'vuex'

export default {
    components:{SideBar, HeaderBar},
    data() {
        return {
            prevWidth: '0rem'
        }
    },
    computed: {
        ...mapGetters(['sideBarWidth'])
    },
    mounted() {
        window.onresize = e => {
            if (window.innerWidth < 640){
                this.widthToggle()
            }
        }
        window.onresize()
    },
    methods: {
        ...mapMutations(['setSideBarWidth']),
        widthToggle() {
            let temp = this.sideBarWidth
            this.setSideBarWidth(this.prevWidth)
            this.prevWidth = temp
        }
    },
    beforeDestroy() {
        window.onresize = null
    }
}
</script>
