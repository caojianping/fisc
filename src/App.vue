<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
    import device from 'src@/js/common/device';
    import {locale} from 'iview';
    import en from 'iview/dist/locale/en-US';
    import zh from 'iview/dist/locale/zh-CN';

    export default {
        methods: {
            setLanguage() {
                let prefix = device.isMobile() ? 'mobileCn' : 'cn';
                if (this.$route.name.startsWith(prefix)) {
                    this.$i18n.locale = 'zh-CN';
                } else {
                    this.$i18n.locale = 'en-US';
                }
            }
        },
        created() {
            this.setLanguage();
        },
        mounted() {
            if (device.isMobile()) {
                //todo vux zh
            } else {
                locale(en);
            }
        }
    }
</script>