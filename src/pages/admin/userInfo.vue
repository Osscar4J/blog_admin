<template>
    <div>
        <div>
            <fieldset class="uk-fieldset uk-card uk-card-default uk-card-body">

                <div class="uk-legend">个人资料</div>

                <div class="uk-margin">
                    <div :style="{'background-image': 'url('+entity.avatar+')'}" class="uk-border-circle avatar">

                    </div>
                    <button class="uk-button uk-button-default uk-border-rounded uk-margin-small-top"
                        @click="chooseFile">上传头像</button>
                    <input type="file" class="uk-hidden" ref="fileSelector" @change="uploadFile" />
                </div>

                <div class="uk-margin">
                    <input class="uk-input" v-model="entity.realName" type="text" placeholder="姓名">
                </div>

                <div class="uk-margin">
                    <textarea class="uk-textarea" v-model="entity.remarker" rows="5" placeholder="个人简介"></textarea>
                </div>

                <div class="uk-margin uk-grid-small uk-child-width-auto uk-grid">
                    <label><input v-model="entity.gender" class="uk-radio" type="radio" name="gender"
                            :checked="entity.gender==1"> 男</label>
                    <label><input v-model="entity.gender" class="uk-radio" type="radio" name="gender"
                            :checked="entity.gender==0"> 女</label>
                </div>

                <div class="uk-margin">
                    <button class="uk-button uk-button-primary uk-border-rounded uk-margin-small-top"
                        @click="save">保存</button>
                </div>

            </fieldset>
        </div>
    </div>
</template>
<script>
import UserApi from '@/api/userApi'
import FileApi from '@/api/FileApi'

export default {
    data() {
        return {
            entity: {
                avatar: 'https://getuikit.com/docs/images/slider5.jpg'
            }
        }
    },
    mounted() {
        this.getData(1)
    },
    methods: {
        getData(p) {
            UserApi.getUserInfo({
                toast: false,
                success: res => {
                    this.entity = res.data.content
                }
            })
        },

        chooseFile() {
            this.$refs['fileSelector'].click()
        },

        async uploadFile(e) {
            let file = e.target.files[0]
            let filename = file.name
            let res = await FileApi.ossUpload({
                data: {
                    file: file,
                    filename: 'avatar/' + new Date().getTime() + filename.substr(filename.lastIndexOf('.'))
                }
            })
            this.entity.avatar = res.fullUrl
        },

        save() {
            UserApi.addOrUpdate({
                data: this.entity,
                success: res => this.getData()
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.avatar {
    width: 200px;
    height: 200px;
    background-position: center center;
    background-size: cover;
}
</style>