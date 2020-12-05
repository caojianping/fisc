<template>
    <div class="fisc-container">
        <div class="flight-container" v-if="hasFetchData">
            <!--航班统计-->
            <h2 class="flight-stat">
                <strong>{{titleInfo.mainTitle}}</strong>
                <span class="title-date">{{ titleInfo.date }}</span>, {{ $t('m.flightListHeader.totalText') }}
                <em>{{titleInfo.counts}}</em>
                <span class="title-unit">{{ titleInfo.unit }}</span>
            </h2>

            <!--航班标题-->
            <div class="flight-title">
                <p class="w226 w2260">{{ $t('m.flightListHeader.flightNum') }}</p>
                <p class="w96">{{ $t('m.flightListHeader.atype') }}</p>
                <p class="w96">{{ $t('m.flightListHeader.tail') }}</p>
                <p class="w96">{{ $t('m.flightListHeader.from') }}</p>
                <p class="w96">{{ $t('m.flightListHeader.to') }}</p>
                <p class="w96">{{ $t('m.flightListHeader.STD') }}</p>
                <p class="w96">{{ $t('m.flightListHeader.ATD') }}</p>
                <p class="w96">{{ $t('m.flightListHeader.STA') }}</p>
                <p class="w96">{{ $t('m.flightListHeader.ATA') }}</p>
                <p class="w96">{{ $t('m.flightListHeader.carousel') }}</p>
                <p class="w108">{{ $t('m.flightListHeader.status') }}</p>
            </div>

            <!--航班列表-->
            <ul class="flight-list">
                <li v-for="(option, index) in dataList" :key="index">
                    <div class="w226 w2261">
                        <img :src="option.icon" @error.self="imgError">
                        <strong>{{option.code3}}</strong>
                        <a class="share" v-if="option.isCodeSharing">{{ $t('m.global.share') }}</a>
                    </div>
                    <div class="w96">
                        <strong>{{option.type}}</strong>
                    </div>
                    <div class="w96">
                        <strong>{{option.tailNo}}</strong>
                    </div>
                    <div class="w96 city">
                        <strong>{{option.frog}}</strong>
                        <p>{{option.forgGate}}</p>
                    </div>
                    <div class="w96 city">
                        <strong>{{option.fdst}}</strong>
                        <p>{{option.fdstGate}}</p>
                    </div>
                    <div class="w96">
                        <strong>{{option.STD}}</strong>
                    </div>
                    <div class="w96">
                        <strong>{{option.ATD}}</strong>
                    </div>
                    <div class="w96">
                        <strong>{{option.STA}}</strong>
                    </div>
                    <div class="w96">
                        <strong>{{option.ATA}}</strong>
                    </div>
                    <div class="w96">
                        <strong>{{option.carousel}}</strong>
                    </div>
                    <div class="w108">
                        <strong :class="[option.isDelay ? 'delay': '', flightStyles[option.statusCode]]">{{option.status}}</strong>
                    </div>
                </li>
            </ul>
            <Pager :options="pageOptions"></Pager>
        </div>

        <Loading v-show="isLoading"></Loading>

        <div class="flight-none" v-if="isNoData">
            <img src="../images/404.png" alt="noFoundFlights">
            <span>{{$t('m.error.flightInfoNotFound')}}</span>
        </div>
    </div>
</template>

