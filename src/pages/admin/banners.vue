<template>
    <div>
        <div class="uk-card uk-card-default uk-card-body">
            <h3 class="uk-card-title">Banners</h3>
            <div>
                <ul class="uk-list uk-list-divider">
                    <li v-for="item in data.records" :key="item.id">
                        <div class="uk-inline">
                            <img :src="item.fileUrl">
                            <div class="uk-overlay uk-light uk-position-bottom">
                                <p>
                                    <a class="uk-link-heading color-blue">排序</a>
                                    |
                                    <a class="uk-link-heading color-red" @click="deleteEntity(item)">删除</a>
                                    |
                                    <a class="uk-link-heading color-orange" v-if="item.status == 1" @click="updateEntity({id: item.id, status: 2})">下架</a>
                                    <a class="uk-link-heading color-green" v-else-if="item.status == 0 || item.status == 2" @click="updateEntity({id: item.id, status: 1})">上架</a>
                                </p>
                                <p>{{new Date(item.createTime).toSimple()}}</p>
                            </div>
                        </div>
                    </li>
                </ul>
                <div class="uk-float-right">
                    <pagination v-bind:currentChange="getData" :total="data.total"></pagination>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Pagination from '@/components/pagination'
import BannerApi from '@/api/bannerApi'
export default {
    components: {Pagination},
    data() {
        return {
            reqvo: {
                current: 1,
                size: 10
            },
            data: {
                records: []
            }
        }
    },
    mounted() {
        this.getData(1)
    },
    methods: {
        getData(p) {
            this.reqvo.current = p || this.reqvo.current
            BannerApi.list({
                data: this.reqvo,
                toast: false,
                success: ({data}) => {
                    this.data = data.content
                }
            })
        },
        updateEntity(entity) {
            BannerApi.addOrUpdate({
                data: entity,
                success: res => this.getData()
            })
        },
        deleteEntity(entity) {
            this.$confirm({
                msg: '确定删除吗？',
                confirm: res => {
                    BannerApi.delete({
                        data: entity,
                        success: res => {
                            this.getData()
                        }
                    })
                }
            })
        }
    }
}
</script>