<template>
    <div>
        <FISCHeader v-if="isShowHeader" :index="2"></FISCHeader>

        <div :class="['map', {'map-fullscreen': !isShowHeader}]">
            <div class="map-main" id="map" v-on:mousemove="toggleHeader"></div>

            <!--地图类型-->
            <ul class="type-list">
                <li :class="['type-item', isTraffic ? 'active': '']">
                    <a @click="toggleTraffic"> {{$t('m.weather.airportTraffic')}} </a>
                </li>
                <li :class="['type-item', isRadar ? 'active': '']">
                    <a @click="toggleRadar"> {{$t('m.weather.weatherRadar')}} </a>
                </li>
            </ul>

            <!--机场搜索-->
            <AutoComplete class="search-box" :value="searchAptCode" :data="allPlanesData"
                          :placeholder="'IATA/ICAO Code'" :width="'350px'" @on-change="changeAptList"
                          @on-select="selectAptList"></AutoComplete>

            <!--详情信息-->
            <div
                :class="['weather-detail', {fixed: !weatherDetail.isGeneral}, {unset: !weatherDetail.isAirportInfomation}]">
                <!--简述信息-->
                <WeatherSketch class="weather-detail-sketch" v-show="weatherDetail.isGeneral"
                               :data="weatherDetail.weatherTitleInfo"></WeatherSketch>

                <!--具体信息-->
                <div class="weather-detail-concrete" v-show="!weatherDetail.isGeneral">
                    <!--选项卡-->
                    <ul class="weather-tabs">
                        <li :class="{'active': weatherDetail.isAirportInfomation}"
                            @click="weatherDetail.isAirportInfomation = true">
                            {{$t('m.weather.aptTitle1')}}
                        </li>
                        <li :class="{'active': !weatherDetail.isAirportInfomation}"
                            @click="weatherDetail.isAirportInfomation = false">
                            {{$t('m.weather.aptTitle2')}}
                        </li>
                    </ul>

                    <!--机场信息-->
                    <div class="weather-tabs-content info" v-show="weatherDetail.isAirportInfomation">
                        <!--子选项卡-->
                        <ul class="weather-subtabs">
                            <li :class="{'active': weatherDetail.subTab === 'lastest'}"
                                @click="weatherDetail.subTab = 'lastest'">{{$t('m.weather.lastest')}}
                            </li>
                            <li :class="{'active': weatherDetail.subTab === 'metar'}"
                                @click="weatherDetail.subTab = 'metar'">{{$t('m.weather.metar')}}
                            </li>
                            <li :class="{'active': weatherDetail.subTab === 'taf'}"
                                @click="weatherDetail.subTab = 'taf'">
                                {{$t('m.weather.taf')}}
                            </li>
                        </ul>

                        <!--最新-->
                        <div class="weather-subtabs-content lastest" v-show="weatherDetail.subTab === 'lastest'">
                            <WeatherSketch :data="weatherDetail.weatherTitleInfo"></WeatherSketch>

                            <!--历史天气-->
                            <section class="panel">
                                <header class="panel-header clearfix">
                                    <h3 class="panel-title" :title="$t('m.weather.metarTitle')">
                                        {{$t('m.weather.historyWeather')}}</h3>
                                    <a class="panel-more" @click="toggleHistoryWeatherList">{{$t('m.weather.more')}}</a>
                                </header>
                                <div class="panel-body">
                                    <ul class="weather-list clearfix">
                                        <li class="weather-item"
                                            v-for="(item, index) in (weatherDetail.isHistoryMore ? weatherDetail.historyWeatherList.slice(0, 5): weatherDetail.historyWeatherList)"
                                            :key="index">
                                            <time>{{item.time}}</time>
                                            <img :src="item.weatherIcon">
                                            <span :title="item.weatherText">{{item.weather}}</span>
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            <!--未来天气-->
                            <section class="panel">
                                <header class="panel-header clearfix">
                                    <h3 class="panel-title" :title="$t('m.weather.cloudTitle')">
                                        {{$t('m.weather.futureWeather')}}</h3>
                                    <a class="panel-more" @click="toggleFutureWeatherList">{{$t('m.weather.more')}}</a>
                                </header>
                                <div class="panel-body">
                                    <ul class="weather-list clearfix">
                                        <li class="weather-item"
                                            v-for="(item, index) in (weatherDetail.isFutureMore ? weatherDetail.futureWeatherList: weatherDetail.allWeatherList)"
                                            :key="index">
                                            <time>{{item.time}}</time>
                                            <img :src="item.weatherIcon">
                                            <span :title="item.weatherText">{{item.weather}}</span>
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            <!--METAR-->
                            <section class="panel">
                                <header class="panel-header clearfix">
                                    <h3 class="panel-title">METAR</h3>
                                    <a class="panel-more"
                                       @click="weatherDetail.subTab='metar'">{{$t('m.weather.more')}}</a>
                                </header>
                                <div class="panel-body">
                                    <span class="msg-text">{{weatherDetail.metarNewestText}}</span>
                                    <time class="msg-time">{{weatherDetail.metarNewestTime}}</time>
                                </div>
                            </section>

                            <!--TAF-->
                            <section class="panel">
                                <header class="panel-header clearfix">
                                    <h3 class="panel-title">TAF</h3>
                                    <a class="panel-more"
                                       @click="weatherDetail.subTab='taf'">{{$t('m.weather.more')}}</a>
                                </header>
                                <div class="panel-body">
                                    <span class="msg-text">{{weatherDetail.tafNewestText}}</span>
                                    <time class="msg-time">{{weatherDetail.tafNewestTime}}</time>
                                </div>
                            </section>

                            <!--异常机场-->
                            <section class="panel">
                                <header class="panel-header clearfix">
                                    <h3 class="panel-title">{{$t('m.weather.airportTraffic')}}</h3>
                                    <span class="panel-status">
                                        {{$t('m.weather.status')}}:{{$t('m.weather.paraStatus["' + String(weatherDetail.paraStatus) + '"]')}}
                                    </span>
                                </header>
                                <div class="panel-body">
                                    <table class="traffic-table">
                                        <tr>
                                            <th></th>
                                            <th>{{$t('m.weather.Inbound')}}</th>
                                            <th>{{$t('m.weather.Outbound')}}</th>
                                        </tr>
                                        <tr>
                                            <td>{{$t('m.weather.lastestTime')}}</td>
                                            <td>{{ weatherDetail.inLatestTime}}</td>
                                            <td>{{ weatherDetail.outLatestTime}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{$t('m.weather.avgTime')}}</td>
                                            <td>{{ weatherDetail.inAvgTraffic}}</td>
                                            <td>{{ weatherDetail.outAvgTraffic}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{$t('m.weather.otp')}}</td>
                                            <td>{{ weatherDetail.inRate}}</td>
                                            <td>{{ weatherDetail.outRate}}</td>
                                        </tr>
                                    </table>
                                </div>
                            </section>
                        </div>

                        <!--metar-->
                        <div class="weather-subtabs-content metar" v-show="weatherDetail.subTab === 'metar'">
                            <ul class="msg-list">
                                <li class="msg-item" v-for="option in weatherDetail.metarList" :key="option.wob">
                                    <span class="msg-text">{{option.wob}}</span>
                                    <time class="msg-time">{{option.time}}</time>
                                </li>
                            </ul>
                        </div>

                        <!--taf-->
                        <div class="weather-subtabs-content taf" v-show="weatherDetail.subTab === 'taf'">
                            <ul class="msg-list">
                                <li class="msg-item" v-for="option in weatherDetail.tafList" :key="option.wob">
                                    <span class="msg-text">{{option.wob}}</span>
                                    <time class="msg-time">{{option.time}}</time>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <!--天气趋势-->
                    <div class="weather-tabs-content trend" v-show="!weatherDetail.isAirportInfomation">
                        <!--子选项卡-->
                        <ul class="weather-subtabs">
                            <li :class="{'active': weatherDetail.weatherSubTab === 'dewPoint'}"
                                @click="weatherDetail.weatherSubTab = 'dewPoint'">{{$t('m.weather.dewPoint')}}
                            </li>
                            <li :class="{'active': weatherDetail.weatherSubTab === 'wind'}"
                                @click="weatherDetail.weatherSubTab = 'wind'">{{$t('m.weather.wind')}}
                            </li>
                            <li :class="{'active': weatherDetail.weatherSubTab === 'qnh'}"
                                @click="weatherDetail.weatherSubTab = 'qnh'">{{$t('m.weather.qnh')}}
                            </li>
                            <li :class="{'active': weatherDetail.weatherSubTab === 'visibility'}"
                                @click="weatherDetail.weatherSubTab = 'visibility'">{{$t('m.weather.visibility')}}
                            </li>
                        </ul>

                        <div v-show="weatherDetail.weatherSubTab==='dewPoint'" class="echarts-box"
                             id="dewPointChart"></div>

                        <div v-show="weatherDetail.weatherSubTab==='wind'" class="echarts-box" id="windChart"></div>

                        <div v-show="weatherDetail.weatherSubTab==='qnh'" class="echarts-box" id="qnhChart"></div>

                        <div v-show="weatherDetail.weatherSubTab==='visibility'" class="echarts-box"
                             id="visibilityChart"></div>
                    </div>
                </div>

                <div :class="['slider', {up: weatherDetail.isGeneral}]"
                     @click="weatherDetail.isGeneral = !weatherDetail.isGeneral"></div>
            </div>
        </div>
    </div>
