<template>
    <div>
        <div class="uk-card uk-card-default uk-card-body">
            <div class="uk">
                <h3 class="uk-card-title">Roles</h3>
                <div class="uk-float-right">
                    <a class="uk-link-heading" uk-toggle="target: #modal-close-outside" v-auth="auth.role.update" @click="entity = {}">新增</a>
                </div>
            </div>
            <div>
                <table class="uk-table uk-table-small uk-table-divider">
                    <thead>
                        <tr>
                            <th>名称</th>
                            <th>编码</th>
                            <!-- <th>状态</th> -->
                            <th>备注</th>
                            <th>创建时间</th>
                            <th>更新时间</th>
                            <th v-auth="auth.role.code">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in data.records" :key="item.id">
                            <td>{{item.name}}</td>
                            <td>{{item.code}}</td>
                            <!-- <td>
                                <span v-if="item.status==1" class="color-green">正常</span>
                                <span v-else-if="item.status==2" class="color-red">禁用</span>
                            </td> -->
                            <td>{{item.remark}}</td>
                            <td>{{new Date(item.createTime).Format('yyyy/MM/dd hh:mm:ss')}}</td>
                            <td>{{new Date(item.updateTime).Format('yyyy/MM/dd hh:mm:ss')}}</td>
                            <td>
                                <button class="uk-button uk-button-primary uk-border-rounded uk-button-small" 
                                    v-auth="auth.role.update" 
                                    @click="entity = Object.assign({}, item)" uk-toggle="target: #modal-close-outside">编辑</button>
                                <button class="uk-button uk-button-danger uk-border-rounded uk-button-small"
                                    v-auth="auth.role.delete" 
                                     @click="deleteEntity(item)">删除</button>
                                <button class="uk-button uk-button-default uk-border-rounded uk-button-small"
                                    v-auth="auth.role.update" 
                                    @click="entity = item; !menus.length && getMenus(); getMenusByRole()"
                                    uk-toggle="target: #modal-permissions">权限</button>
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
                            <label class="uk-form-label">名称</label>
                            <div class="uk-form-controls">
                                <input v-model="entity.name" class="uk-input" type="text" placeholder="输入名称" maxlength="32">
                            </div>
                        </div>
                        <div class="uk-margin">
                            <label class="uk-form-label">编码</label>
                            <div class="uk-form-controls">
                                <input v-model="entity.code" class="uk-input" type="text" placeholder="输入编码，不要输入重复的编码" maxlength="16">
                            </div>
                        </div>
                        <div class="uk-margin">
                            <label class="uk-form-label">备注</label>
                            <div class="uk-form-controls">
                                <input v-model="entity.remark" class="uk-input" type="text" placeholder="备注" maxlength="255">
                            </div>
                        </div>
                    </form>
                </div>
                <div class="uk-text-right">
                    <button class="uk-button uk-button-default uk-modal-close" type="button">取消</button>
                    <button class="uk-button uk-button-primary" type="button" @click="saveOrUpdate">保存</button>
                </div>
            </div>
        </div>

        <div id="modal-permissions" ref="permissions" uk-modal>
            <div class="uk-modal-dialog uk-modal-body">
                <button class="uk-modal-close-outside" type="button" uk-close></button>
                <h2 class="uk-modal-title">{{entity.name}}</h2>
                <div>
                    <div class="uk-text-right">
                        <div class="uk-display-inline-block uk-border-circle m-type menu"></div> 菜单导航 
                        <div class="uk-display-inline-block uk-border-circle m-type func"></div> 功能权限
                    </div>
                    <div v-for="item in menus" :key="item.id" class="uk-margin-small-bottom uk-margin-top">
                        <div>
                            <label><input v-model="checkedMenus" class="uk-checkbox" type="checkbox" :value="item.id"> 
                                <div class="uk-display-inline-block uk-border-circle m-type" :class="{menu: item.type == 1, func: item.type == 2}"></div>
                                {{item.name}} 
                            </label> 
                        </div>
                        <div style="text-indent: 2em" v-if="item.subMenus">
                            <div v-for="subItem in item.subMenus" :key="subItem.id">
                                <label><input v-model="checkedMenus" class="uk-checkbox" type="checkbox" :value="subItem.id"> 
                                    <div class="uk-display-inline-block uk-border-circle m-type" :class="{menu: item.type == 1, func: item.type == 2}"></div>
                                    {{subItem.name}}
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="uk-text-right">
                    <button class="uk-button uk-button-default uk-modal-close" type="button">取消</button>
                    <button class="uk-button uk-button-primary" type="button" @click="updateRoleMenus">保存</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import RoleApi from '@/api/roleApi'
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
            menus: [],
            checkedMenus: []
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
            RoleApi.list({
                data: this.reqvo,
                toast: false,
                success: ({data}) => {
                    this.data = data.content
                }
            })
        },
        saveOrUpdate() {
            if (!this.entity.name || !this.entity.name.trim()){
                this.$error('名称不能为空')
                return false
            }
            if (!this.entity.code || !this.entity.code.trim()){
                this.$error('编码不能为空')
                return false
            }
            RoleApi.addOrUpdate({
                data: this.entity,
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
                    RoleApi.delete({
                        data: entity,
                        success: res => {
                            this.getData()
                        }
                    })
                }
            })
        },

        getMenus() {
            MenuApi.list({
                data: { pageable: 0 },
                toast: false,
                success: ({ data }) => {
                    let list = data.content.records || []
                    list.sort((m1, m2) => m1.id - m2.id)
                    let menuMap = {}
                    for (let i = 0; i < list.length; i++) {
                        const menu = list[i];
                        if (!menu.parentId){
                            this.menus.push(menu)
                            menuMap[menu.id] = []
                        } else {
                            menuMap[menu.parentId].push(menu)
                        }
                    }
                    for (let i = 0; i < this.menus.length; i++) {
                        const menu = this.menus[i];
                        menu.subMenus = menuMap[menu.id]
                    }
                }
            })
        },

        // 更新角色的权限信息
        updateRoleMenus() {
            RoleApi.updateRoleMenus({
                data: {
                    id: this.entity.id,
                    records: this.checkedMenus.map(v => { return {id: v} })
                },
                success: ({ data }) => {
                    UIkit.modal(this.$refs.permissions).hide()
                }
            })
        },

        // 查询角色的权限列表
        getMenusByRole() {
            MenuApi.getListByRole({
                toast: false,
                data: { id: this.entity.id },
                success: ({ data }) => {
                    this.checkedMenus = []
                    if (data.content){
                        for (let i = 0; i < data.content.length; i++) {
                            const menu = data.content[i];
                            this.checkedMenus.push(menu.id)
                            if (menu.subMenus){
                                for (let j = 0; j < menu.subMenus.length; j++) {
                                    this.checkedMenus.push(menu.subMenus[j].id)
                                }
                            }
                        }
                    }
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.m-type {
    width: 10px;
    height: 10px;
    &.menu {
        background-color: var(--green);
    }
    &.func {
        background-color: var(--red);
    }
}
</style>