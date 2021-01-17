<template>
    <div>
        <div class="uk-card uk-card-default uk-card-body">
            <h3 class="uk-card-title">Message</h3>
            <div>
                <table class="uk-table uk-table-small uk-table-divider">
                    <thead>
                        <tr>
                            <th>昵称</th>
                            <th>状态</th>
                            <th>IP</th>
                            <th>内容</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in data.records" :key="item.id">
                            <td>
                                <div>
                                    <div class="uk-float-left">
                                        <img class="uk-border-circle" :src="item.avatar" style="width:80px">
                                    </div>
                                    <div class="uk-float-left uk-margin-left">
                                        <h4 class="uk-margin-small-bottom">{{item.nickname}}</h4>
                                        <div class="color-gray">{{item.contact}}</div>
                                        <div class="color-gray">{{new Date(item.createTime).toSimple()}}</div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span v-if="item.status==1">正常</span>
                                <span v-else-if="item.status==0" class="color-red">待审核</span>
                            </td>
                            <td>{{item.ip}}</td>
                            <td>
                                <pre>{{item.content}}</pre>
                            </td>
                            <td>
                                <button class="uk-button uk-button-danger uk-border-rounded uk-button-small" @click="deleteEntity(item)">删除</button>
                                <button v-if="item.status==0" class="uk-button uk-button-default uk-border-rounded uk-button-small" @click="updateEntity({id: item.id, status: 1})">通过</button>
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
import MessageApi from '@/api/messageApi'
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
        getData(p) {
            this.reqvo.current = p || this.reqvo.current
            MessageApi.list({
                data: this.reqvo,
                toast: false,
                success: ({data}) => {
                    this.data = data.content
                }
            })
        },
        updateEntity(entity) {
            MessageApi.addOrUpdate({
                data: entity,
                success: res => this.getData()
            })
        },
        deleteEntity(entity) {
            this.$confirm({
                msg: '确定删除吗？',
                confirm: res => {
                    MessageApi.delete({
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