<template>
    <div>
        <div class="uk-card uk-card-default uk-card-body">
            <div class="uk">
                <h3 class="uk-card-title">Users</h3>
                <div class="uk-float-right">
                    <a class="uk-link-heading" uk-toggle="target: #modal-close-outside" v-auth="auth.user.update" @click="entity = {}">新增</a>
                </div>
            </div>
            <div>
                <table class="uk-table uk-table-small uk-table-divider">
                    <thead>
                        <tr>
                            <th>用户</th>
                            <th>角色</th>
                            <th>状态</th>
                            <th>邮箱</th>
                            <th>住址</th>
                            <th>备注</th>
                            <th>创建时间</th>
                            <th>更新时间</th>
                            <th v-auth="auth.user.code">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in data.records" :key="item.id">
                            <td>
                                <div v-if="!!item.avatar" class="uk-float-left">
                                    <img :src="item.avatar" style="width: 80px;">
                                </div>
                                <div class="uk-float-left uk-margin-small-left">
                                    <div>账号：{{item.account}}</div>
                                    <div>姓名：{{item.realName}}</div>
                                    <div>昵称：{{item.nickname}}</div>
                                    <div>
                                        性别：
                                        <span v-if="item.gender == 1">男</span>
                                        <span v-else-if="item.gender == 0">女</span>
                                        <span v-else-if="item.gender == 2">未知</span>
                                    </div>
                                    <div>手机：{{item.phone}}</div>
                                </div>
                            </td>
                            <td>
                                <div v-if="item.roles">
                                    <div class="color-purple" v-for="role in item.roles" :key="role.id">{{role.name}}</div>
                                </div>
                            </td>
                            <td>
                                <span v-if="item.status==1" class="color-green">正常</span>
                                <span v-else-if="item.status==2" class="color-red">冻结</span>
                            </td>
                            <td>{{item.mail}}</td>
                            <td>{{item.address}}</td>
                            <td>{{item.remark}}</td>
                            <td>{{new Date(item.createTime).Format('yyyy/MM/dd hh:mm:ss')}}</td>
                            <td>{{new Date(item.updateTime).Format('yyyy/MM/dd hh:mm:ss')}}</td>
                            <td v-auth="auth.user.code">
                                <button class="uk-button uk-button-primary uk-border-rounded uk-button-small" 
                                    v-auth="auth.user.update"
                                    @click="entity = Object.assign({}, item, {passwd: null})" 
                                    uk-toggle="target: #modal-close-outside">编辑</button>
                                <button v-if="item.status==1" class="uk-button uk-button-default uk-border-rounded uk-button-small" 
                                    v-auth="auth.user.update"
                                    @click="saveOrUpdate({id: item.id, status: 2})">禁用</button>
                                <button v-else-if="item.status==2" class="uk-button uk-button-default uk-border-rounded uk-button-small" 
                                    v-auth="auth.user.update"
                                    @click="saveOrUpdate({id: item.id, status: 1})">启用</button>
                                <button class="uk-button uk-button-danger uk-border-rounded uk-button-small" 
                                    v-auth="auth.user.delete" 
                                    @click="deleteEntity(item)">删除</button>
                                <button class="uk-button uk-button-default uk-border-rounded uk-button-small" 
                                    v-auth="auth.user.update"
                                    uk-toggle="target: #modal-menus"
                                    @click="checkRoles(item)">角色</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="uk-float-right">
                    <pagination v-bind:currentChange="getData" :total="data.total"></pagination>
                </div>
            </div>
        </div>

        <div id="modal-close-outside" ref="form" uk-modal>
            <div class="uk-modal-dialog uk-modal-body">
                <button class="uk-modal-close-outside" type="button" uk-close></button>
                <h2 class="uk-modal-title">编辑</h2>
                <div>
                    <form class="uk-form-stacked">
                        <div class="uk-margin">
                            <div class="uk-form-controls">
                                <div class="js-upload uk-placeholder uk-text-right uk-background-center-center uk-background-norepeat uk-background-contain" 
                                    style="background-color: rgba(0,0,0,.4);color: #fff;height: 5rem; line-height: 10rem;"
                                    :style="'background-image:url(' + entity.avatar + ');'">
                                    <span uk-icon="icon: cloud-upload"></span>
                                    <span class="uk-text-middle">拖动图片到这里 或 </span>
                                    <div uk-form-custom>
                                        <input type="file" accept="image/jpg, image/png">
                                        <span class="uk-link">选择图片</span>
                                    </div>
                                    <span class="uk-text-middle"> 上传头像</span>
                                </div>
                                <progress v-show="progress > 0" ref="js-progressbar" class="uk-progress" :value="progress" max="100"></progress>
                            </div>
                        </div>
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

        <div id="modal-menus" ref="menus" uk-modal>
            <div class="uk-modal-dialog uk-modal-body">
                <button class="uk-modal-close-outside" type="button" uk-close></button>
                <h2 class="uk-modal-title">{{entity.nickname}}</h2>
                <div>
                    <div v-for="item in roles" :key="item.id" class="uk-margin-small-bottom">
                        <div>
                            <label><input v-model="checkedRoles" class="uk-checkbox" type="checkbox" :value="item.id"> {{item.name}}</label> 
                        </div>
                    </div>
                </div>
                <div class="uk-text-right">
                    <button class="uk-button uk-button-default uk-modal-close" type="button">取消</button>
                    <button class="uk-button uk-button-primary" type="button" @click="updateRoles">保存</button>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
import UserApi from '@/api/userApi'
import FileApi from '@/api/FileApi'
import RoleApi from '@/api/roleApi'
import Pagination from '@/components/pagination'
import SparkMD5 from 'spark-md5'
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
            progress: 0,
            roles: [],
            checkedRoles: []
        }
    },
    computed: {
        ...mapGetters(['auth'])
    },
    mounted() {
        this.getData(1)
        UIkit.upload('.js-upload', {
            beforeSend: 0,
            beforeAll: async (e, files) => {
                this.progress = 0
                let filename = files[0].name
                let data = await FileApi.multiUpload({
                    data: {
                        file: files[0],
                        filename: 'avatar/' + Date.now() + filename.substr(filename.lastIndexOf('.'))
                    },
                    progress: (curr, total) => {
                        this.progress = curr / total * 100
                    }
                })
                this.entity.avatar = data.content
            }
        })
    },
    methods: {
        getData(p) {
            this.reqvo.current = p || this.reqvo.current
            UserApi.list({
                data: this.reqvo,
                toast: false,
                success: ({data}) => {
                    this.data = data.content
                }
            })
        },
        saveOrUpdate(entity) {
            entity = entity || this.entity
            if (!!entity.passwd){
                entity.passwd = SparkMD5.hash(entity.passwd)
            }
            UserApi.addOrUpdate({
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
                    UserApi.delete({
                        data: entity,
                        success: res => {
                            this.getData()
                        }
                    })
                }
            })
        },

        checkRoles(entity) {
            this.entity = entity
            this.checkedRoles = []
            if (this.entity.roles){
                this.checkedRoles = this.entity.roles.map(v => v.id)
            }
            this.getRoles()
        },

        getRoles() {
            !this.roles.length && RoleApi.list({
                data: { pageable: 0 },
                toast: false,
                success: ({ data }) => {
                    this.roles = data.content.records || []
                }
            })
        },

        updateRoles() {
            UserApi.updateRoles({
                data: {
                    id: this.entity.id,
                    records: this.checkedRoles.map(id => { return {id: id} })
                },
                success: ({ data }) => {
                    this.getData()
                    UIkit.modal(this.$refs.menus).hide()
                }
            })
        }
    }
}
</script>