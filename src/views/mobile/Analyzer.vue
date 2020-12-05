<template>
    <div id="t" @click="clearEvents">
        <header v-if="!isFixed" class="header">
            <a class="back" @click.stop="goBack"></a>

            <div :class="['menu', {open: isMenuToggle}]">
                <div class="menu-selected" @click.stop="menuToggle">
                    <span class="menu-selected-value" :style="{maxWidth: maxWidth}">{{selectedMenu}}</span>
                    <i class="menu-icon"></i>
                </div>
                <ul class="menu-list">
                    <li :class="['menu-item', {active: selectedMenu === item.title}]"
                        v-for="(item, index) in menuList" :key="index">
                        <router-link :to="item.route" @click.native="changeMenu(item)">{{item.title}}</router-link>
                    </li>
                </ul>
            </div>

            <i class="filter" v-model="isFilterShow" @click.stop="openFilter"></i>
        </header>

        <router-view :isFilterShow="isFilterShow" @changeFilter="changeFilter" @changeScroll="changeScroll"/>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                selectedMenu: null,
                isMenuToggle: false,
                isFilterShow: false,
                isFixed: false,
                maxWidth: (document.documentElement.clientWidth || document.body.clientWidth) - 100
            }
        },
        computed: {
            menuList() {
                const routePrefix = {'en-US': '/mobile', 'zh-CN': '/mobile/cn'}[this.$i18n.locale] + '/analyzer';
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
            goBack() {
                this.$router.back(-1);
            },
            menuToggle() {
                this.isMenuToggle = !this.isMenuToggle;
            },
            changeMenu(data) {
                this.selectedMenu = data.title;
                this.isMenuToggle = false;
            },
            openFilter() {
                this.isFilterShow = true;
            },
            changeFilter(filter) {
                this.isFilterShow = filter;
            },
            changeScroll(fixed) {
                this.isFixed = fixed;
            },
            watchRoute(route) {
                let selected = this.menuList.filter(item => route.path.indexOf(item.route) > -1)[0] || this.menuList[0];
                this.selectedMenu = selected.title;
                this.isFilterShow = false;
            },
            clearEvents(event) {
                if (event.target.className !== 'menu' && this.isMenuToggle) {
                    this.isMenuToggle = false;
                }
            }
        },
        watch: {
            $route: 'watchRoute'
        },
        created() {
            this.watchRoute(this.$route);
        }
    }
</script>

<style lang="less" scoped>
    @import "../../less/mobile/analyzer.less";
</style>