</template>

<script>
    import WeatherMain from 'src@/js/baseModule/WeatherMain';
    import FISCHeader from 'src@/components/FISCHeader.vue';
    import WeatherSketch from 'src@/components/WeatherSketch.vue';
    import AutoComplete from 'src@/components/AutoComplete.vue';

    export default {
        components: {
            FISCHeader,
            WeatherSketch,
            AutoComplete
        },
        data() {
            return {
                isSwitchHeader: false,
                isShowHeader: true,
                map: null,
                searchAptCode: this.$route.params.apt.toUpperCase(),
                isTraffic: true,
                isRadar: true,
                warnList: {},
                hoverLayer: null,
                clickLayer: null,
                radarWeatherList: [],
                weatherImageLayer: null,
                weatherRadarTimer: 0,
                weatherRadarIndex: 0,
                aptMarkers: {},
                allPlanesData: [],
                nextWeatherTop: '0',
                weatherDetail: {
                    isGeneral: true,
                    isAirportInfomation: true,
                    subTab: 'lastest',
                    weatherSubTab: 'dewPoint',
                    inLatestTime: '-',
                    outLatestTime: '-',
                    inAvgTraffic: '-',
                    outAvgTraffic: '-',
                    inRate: '-',
                    outRate: '-',
                    paraStatus: -1,
                    metarNewestText: '-',
                    metarNewestTime: '-',
                    tafNewestText: '-',
                    tafNewestTime: '-',
                    metarList: [],
                    tafList: [],
                    weatherTitleInfo: {},
                    isHistoryMore: true,
                    isFutureMore: true,
                    historyWeatherList: [],
                    futureWeatherList: [],
                    allWeatherList: []
                },
                dewPointChart: null,
                windChart: null,
                qnhChart: null,
                visibilityChart: null
            };
        },
        beforeRouteLeave(to, from, next) {
            this.clearRadarTimer();
            next();
        },
        methods: WeatherMain,
        watch: {
            $route() {
                let self = this,
                    params = self.$route.params || {};
                self.routerController();
                self.searchAptCode = params.apt ? params.apt.toUpperCase() : '';
            }
        },
        mounted() {
            this.initWeather();
            this.timerHeader();
        }
    };
</script>

<style lang="less" scoped>
    @import "../less/weather.less";
</style>