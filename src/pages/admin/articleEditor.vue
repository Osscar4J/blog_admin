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
                <!-- <rich-editor :value.sync="entity.text.content"></rich-editor> -->

                <div id="editor—wrapper">
                    <div id="toolbar-container"><!-- 工具栏 --></div>
                    <div id="editor-container"><!-- 编辑器 --></div>
                </div>

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

let editor = null

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
                let res = await FileApi.ossUpload({
                    data: {
                        file: files[0],
                        filename: 'article/' + Date.now() + filename.substr(filename.lastIndexOf('.'))
                    },
                    progress(p, _checkpoint){
                        this.progress = p*100
                    }
                })
                this.entity.cover = res.fullUrl
            }
        });

        const { createEditor, createToolbar } = window.wangEditor
        const editorConfig = {
            placeholder: 'Type here...',
            onChange(editor) {
                // const html = editor.getHtml()
                // console.log('editor content', html)
            }
        }

        editor = createEditor({
            selector: '#editor-container',
            html: '<p><br></p>',
            config: editorConfig,
            mode: 'default', // or 'simple'
        })

        const toolbarConfig = { }
        const toolbar = createToolbar({
            editor,
            selector: '#toolbar-container',
            config: toolbarConfig,
            mode: 'default', // or 'simple'
        })

        const _this = this
        editor.setHtml(this.entity.text.content||'')
        editor.getConfig()['MENU_CONF']['lineHeight']['lineHeightList'] = ['0.5', '1', '1.5', '2', '2.5', '3']
        editor.getConfig()['MENU_CONF']['uploadImage'] = {
            server: '/api/file',
            // form-data fieldName ，默认值 'wangeditor-uploaded-image'
            fieldName: 'file',
            // 单个文件的最大体积限制，默认为 2M
            maxFileSize: 1 * 1024 * 1024, // 1M
            // 最多可上传几个文件，默认为 100
            maxNumberOfFiles: 1,
            // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
            allowedFileTypes: ['image/*'],
            // 自定义上传参数，例如传递验证的 token 等。参数会被添加到 formData 中，一起上传到服务端。
            meta: {
                token: 'xxx',
                otherKey: 'yyy'
            },
            // 将 meta 拼接到 url 参数中，默认 false
            metaWithUrl: false,
            // 自定义增加 http  header
            headers: {
                Accept: 'text/x-json',
                otherKey: 'xxx'
            },
            // 跨域是否传递 cookie ，默认为 false
            withCredentials: true,
            // 超时时间，默认为 10 秒
            timeout: 5 * 1000, // 5 秒
            async customUpload(file, insertFn){
                _this.progress = 0
                let filename = file.name
                let res = await FileApi.ossUpload({
                    data: {
                        file: file,
                        filename: 'article/' + Date.now() + filename.substr(filename.lastIndexOf('.'))
                    },
                    progress(p, _checkpoint){
                        _this.progress = p*100
                    }
                })
                insertFn(res.fullUrl, file.name)
            },
            onError(file, err, res){

            }
        }
    },
    methods: {
        commit() {
            this.entity.text.content = editor.getHtml()
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
<style lang="scss" scoped>
#editor—wrapper {
    border: 1px solid #ccc;
    z-index: 100; /* 按需定义 */
}
#toolbar-container { border-bottom: 1px solid #ccc; }
#editor-container { height: 500px; }
</style>