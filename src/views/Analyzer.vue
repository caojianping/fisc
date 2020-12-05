<template>
    <div>
        <FISCHeader :index="3"></FISCHeader>

        <div class="analyzer-left">
            <ul class="menu-list">
                <li :class="['menu-item', {active: selectedMenu === item.title}]"
                    v-for="(item, index) in menuList" :key="index">
                    <router-link :to="item.route">{{item.title}}</router-link>
                </li>
            </ul>
        </div>

        <div class="analyzer-main">
            <router-view/>
        </div>
    </div>
</template>

<script>
    import FISCHeader from 'src@/components/FISCHeader.vue';

    export default {
        components: {FISCHeader},
        data() {
            return {
                selectedMenu: null
            }
        },
        computed: {
            menuList() {
                const routePrefix = {'en-US': '', 'zh-CN': '/cn'}[this.$i18n.locale] + '/analyzer';
                const titlePrefix = 'm.analyzer.menus.';
                return [
                    {title: this.$t(`${titlePrefix}rank`), route: routePrefix + '/rank'},
                    {title: this.$t(`${titlePrefix}aviation`), route: routePrefix + '/aviation'},
                    {title: this.$t(`${titlePrefix}east`), route: routePrefix + '/east'},
                    {title: this.$t(`${titlePrefix}southWest`), route: routePrefix + '/southWest'},
                    {title: this.$t(`${titlePrefix}attention`), route: routePrefix + '/attention'},
                    {title: this.$t(`${titlePrefix}route`), route: routePrefix + '/route'},
                    {title: this.$t(`${titlePrefix}cancel`), route: routePrefix + '/cancel'}
                ];
            }
        },
        methods: {
            watchRoute(route) {
                let selected = this.menuList.filter(item => route.path.indexOf(item.route) > -1)[0] || this.menuList[0];
                this.selectedMenu = selected.title;
            }
        },
        watch: {
            $route: 'watchRoute'
        },
        created() {
            this.watchRoute(this.$route);
        }
    };
</script>

<style lang="less" scoped>
    @import "../less/analyzer.less";
</style>