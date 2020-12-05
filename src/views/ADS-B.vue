<template>
    <div>
        <FISCHeader v-if="isShowHeader" :isInverse="false" :index="1"></FISCHeader>

        <div :class="['map', {'map-fullscreen': !isShowHeader}]">
            <div class="map-main" id="map" v-on:mousemove="toggleHeader"></div>

            <!--ADS-B类型列表-->
            <ul class="adsb-type-list">
                <!--飞行航班-->
                <li :class="['adsb-type-item', {active: !isGroundMonitor}]">
                    <router-link :to="($i18n.locale === 'zh-CN' ? '/cn' : '') + '/ads-b'">
                        {{$t('m.adsb.types.flight')}}
                    </router-link>
                </li>
                <!--地面监控-->
                <li :class="['adsb-type-item', {active: isGroundMonitor}]">
                    <router-link :to="($i18n.locale === 'zh-CN' ? '/cn' : '') + '/ads-b/ground-monitoring/PEK'">
                        {{$t('m.adsb.types.monitor')}}
                    </router-link>
                </li>
            </ul>

            <!--飞行航班：航班号、航司、机场查询-->
            <div class="search-box" v-if="!isGroundMonitor">
                <Select class="search-type-list" v-model="searchType" @on-change="changeSearchType">
                    <Option v-for="item in searchTypeList" :value="item.key" :key="item.key">{{item.name}}</Option>
                </Select>
                <div class="search-value-box">
                    <input type="text" v-model="searchValue" @keyup.enter="enterSearchValue"
                           :placeholder="searchPlaceholder">
                    <i class="fa fa-search" @click="enterSearchValue"></i>
                </div>
            </div>

            <!--飞行航班：地图类型列表-->
            <section :class="['map-type-box', {'expand': isExpandMapTypeBox}]" v-if="!isGroundMonitor"
                     @mouseenter="toggleMapTypeBox" @mouseleave="toggleMapTypeBox">
                <ul class="map-type-list">
                    <li v-for="(item, index) in mapTypeList" :key="index"
                        :class="['map-type-item', {active: mapType === item.value}]"
                        @click="chooseMapType(item.value)">{{item.label}}
                    </li>
                </ul>
            </section>

            <!--地面监控：机场下拉列表-->
            <div class="airport-select" v-if="isGroundMonitor"
                 @mouseover="isShowDropdown = true" @mouseout="isShowDropdown = false">
                <p class="airport-name">{{selectedAirport}}</p>
                <ul class="airport-dropdown" v-if="isShowDropdown">
                    <li v-for="(item, index) in monitorAirportList" :key="index"
                        :code="item.code" :class="{active: monitorActiveAirport === item.code}">
                        <router-link
                            :to="($i18n.locale === 'zh-CN' ? '/cn' : '') + '/ads-b/ground-monitoring/' + item.code">
                            {{item.name}}
                        </router-link>
                    </li>
                </ul>
            </div>

            <!--地面监控：飞机编号查询-->
            <AutoComplete v-if="isGroundMonitor" class="airplane-search" :value="aptAroundValue"
                          :data="aptAroundFlights"
                          :placeholder="$t('m.adsb.placeholder')" :width="'250px'"
                          @on-change="changeAptAroundFlights"
                          @on-select="selectAptAroundFlights"></AutoComplete>

            <Loading v-show="isLoading" :isShadow="true"></Loading>

            <transition name="loading-fade">
                <div class="detail-loading" v-if="isDetailLoading">
                    <img src="../images/loading.gif" alt="loading...">
                    <span>loading...</span>
                </div>
            </transition>

            <transition name="slide-fade">
                <FlightDetailSidebar v-if="!isGroundMonitor" v-show="isShowSidebar" :details-data-list="detailData"
                                     @close="closeAsidePanel"></FlightDetailSidebar>
            </transition>
        </div>
    </div>
</template>

