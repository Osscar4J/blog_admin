<template>
    <div>
        <div class="uk-card uk-card-default uk-card-body">
            <div class="uk">
                <h3 class="uk-card-title">Articles</h3>
                <div class="uk-float-right">
                    <a class="uk-link-heading" @click="$router.push('/admin/articleEditor')" v-auth="auth.article.update">新增</a>
                </div>
            </div>
            <div>
                <table class="uk-table uk-table-small uk-table-divider">
                    <thead>
                        <tr>
                            <th>文章</th>
                            <th>状态</th>
                            <th>阅读</th>
                            <th>简介</th>
                            <th v-auth="auth.article.code">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in data.records" :key="item.id">
                            <td>
                                <div v-if="item.cover" class="uk-background-top-center uk-background-norepeat uk-background-contain uk-float-left"
                                    :style="'background-image:url(' + item.cover + ');'" style="width: 100px;height:80px">
                                </div>
                                <div class="uk-float-left" :class="{'uk-margin-small-left': item.cover}">
                                    <h4 class="uk-margin-small-bottom" style="max-width:500px;">{{item.title}}</h4>
                                    <div class="color-gray">{{new Date(item.createTime).toSimple()}}</div>
                                </div>
                            </td>
                            <td>
                                <span v-if="item.status==1" class="color-green">已发布</span>
                                <span v-else-if="item.status==2" class="color-red">已下架</span>
                                <span v-else-if="item.status==0" class="color-gray">草稿</span>
                            </td>
                            <td>{{item.readCount}}</td>
                            <td>{{item.summary}}</td>
                            <td v-auth="auth.article.code">
                                <button class="uk-button uk-button-primary uk-border-rounded uk-button-small" 
                                    @click="$router.push('/admin/articleEditor?id=' + item.id)"
                                    v-auth="auth.article.update">编辑</button>
                                <button v-if="item.status!=1" class="uk-button uk-button-default uk-border-rounded uk-button-small" 
                                    @click="updateEntity({id: item.id, status: 1})"
                                    v-auth="auth.article.update">上架</button>
                                <button v-if="item.status==1" class="uk-button uk-button-default uk-border-rounded uk-button-small" 
                                    @click="updateEntity({id: item.id, status: 2})"
                                    v-auth="auth.article.update">下架</button>
                                <button class="uk-button uk-button-danger uk-border-rounded uk-button-small" 
                                    @click="deleteEntity(item)"
                                    v-auth="auth.article.delete">删除</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="uk-float-right">
                    <pagination v-bind:currentChange="getData" :total="data.total"></pagination>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import ArticleApi from '@/api/articleApi'
import Pagination from '@/components/pagination'
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
        getData(p) {
            this.reqvo.current = p || this.reqvo.current
            ArticleApi.list({
                data: this.reqvo,
                toast: false,
                success: ({data}) => {
                    this.data = data.content
                }
            })
        },
        updateEntity(entity) {
            ArticleApi.addOrUpdate({
                data: entity,
                success: res => this.getData()
            })
        },
        deleteEntity(entity) {
            this.$confirm({
                msg: '确定删除吗？',
                confirm: res => {
                    ArticleApi.delete({
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