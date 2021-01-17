<template>
    <div class="uk-position-relative">
        <div v-if="showPreview" class="uk-position-absolute" style="right: 10px; top: 9px;">
            <a class="uk-link-muted" @click="preview = !preview" title="预览">
                <eye-icon :size="25"></eye-icon>
            </a>
        </div>
        <quill-editor v-show="!preview" v-model="content" ref="myQuillEditor" :options="editorOption"></quill-editor>
        <input ref="quill-editor-uploader" type="file" hidden @change="beforeUpload">
        <div v-show="preview">
            <p class="ql-editor" v-html="content"></p>
        </div>
    </div>
</template>
<script>
import EyeIcon from '@/components/icons/eye'
import FileApi from '@/api/FileApi'
export default {
    components: {EyeIcon},
    props: {
        showPreview: {
            type: Boolean,
            default: true
        },
        value: {
            type: String,
            default: ''
        }
    },
    watch: {
        value(n, o){
            this.content = n
        },
        content(n, o){
            this.$emit('update:value', n)
        }
    },
    data() {
        return {
            preview: false,
            content: '',
            editorOption: {
                scrollingContainer: '#editorcontainer',
                placeholder: '',
                // or 'bubble'
                theme: 'snow',
                modules: {
                    // imageResize: {
                    //     displayStyles: {
                    //         backgroundColor: 'black',
                    //         border: 'none',
                    //         color: 'white'
                    //     },
                    //     modules: ['Resize', 'DisplaySize', 'Toolbar']
                    // },
                    toolbar: {
                        // 工具栏
                        container: [
                            ['bold', 'italic', 'underline', 'strike'],
                            ['blockquote'],
                            // custom button values
                            [{'header': 1}, {'header': 2}],
                            [{'list': 'ordered'}, {'list': 'bullet'}],
                            // superscript/subscript
                            [{'script': 'sub'}, {'script': 'super'}],
                            // outdent/indent
                            [{'indent': '-1'}, {'indent': '+1'}],
                            // text direction
                            [{'direction': 'rtl'}],
                            [{'size': ['10px', '12px', '14px', '16px', '18px', '20px', '22px', '24px', '26px', '32px', '48px']}],
                            // custom dropdown
                            [{'header': [1, 2, 3, 4, 5, 6, false]}],
                            // dropdown with defaults from theme
                            [{'color': []}, {'background': []}],
                            [{'font': []}],
                            [{'align': []}],
                            ['image'],
                            // remove formatting button
                            ['clean']
                        ],
                        handlers: {
                            'image': value => {
                                if (value) {
                                    this.$refs['quill-editor-uploader'].click()
                                } else {
                                    this.quill.format('image', false)
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    methods: {
        async beforeUpload(e) {
            let file = e.target.files[0]
            if (file){
                let image = await FileApi.multiUpload({
                    data: {
                        file: file,
                        filename: 'article/' + Date.now() + file.name.substr(file.name.lastIndexOf('.'))
                    }
                })
                this.uploadSuccess(image.content)
            }
            e.target.value = ''
        },
        uploadSuccess(res) {
            let quill = this.$refs.myQuillEditor.quill
            // 获取光标所在位置
            let length = quill.getSelection().index;
            // 插入图片，res为服务器返回的图片链接地址
            quill.insertEmbed(length, 'image', res)
            // 调整光标到最后
            quill.setSelection(length + 1)
        }
    }
}
</script>
<style lang="scss">
.ql-editor {
  min-height: 10rem;
}
</style>