<script>
    import ADSBMain from 'src@/js/baseModule/ADSBMain';
    import FISCHeader from 'src@/components/FISCHeader.vue';
    import FlightDetailSidebar from 'src@/components/FlightDetailSidebar.vue';
    import AutoComplete from 'src@/components/AutoComplete.vue';
    import Loading from 'src@/components/Loading.vue';

    const airportList = [
        {code: 'PEK', name: 'PEK / ZBAA'},
        {code: 'PVG', name: 'PVG / ZSPD'},
        {code: 'SHA', name: 'SHA / ZSSS'},
        {code: 'CAN', name: 'CAN / ZGGG'},
        {code: 'CSX', name: 'CSX / ZGHA'},
        {code: 'KMG', name: 'KMG / ZPPP'},
        {code: 'KWE', name: 'KWE / ZUGY'},
        {code: 'NKG', name: 'NKG / ZSNJ'},
        {code: 'SZX', name: 'SZX / ZGSZ'},
        {code: 'XIY', name: 'XIY / ZLXY'}
    ];

    export default {
        components: {
            FISCHeader,
            FlightDetailSidebar,
            AutoComplete,
            Loading
        },
        data() {
            return {
                //轮询控件变量
                timer: null,
                interval: 5000,
                errorCount: 0,
                pollCount: 0,
                isFetchPlanes: false,
                //导航栏控制变量
                isSwitchHeader: false,
                isShowHeader: true,
                isExpandMapTypeBox: false,
                //谷歌地图数据变量
                map: null,
                mapType: 'mapbox',
                //坐标、标记数据
                isLoading: false,
                boundsPlanes: {},
                planeMarkers: {},
                monitorBoundsPlanes: {},//地面监控飞机坐标
                monitorPlaneMarkers: {},//地面监控飞机标记
                flightPolyline: [],//航线
                clickPlaneLabel: null,
                hoverPlaneLabel: null,
                monitorPlaneLabel: {},
                //飞行航班：查询数据变量
                searchType: 'fnum',
                searchValue: '',
                //地面监控：查询数据变量
                isShowDropdown: false,
                monitorAirportList: airportList,
                aptAroundFlights: [],
                aptAroundValue: '',
                //航班详情数据变量
                isDetailLoading: false,
                isShowSidebar: false,
                detailEcharts: null,
                detailInfo: null,
                detailData: {}
            };
        },
        computed: {
            searchTypeList() {
                return this.$t('m.adsb.search');
            },
            searchPlaceholder() {
                let self = this,
                    first = self.$t('m.adsb.search').filter(item => item.key === self.searchType)[0];
                return first ? first.placeholder : '';
            },
            mapTypeList() {
                return [
                    {
                        value: 'mapbox',
                        label: this.$t('m.adsb.maps.mapbox')
                    },
                    {
                        value: 'openStreet',
                        label: this.$t('m.adsb.maps.openStreet')
                    },
                    {
                        value: 'terrain',
                        label: this.$t('m.adsb.maps.terrain')
                    }
                ];
            },
            isGroundMonitor() {
                if (
                    this.$route.params.type &&
                    this.$route.params.type === 'ground-monitoring'
                ) {
                    return true;
                }
                return false;
            },
            monitorActiveAirport() {
                if (
                    this.$route.params.type &&
                    this.$route.params.type === 'ground-monitoring'
                ) {
                    return this.$route.params.value;
                }
                return '';
            },
            selectedAirport() {
                let aptName = '';
                if (
                    this.$route.params.type &&
                    this.$route.params.type === 'ground-monitoring'
                ) {
                    let _code = this.$route.params.value;
                    for (let i = 0; i < this.monitorAirportList.length; i++) {
                        let apt = this.monitorAirportList[i];
                        if (apt.code === _code) {
                            aptName = apt.name;
                        }
                    }
                }
                return aptName;
            }
        },
        methods: ADSBMain,
        watch: {
            $route() {
                this.routerController();
            }
        },
        mounted() {
            this.initMap();
            this.timerHeader();
        },
        beforeRouteLeave(to, from, next) {
            // console.log('beforeRouteLeave');
            this.clearTimer();
            next();
        },
        beforeDestroy() {
            // console.log('beforeDestroy');
            this.clearTimer();
        }
    };
</script>

<style lang="less" scoped>
    @import "../less/adsb.less";
</style>