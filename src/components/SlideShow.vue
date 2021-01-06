<template>
    <div>
        <div class="uk-position-relative uk-visible-toggle uk-light" tabindex="-1" 
            :uk-slideshow="'animation: scale; autoplay: true; ratio: 7:3; max-height: ' + minHeight">
            <ul class="uk-slideshow-items">
                <li v-for="item in banners">
                    <img :src="item.fileUrl" uk-cover>
                </li>
            </ul>

            <a class="uk-position-center-left uk-position-small uk-hidden-hover" href="#" uk-slidenav-previous uk-slideshow-item="previous"></a>
            <a class="uk-position-center-right uk-position-small uk-hidden-hover" href="#" uk-slidenav-next uk-slideshow-item="next"></a>

        </div>
    </div>
</template>
<script type="text/javascript">
    import BannerApi from '@/api/bannerApi'

    export default {
        props: {
            minHeight: {
                type: Number,
                default: 350
            }
        },
        data() {
            return {
                banners: [
                    {
                        fileUrl: 'https://getuikit.com/docs/images/photo.jpg'
                    }
                ]
            }
        },
        mounted() {
            this.getData()
        },
        methods: {
            getData(){
                BannerApi.list({
                    success: ({data}) => {
                        this.banners = data.content.records || []
                    }
                })
            }
        }
    }
</script>
