<template>
    <div>
        <div class="uk-card uk-card-default uk-card-body">
            <h3 class="uk-card-title">Banners</h3>
            <div>
                <ul class="uk-list uk-list-divider">
                    <li v-for="item in data.records" :key="item.id">
                        <div class="uk-inline">
                            <img :src="item.fileUrl">
                            <div class="uk-light uk-position-bottom" style="background:rgba(0, 0, 0, .4)">
                                <div class="uk-padding-small">
                                    <p class="uk-margin-remove-bottom">
                                        <a class="uk-link-heading color-blue" @click="updateSortNo(item)">排序</a>
                                        |
                                        <a class="uk-link-heading color-red" @click="deleteEntity(item)" v-auth="auth.banner.delete">删除</a>
                                        |
                                        <a class="uk-link-heading color-orange" v-if="item.status == 1" 
                                            @click="updateEntity({id: item.id, status: 2})"
                                            v-auth="auth.banner.update">下架</a>
                                        <a class="uk-link-heading color-green" v-else-if="item.status == 0 || item.status == 2" 
                                            @click="updateEntity({id: item.id, status: 1})"
                                            v-auth="auth.banner.update">上架</a>
                                    </p>
                                    <p class="uk-margin-small-top uk-margin-remove-bottom">{{new Date(item.createTime).toSimple()}}</p>
                                </div>
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
import { mapGetters } from 'vuex'
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
    computed: {
        ...mapGetters(['auth'])
    },
    mounted() {
        this.getData(1)
    },
    methods: {
        updateSortNo(entity) {
            let sortNo = prompt('请输入排序值（升序）：')
            if (sortNo){
                this.updateEntity({
                    id: entity.id,
                    sortNo: sortNo
                })
            }
        },

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