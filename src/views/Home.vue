<template>
    <div class="fisc">
        <FISCHeader :index="1" :isInverse="isInverse"></FISCHeader>
        <div class="fisc-main">
            <div class="fisc-container">
                <h1 class="title">{{$t('m.global.title')}}</h1>
                <h2 class="stitle">{{$t('m.global.stitle')}}</h2>
            </div>
            <div class="search-container">
                <FlightSearch></FlightSearch>
            </div>
            <HomeIntro></HomeIntro>
        </div>
        <FISCFooter></FISCFooter>
    </div>
</template>

<script>
    import FISCHeader from 'src@/components/FISCHeader.vue';
    import FISCFooter from 'src@/components/FISCFooter.vue';
    import FlightSearch from 'src@/components/FlightSearch.vue';
    import HomeIntro from 'src@/components/HomeIntro.vue';

    export default {
        components: {
            FISCHeader,
            FISCFooter,
            FlightSearch,
            HomeIntro
        },
        data() {
            return {
                isInverse: true
            }
        },
        methods: {
            scrollY() {
                let self = this;
                window.addEventListener('scroll', () => {
                    let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                    if (self.isInverse && scrollTop >= 160) {
                        self.isInverse = false;
                    } else if (!self.isInverse && scrollTop < 160) {
                        self.isInverse = true;
                    }
                })
            },
            bindEvents() {
                this.scrollY();
            }
        },
        mounted() {
            this.bindEvents();
        }
    }
</script>

<style lang="less" scoped>
    @import "../less/home.less";
</style>