<script>
    import Pager from 'src@/components/Pager.vue';
    import Loading from 'src@/components/Loading.vue';
    import Urls from 'src@/js/config/urls';
    import {AxiosType, ErrorType} from 'src@/js/config/enums';
    import {secondToDateByFormate, mappingStatus, numberToEnMonthName} from 'src@/js/common/utils';

    const urls = {
        'airport': Urls.fetchFlightStatusByAirportUrl,
        'airline': Urls.fetchFlightStatusByAirlineUrl,
        'fnum': Urls.fetchFlightStatusByFnumUrl
    };

    export default {
        components: {Pager, Loading},
        data() {
            return {
                //路由参数
                type: '',
                value: '',
                date: '',
                page: 1,
                //航班数据
                titleInfo: {},
                pageOptions: {},
                dataList: [],
                flightStyles: null,
                //正在加载
                isLoading: false
            };
        },
        computed: {
            hasFetchData() {
                return !this.isLoading && this.dataList.length !== 0;
            },
            isNoData() {
                return !this.isLoading && this.dataList.length === 0;
            }
        },
        methods: {
            setParams() {
                let self = this,
                    params = self.$route.params,
                    type = params.type;
                if (!type) return;

                self.type = type;
                self.value = params.value;
                self.date = params.date;
                self.page = Number(params.page);
            },
            setDefault() {
                let self = this;
                self.setParams();
                self.dataList = [];
                self.flightStyles = {
                    '0': 'status-schedule',
                    '1': 'status-takeoff',
                    '2': 'status-arrived',
                    '3': 'status-cancelled'
                };
            },
            imgError(event) {
                event.target.src = require('../images/image-on-error.png');
            },
            getParams: function () {
                let self = this,
                    arrs = self.date ? self.date.split('/') : [],
                    fdate = arrs[2] + '-' + arrs[1] + '-' + arrs[0],
                    page = self.page,
                    result = {fdate, page, pageSize: 20};
                switch (self.type) {
                    case 'airport':
                        let parts = self.value.split(',');
                        result['forg'] = parts[0];
                        result['fdst'] = parts[1];
                        break;
                    case 'airline':
                        result['airline'] = self.value;
                        break;
                    case 'fnum':
                        result['fnum'] = self.value;
                        break;
                    default:
                        result['fnum'] = self.value;
                        break;
                }
                return result;
            },
            getData() {
                let self = this;
                if (!self.type) return;

                self.$caxios({
                    url: urls[self.type],
                    methods: 'get',
                    params: self.getParams()
                }, AxiosType.TokenLoading)
                    .then(data => self.handleSuccess(data))
                    .catch(err => self.handleError(err));
            },
            handleSuccess(result) {
                let self = this,
                    data = result.data,
                    mainTitle = (self.type === 'airport' ? self.value.replace(',', '-') : self.value).toUpperCase(),
                    arrs = self.date ? self.date.split('/') : [],
                    date = this.$i18n.locale === 'zh-CN' ?
                        arrs[2] + '年' + arrs[1] + '月' + arrs[0] + '日' :
                        numberToEnMonthName(arrs[1]) + ' ' + arrs[0] + ', ' + arrs[2],
                    unit = this.$i18n.locale === 'zh-CN' ? ' 次航班' : data.length <= 1 ? ' flight' : ' flights',
                    counts = result.rowTotal || 0;

                self.$set(self, 'titleInfo', {mainTitle, date, unit, counts});

                self.$set(self, 'pageOptions', {
                    pageCount: result.pageTotal
                });

                let temp = [];
                data.forEach(item => {
                    let airlineCode2 = item.airline ? item.airline.toLowerCase() : '';
                    temp.push({
                        icon: Urls.airlineIconUrl + airlineCode2 + '.png',
                        code3: item.fnum || '-',
                        isCodeSharing: item.share_execute_flag && item.share_execute_flag !== '0',
                        type: item.ftype || '-',
                        tailNo: item.aircraft_number || '-',
                        frog: item.forg || '-',
                        forgGate: item.departure_terminal || '-',
                        fdst: item.fdst || '-',
                        fdstGate: item.arrival_terminal || '-',
                        STD: item.scheduled_deptime ? secondToDateByFormate(item.scheduled_deptime, 'hh:mm') : '-',
                        ATD: item.actual_deptime ? secondToDateByFormate(item.actual_deptime, 'hh:mm') : '-',
                        STA: item.scheduled_arrtime ? secondToDateByFormate(item.scheduled_arrtime, 'hh:mm') : '-',
                        ATA: item.actual_arrtime ? secondToDateByFormate(item.actual_arrtime, 'hh:mm') : '-',
                        carousel: item.baggage_reclaim_carousel || '-',
                        isDelay: item.flight_status_code && item.flight_status_code === '4',
                        status: this.$t('m.global.flightStatus["' + item.flight_status_code + '"]') || '-',
                        statusCode: item.flight_status_code
                    });
                });
                self.dataList = temp;
            },
            handleError(err) {
                let self = this;
                self.dataList = [];
                self.$Message.error(err.type === ErrorType.DataError ? err.msg : err);
            },
            watchRoute() {
                this.setParams();
                this.getData();
            }
        },
        watch: {
            $route: 'watchRoute'
        },
        created() {
            this.setDefault();
        },
        mounted() {
            this.getData();
        }
    };
</script>

<style lang="less" scoped>
    .flight-stat {
        height: 78px;
        font-size: 14px;
        line-height: 78px;

        strong {
            margin-right: 40px;
            font-size: 18px;
            font-weight: bold;
        }

        em {
            padding-left: 6px;
            padding-right: 6px;
            font-size: 18px;
            font-weight: bold;
        }
    }

    .flight-title {
        margin-bottom: 10px;
        height: 50px;
        background-color: white;
        border: 1px solid #d3dbde;

        p {
            float: left;
            line-height: 48px;
            text-align: center;
        }
    }

    .flight-list {
        li {
            position: relative;
            margin-bottom: 10px;
            width: 1200px;
            background-color: white;
            border: 1px solid #d3dbde;
            transition: all 0.5s;
            overflow: hidden;
            cursor: pointer;

            &:hover {
                margin-left: -10px;
                width: 1220px;
                box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
            }

            div {
                float: left;
                margin-top: 20px;
                text-align: center;

                .share {
                    position: absolute;
                    left: 111px;
                    top: 10px;
                    padding: 2px 4px;
                    font-weight: 100;
                    color: #626466;
                    background-color: #ccd2d9;
                    border-radius: 2px;

                    &:hover {
                        color: #626466;
                        cursor: pointer;
                    }
                }

                img {
                    margin-right: 4px;
                    width: 22px;
                    height: 22px;
                }

                strong {
                    font-size: 14px;
                    line-height: 24px;
                    font-weight: bold;

                    &.delay {
                        color: red;
                    }
                }

                p {
                    margin-bottom: 10px;
                    font-weight: 100;
                    line-height: 20px;
                    color: #626466;
                }
            }
        }
    }

    .flight-none {
        margin: 130px 0;
        text-align: center;

        span {
            display: block;
            margin-top: 10px;
            font-size: 14px;
            color: #a1a1a1;
        }
    }

    .w226.w2260 {
        padding-left: 50px;
        text-align: left;
    }

    .w226.w2261 {
        padding-left: 20px;
        text-align: left;
    }

    .w96.city {
        padding-left: 26px;
        text-align: left;
    }

    .w226.w2261 p {
        margin-left: 30px;
    }

    .w226 {
        width: 226px;
    }

    .w96 {
        width: 96px;
    }

    .w108 {
        width: 108px;
    }

    @media screen and (max-width: 1200px) {
        .flight-list {
            li {
                width: 960px;

                &:hover {
                    width: 980px;
                }
            }
        }

        .w96 {
            width: 68px;
        }
    }
</style>