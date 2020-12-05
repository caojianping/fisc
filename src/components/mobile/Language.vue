<template>
    <div>
        <x-group>
            <x-switch :title="title" :value-map="[1,0]" v-model="language" @on-change="changeLanguage"></x-switch>
        </x-group>
    </div>
</template>

<script>
    export default {
        computed: {
            locale() {
                return this.$i18n.locale
            },
            title() {
                return this.$t('m.global.language')
            }
        },
        data() {
            return {
                language: 0//0表示英文；1表示中文
            }
        },
        methods: {
            changeLanguage(value) {
                let path = this.$route.path;
                if (this.locale === 'zh-CN' && value === 0) {//英文
                    this.$i18n.locale = 'en-US';
                    path = path.replace('/cn', '');
                    this.$router.push(path === '' ? '/mobile' : path);
                } else if (this.locale === 'en-US' && value === 1) {//中文
                    this.$i18n.locale = 'zh-CN';
                    path = path.replace('/mobile', '/mobile/cn');
                    this.$router.push(path === '' ? '/mobile/cn' : path);
                }
            }
        },
        created() {
            this.language = this.locale === 'en-US' ? 0 : 1;
        }
    }
</script>