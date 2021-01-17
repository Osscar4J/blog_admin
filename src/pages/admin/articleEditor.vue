<template>
    <div>
        <div class="uk-card uk-card-default uk-card-body">
            <h3 class="uk-card-title">编辑</h3>
            <div>
                <div class="uk-margin">
                    <div class="js-upload uk-placeholder uk-text-right uk-background-center-center uk-background-norepeat uk-background-contain" 
                        style="background-color: rgba(0,0,0,.4);color: #fff;height: 10rem; line-height: 20rem;"
                        :style="'background-image:url(' + entity.cover + ');'">
                        <span uk-icon="icon: cloud-upload"></span>
                        <span class="uk-text-middle">拖动图片到这里 或 </span>
                        <div uk-form-custom>
                            <input type="file" accept="image/jpg, image/png, image/gif">
                            <span class="uk-link">选择图片</span>
                        </div>
                    </div>
                    <progress v-show="progress > 0" ref="js-progressbar" class="uk-progress" :value="progress" max="100"></progress>
                </div>
                <div class="uk-margin">
                    <div class="uk-form-controls">
                        <input class="uk-input" v-model="entity.title" type="text" placeholder="标题" maxlength="200">
                    </div>
                </div>
                <div class="uk-margin">
                    <div class="uk-form-controls">
                        <input class="uk-input" v-model="entity.summary" type="text" placeholder="简介" maxlength="200">
                    </div>
                </div>
                <rich-editor :value.sync="entity.text.content"></rich-editor>
                <div class="uk-text-right uk-margin-top">
                    <button class="uk-button uk-button-primary uk-border-rounded" @click="commit">提交</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import RichEditor from '@/components/richEditor'
import FileApi from '@/api/FileApi'
import ArticleApi from '@/api/articleApi'
export default {
    components: {RichEditor},
    data() {
        return {
            entity: {
                text: {
                    content: null
                },
                cover: null
            },
            progress: 0
        }
    },
    async mounted() {
        let id = this.$route.query.id
        if (id){
            let res = await ArticleApi.getDetail({
                data: {id: id},
                toast: false
            })
            this.entity = res.data.content
        }

        let bar = this.$refs['js-progressbar']
        UIkit.upload('.js-upload', {
            beforeSend: 0,
            beforeAll: async (e, files) => {
                this.progress = 0
                let filename = files[0].name
                let data = await FileApi.multiUpload({
                    data: {
                        file: files[0],
                        filename: 'article/' + Date.now() + filename.substr(filename.lastIndexOf('.'))
                    },
                    progress: (curr, total) => {
                        this.progress = curr / total * 100
                    }
                })
                this.entity.cover = data.content
            }
        });
    },
    methods: {
        commit() {
            ArticleApi.addOrUpdate({
                data: this.entity,
                success: ({data}) => {
                    this.$router.push('/admin/articles')
                }
            })
        }
    }
}
</script>