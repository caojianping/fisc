<template>
    <div class="fisc">
        <FISCHeader :index="2"></FISCHeader>

        <div class="fisc-main">
            <div class="operation-toolbar">
                <div class="fisc-container clearfix">
                    <!--机场三字码查询-->
                    <div class="operation-search">
                        <label for="airport">{{$t('m.traffic.searchText')}}</label>
                        <Select id="airport" v-model="selectedAirport" :value="selectedAirport"
                                @on-change="changeAirport()" style="width: 168px;">
                            <Option v-for="(item, index) in airportList" :key="index" :value="item">{{item}}</Option>
                        </Select>
                    </div>

                    <!--机场流量导航栏-->
                    <ul class="operation-navs">
                        <li v-for="(item, index) in $t('m.traffic.navs')" :key="index"
                            :class="{active: isActive.indexOf(item.route) > -1}">
                            <router-link :to="item.route + '/' + selectedAirport + (item.isPage ? '/1': '')">
                                {{item.title}}
                            </router-link>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="operation-main">
                <div class="fisc-container">
                    <!--机场流量数据-->
                    <router-view></router-view>
                </div>
            </div>
        </div>

        <FISCFooter></FISCFooter>
    </div>
</template>

<script>
    import FISCHeader from 'src@/components/FISCHeader.vue';
    import FISCFooter from 'src@/components/FISCFooter.vue';

    export default {
        components: {
            FISCHeader,
            FISCFooter
        },
        data() {
            return {
                airportList: null,
                selectedAirport: ''
            };
        },
        computed: {
            isActive() {
                return this.$route.path;
            }
        },
        methods: {
            //数据：设置默认值
            setDefault() {
                this.airportList = [
                    'PEK',
                    'CSX',
                    'URC',
                    'PVG',
                    'CAN',
                    'TAO',
                    'CTU',
                    'CGO',
                    'SZX',
                    'SYX',
                    'SHA',
                    'HAK',
                    'KMG',
                    'TSN',
                    'XIY',
                    'CKG',
                    'HRB',
                    'HGH',
                    'KWE',
                    'XMN',
                    'SHE',
                    'NKG',
                    'FOC',
                    'WUH',
                    'NNG',
                    'DLC'
                ];
                this.selectedAirport = this.airportList[0];
            },
            //事件：选择机场列表
            changeAirport() {
                this.$router.push({
                    name: this.$route.name,
                    params: {airport: this.selectedAirport}
                });
            }
        },
        created() {
            this.setDefault();
        }
    };
</script>

<style lang="less" scoped>
    @import "../less/operation.less";
</style>