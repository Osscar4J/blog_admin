<template>
    <div>
        <div class="uk-card uk-card-default uk-card-body">
            <h3 class="uk-card-title">端口扫描记录</h3>
            <div>
                <table class="uk-table uk-table-small uk-table-divider">
                    <thead>
                        <tr>
                            <th>用户</th>
                            <th>域名</th>
                            <th>状态</th>
                            <th>扫描结果</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in data.records" :key="item.id">
                            <td>
                                <div>{{item.ip}}</div>
                                <div class="color-gray">{{new Date(item.createTime).toSimple()}}</div>
                            </td>
                            <td>{{item.domain}}</td>
                            <td>
                                <span v-if="item.status==2">完成</span>
                                <span v-else-if="item.status==1" class="color-blue">正在处理</span>
                                <span v-else-if="item.status==3" class="color-red">失败</span>
                                <span v-else-if="item.status==0" class="color-gray">等待</span>
                            </td>
                            <td>
                                <pre 
                                    style="background: #333; color: #67c23a;overflow: hidden;white-space: pre-wrap;white-space: -moz-pre-wrap;white-space: -pre-wrap;white-space: -o-pre-wrap;word-wrap: break-word;">
                                    {{item.content}}
                                </pre>
                            </td>
                            <td>
                                <button class="uk-button uk-button-danger uk-button-small uk-border-rounded" @click="remove(item)">删除</button>
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
import NmapApi from '@/api/nmapApi'
import Pagination from '@/components/pagination'
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
        async getData(p) {
            this.reqvo.current = p || this.reqvo.current
            let {data} = await NmapApi.list({
                data: this.reqvo,
                toast: false
            })
            this.data = data.content
        },
        remove(entity) {
            this.$confirm({
                msg: '确定删除吗？',
                confirm: () => {
                    NmapApi.delete({
                        data: {id: entity.id},
                        success: res => this.getData()
                    })
                }
            })
        }
    }
}
</script>