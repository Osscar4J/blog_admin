<template>
    <div>
        <div class="uk-card uk-card-default uk-card-body">
            <div class="uk">
                <h3 class="uk-card-title">Menus</h3>
                <div class="uk-float-right">
                    <a class="uk-link-heading" uk-toggle="target: #modal-close-outside" v-auth="auth.user.update" @click="entity = {}">新增</a>
                </div>
            </div>
            <div>
                <table class="uk-table uk-table-small uk-table-divider">
                    <thead>
                        <tr>
                            <th>名称</th>
                            <th>状态</th>
                            <th>备注</th>
                            <th>创建时间</th>
                            <th v-auth="auth.user.code">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in data.records" :key="item.id">
                            <td>{{item.name}}</td>
                            <td>
                                <span v-if="item.status==1" class="color-green">正常</span>
                                <span v-else-if="item.status==2" class="color-red">冻结</span>
                            </td>
                            <td>{{item.remark}}</td>
                            <td>{{new Date(item.createTime).Format('yyyy/MM/dd hh:mm:ss')}}</td>
                            <td v-auth="auth.menu.code">
                                
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="uk-float-right">
                    <pagination v-bind:currentChange="getData" :total="data.total"></pagination>
                </div>
            </div>
        </div>

        <div id="modal-menus-edit" ref="form" uk-modal>
            <div class="uk-modal-dialog uk-modal-body">
                <button class="uk-modal-close-outside" type="button" uk-close></button>
                <h2 class="uk-modal-title">编辑</h2>
                <div>
                    <form class="uk-form-stacked">
                        <div class="uk-margin">
                            <label class="uk-form-label">账号</label>
                            <div v-if="!entity.id" class="uk-form-controls">
                                <input v-model="entity.account" class="uk-input" type="text" placeholder="用户账号" maxlength="16">
                            </div>
                            <div v-else class="uk-form-controls">
                                {{entity.account}}
                            </div>
                        </div>
                        <div class="uk-margin">
                            <label class="uk-form-label">密码</label>
                            <div class="uk-form-controls">
                                <input v-model="entity.passwd" class="uk-input" type="text" placeholder="密码" maxlength="18">
                            </div>
                        </div>
                        <div class="uk-margin">
                            <label class="uk-form-label">真实姓名</label>
                            <div class="uk-form-controls">
                                <input v-model="entity.realName" class="uk-input" type="text" placeholder="真实姓名" maxlength="12">
                            </div>
                        </div>
                        <div class="uk-margin">
                            <label class="uk-form-label">昵称</label>
                            <div class="uk-form-controls">
                                <input v-model="entity.nickname" class="uk-input" type="text" placeholder="昵称" maxlength="16">
                            </div>
                        </div>
                        <div class="uk-margin">
                            <label class="uk-form-label">性别</label>
                            <div class="uk-form-controls">
                                <div class="uk-margin uk-grid-small uk-child-width-auto uk-grid">
                                    <label><input v-model="entity.gender" class="uk-radio" type="radio" name="gender" :value="1" :checked="entity.gender==1"> 男</label>
                                    <label><input v-model="entity.gender" class="uk-radio" type="radio" name="gender" :value="0" :checked="entity.gender==0"> 女</label>
                                    <label><input v-model="entity.gender" class="uk-radio" type="radio" name="gender" :value="2" :checked="entity.gender==2"> 保密</label>
                                </div>
                            </div>
                        </div>
                        <div class="uk-margin">
                            <label class="uk-form-label">电话</label>
                            <div class="uk-form-controls">
                                <input v-model="entity.phone" class="uk-input" type="text" placeholder="电话" maxlength="16">
                            </div>
                        </div>
                        <div class="uk-margin">
                            <label class="uk-form-label">邮箱</label>
                            <div class="uk-form-controls">
                                <input v-model="entity.mail" class="uk-input" type="text" placeholder="邮箱" maxlength="64">
                            </div>
                        </div>
                        <div class="uk-margin">
                            <label class="uk-form-label">住址</label>
                            <div class="uk-form-controls">
                                <input v-model="entity.address" class="uk-input" type="text" placeholder="住址" maxlength="255">
                            </div>
                        </div>
                        <div class="uk-margin">
                            <label class="uk-form-label">备注</label>
                            <div class="uk-form-controls">
                                <input v-model="entity.remark" class="uk-input" type="text" placeholder="备注" maxlength="100">
                            </div>
                        </div>
                    </form>
                </div>
                <div class="uk-text-right">
                    <button class="uk-button uk-button-default uk-modal-close" type="button">取消</button>
                    <button class="uk-button uk-button-primary" type="button" @click="saveOrUpdate(entity)">保存</button>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
import MenuApi from '@/api/menuApi'
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
            },
            entity: {},
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
            MenuApi.list({
                data: this.reqvo,
                toast: false,
                success: ({data}) => {
                    this.data = data.content
                }
            })
        },
        saveOrUpdate(entity) {
            entity = entity || this.entity
            MenuApi.addOrUpdate({
                data: entity,
                success: res => {
                    this.getData()
                    UIkit.modal(this.$refs.form).hide()
                }
            })
        },
        deleteEntity(entity) {
            this.$confirm({
                msg: '确定删除吗？',
                confirm: res => {
                    MenuApi.delete({
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