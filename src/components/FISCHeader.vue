<template>
    <header :class="['fisc-header', {inverse: isInverse}, 'clearfix']">
        <!--LOGO-->
        <router-link class="logo" :to="homeRoute">
            <img :src="logo" alt="FISC">
        </router-link>

        <!--导航栏-->
        <ul class="navs clearfix">
            <li v-for="(nitem, nindex) in $t('m.header.navs')" :key="nindex"
                :class="['nav-item', index === (nindex + 1) ? 'active' : '']">
                <a href="javascript:void(0)">{{nitem.title}}</a>
                <ul class="subnavs">
                    <li v-for="(sitem, sindex) in nitem.subnavs" :key="sindex" class="subnav-item">
                        <router-link :to="sitem.route">{{sitem.title}}</router-link>
                    </li>
                </ul>
            </li>
        </ul>

        <!--设置栏-->
        <ul class="sets clearfix">
            <li class="set-item">
                <Tooltip :content="$t('m.header.language')" placement="left">
                    <a class="switch" @click="changeLanguage">{{languageText}}</a>
                </Tooltip>
            </li>
            <li class="set-item">
                <a class="username" href="javascript:void(0)">{{username}}</a>
                <ul class="dropdown">
                    <li>
                        <a @click="logout" href="javascript:void(0)">{{$t('m.header.logout')}}</a>
                    </li>
                    <li>
                        <router-link :to="passwordRoute">{{$t('m.header.password')}}</router-link>
                    </li>
                </ul>
            </li>
        </ul>
    </header>
</template>

<script>
    import UserToken from 'src@/js/helpers/userToken';
    import {Tooltip, locale} from 'iview';
    import en from 'iview/dist/locale/en-US';
    import zh from 'iview/dist/locale/zh-CN';
    import logo from 'src@/images/logo/logo-white.png';

    export default {
        components: {Tooltip},
        props: {
            isInverse: {default: false},
            index: {default: 1}
        },
        data() {
            return {
                username: null,
                logo: logo,
                homeRoute: null,
                passwordRoute: null,
            };
        },
        computed: {
            languageText() {
                return this.$i18n.locale === 'zh-CN' ? 'English' : '中文';
            }
        },
        methods: {
            setDefault() {
                let userInfo = UserToken.getUserInfo();
                this.username = userInfo ? userInfo.username : '';
                this.homeRoute = this.$i18n.locale === 'zh-CN' ? '/cn' : '/';
                this.passwordRoute = this.$i18n.locale === 'zh-CN' ? '/cn/password' : '/password';
            },
            changeLanguage() {
                let path = this.$route.path;
                switch (this.$i18n.locale) {
                    case 'zh-CN':
                        this.homeRoute = '/';
                        this.passwordRoute = '/cn/password';
                        this.$i18n.locale = 'en-US';
                        locale(en);

                        path = path.replace('/cn', '');
                        this.$router.push(path === '' ? '/' : path);
                        break;
                    case 'en-US':
                        this.homeRoute = '/cn';
                        this.passwordRoute = '/password';
                        this.$i18n.locale = 'zh-CN';
                        locale(zh);

                        this.$router.push('/cn' + (path === '' ? '' : path));
                        break;
                }
                window.location.reload(true);
            },
            logout() {
                UserToken.clearUserToken();
                this.$router.push(this.$route.path.startsWith('/cn') ? '/cn/login' : '/login');
            }
        },
        created() {
            this.setDefault();
        }
    };
</script>

<style lang="less" scoped>
    @import "../less/header.less";
</style>