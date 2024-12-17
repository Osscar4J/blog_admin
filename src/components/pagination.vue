<template>
    <div>
        <ul class="uk-pagination" v-if="type == 'simple'">
            <li :class="{'uk-disabled': current <= 1}"><a @click="toPage(current - 1)"><span uk-pagination-previous></span></a></li>
            <li :class="{'uk-disabled': current >= pages}"><a @click="toPage(current + 1)"><span uk-pagination-next></span></a></li>
        </ul>
        <ul class="uk-pagination" v-else>
            <li :class="{'uk-disabled': current <= 1}" class="narrow-icon">
                <a @click="toPage(current - 1)"><span uk-pagination-previous></span></a>
            </li>

            <template v-if="pages < 10">
                <li v-for="item in pages" :key="item" :class="{'uk-active': current == item}"><a @click="toPage(item)">{{item}}</a></li>
            </template>

            <template v-if="pages >= 10">
                <template v-if="current < 5">
                    <li v-for="item in 5" :key="item" :class="{'uk-active': current == item}"><a @click="toPage(item)">{{item}}</a></li>
                    <li class="uk-disabled"><span>...</span></li>
                    <li><a @click="toPage(pages)">{{pages}}</a></li>
                </template>

                <template v-if="current > 4 && current <= pages - 4">
                    <li><a @click="toPage(1)">{{1}}</a></li>
                    <li class="uk-disabled"><span>...</span></li>
                    <li :class="{'uk-active': current == current - 2}"><a @click="toPage(current - 2)">{{current - 2}}</a></li>
                    <li :class="{'uk-active': current == current - 1}"><a @click="toPage(current - 1)">{{current - 1}}</a></li>
                    <li class="uk-active"><a>{{current}}</a></li>
                    <li :class="{'uk-active': current == current + 1}"><a @click="toPage(current + 1)">{{current + 1}}</a></li>
                    <li :class="{'uk-active': current == current + 2}"><a @click="toPage(current + 2)">{{current + 2}}</a></li>
                    <li class="uk-disabled"><span>...</span></li>
                    <li><a @click="toPage(pages)">{{pages}}</a></li>
                </template>

                <template v-if="current >= pages - 3">
                    <li><a @click="toPage(1)">{{1}}</a></li>
                    <li class="uk-disabled"><span>...</span></li>
                    <li :class="{'uk-active': current == pages - 4}"><a @click="toPage(pages - 4)">{{pages - 4}}</a></li>
                    <li :class="{'uk-active': current == pages - 3}"><a @click="toPage(pages - 3)">{{pages - 3}}</a></li>
                    <li :class="{'uk-active': current == pages - 2}"><a @click="toPage(pages - 2)">{{pages - 2}}</a></li>
                    <li :class="{'uk-active': current == pages - 1}"><a @click="toPage(pages - 1)">{{pages - 1}}</a></li>
                    <li :class="{'uk-active': current == pages}"><a @click="toPage(pages)">{{pages}}</a></li>
                </template>
            </template>

            <li :class="{'uk-disabled': current >= pages}" class="narrow-icon">
                <a @click="toPage(current + 1)"><span uk-pagination-next></span></a>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    props: {
        type: {
            type: String,
            default: 'full'
        },
        pageSize: {
            type: Number,
            default: 10
        },
        total: {
            type: Number,
            default: 0
        },
        currentPage: {
            type: Number,
            default: 1
        },
        currentChange: {
            type: Function,
            default: pageNo => {}
        }
    },
    watch: {
        total(n, o){
            this.pages = parseInt((n - 1) / this.pageSize + 1)
        }
    },
    data() {
        return {
            pages: 0,
            current: 1
        }
    },
    methods: {
        toPage(n) {
            this.current = n
            this.currentChange(n)
        }
    }
}
</script>
<style lang="scss" scoped>
.uk-active>a {
    color: var(--blue);
}
.narrow-icon {
    position: relative;
    top: -2px;
}
</style>