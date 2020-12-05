<template>
    <div>
        <h1 class="operation-title">{{title}}</h1>

        <ul class="operation-tabs clearfix">
            <li v-for="(item, index) in $t('m.traffic.types')" :key="index" v-if="index!==2"
                :class="{active: currentType === item.key}">
                <a href="javascript:void(0)" @click="switchType(item.key)">{{item.value}}</a>
            </li>
        </ul>

        <ul class="operation-overview clearfix">
            <li v-for="(item, key, index) in overview" :key="index"
                :style="item.isShow === false ? {display:'none'} : ''">
                <figure><img :src="item.icon" :alt="item.desc"></figure>
                <dl>
                    <dt>{{overviewData[key]}}<span v-if="item.unit">{{item.unit}}</span></dt>
                    <dd>{{item.desc}}</dd>
                </dl>
            </li>
        </ul>

        <table class="fisc-table">
            <!--表格列名-->
            <thead>
            <tr>
                <th v-for="(column, index) in columns" :key="index">{{column.title}}</th>
            </tr>
            </thead>

            <!--表格数据-->
            <tbody v-if="!isLoading">
            <tr v-if="dataList.length !== 0" v-for="(item, index) in dataList" :key="index">
                <td v-for="(column, cindex) in columns" :key="cindex"
                    v-html="column.template(item[column.key], item.isEst)"></td>
            </tr>
            <tr v-if="dataList.length === 0">
                <td colspan="9">no data</td>
            </tr>
            </tbody>

            <!--正在加载-->
            <tbody v-if="isLoading">
            <tr>
                <td colspan="9">
                    <Loading></Loading>
                </td>
            </tr>
            </tbody>
        </table>

        <Pager :options="pageOptions"></Pager>
    </div>
</template>

<script>
    import Urls from "src@/js/config/urls";
    import {dateFormate, secondToDateByFormate} from "src@/js/common/utils";
    import {AxiosType} from "src@/js/config/enums";
    import Pager from "src@/components/Pager.vue";
    import Loading from "src@/components/Loading.vue";

    import lastTimeIcon from "src@/images/view1.png";
    import delayIcon from "src@/images/view2.png";
    import delayMoreIcon from "src@/images/view3.png";
    import averageIcon from "src@/images/view4.png";
    import averageGateIcon from "src@/images/view5.png";

    export default {
        components: {Pager, Loading},
        data() {
            return {
                airport: "",
                currentType: null,
                //概述数据
                overviewData: null,
                //表格数据
                isInit: null,
                pageOptions: {
                    pageCount: 1
                },
                currentPage: null,
                dataList: [],
                flightStyles: {
                    "0": "status-schedule",
                    "1": "status-takeoff",
                    "2": "status-arrived",
                    "3": "status-cancelled"
                },
                //正在加载
                isLoading: false
            };
        },
        computed: {
            title() {
                return this.airport + ' ' +
                    new Date().toFormatString('yyyy/MM/dd', true) + ' ' +
                    this.$t('m.traffic.navs[1].title');
            },
            overview() {
                let that = this;
                return {
                    lastTime: {
                        icon: lastTimeIcon,
                        desc: {
                            dep: that.$t('m.traffic.overview.lastTime.dep'),
                            arr: that.$t('m.traffic.overview.lastTime.arr')
                        }[that.currentType]
                    },
                    delay: {
                        icon: delayIcon,
                        unit: "%",
                        desc: that.$t('m.traffic.overview.delay')
                    },
                    delayMore: {
                        icon: delayMoreIcon,
                        unit: "%",
                        desc: that.$t('m.traffic.overview.delayMore')
                    },
                    average: {
                        icon: averageIcon,
                        unit: "min",
                        desc: that.$t('m.traffic.overview.average')
                    },
                    averageGate: {
                        isShow: that.currentType === "dep",
                        icon: averageGateIcon,
                        unit: "min",
                        desc: that.$t('m.traffic.overview.averageGate')
                    }
                };
            },
            columns() {
                let that = this;
                return [
                    {
                        key: "col1",
                        title: that.$t('m.traffic.thead["' + (that.currentType === 'dep' ? 'STD' : 'STA') + '"]'),
                        template(value) {
                            return value;
                        }
                    },
                    {
                        key: "col2",
                        title: that.$t("m.traffic.thead.flightNo"),
                        template(value) {
                            return value;
                        }
                    },
                    {
                        key: "col3",
                        title: that.$t("m.traffic.thead.acType"),
                        template(value) {
                            return value;
                        }
                    },
                    {
                        key: "col4",
                        title: that.$t("m.traffic.thead.tail"),
                        template(value) {
                            return value;
                        }
                    },
                    {
                        key: "col5",
                        title: that.$t("m.traffic.thead.terminal"),
                        template(value) {
                            return value;
                        }
                    },
                    {
                        key: "col6",
                        title: that.$t('m.traffic.thead["' + (that.currentType === 'dep' ? 'to' : 'from') + '"]'),
                        template(value) {
                            return value;
                        }
                    },
                    {
                        key: "col7",
                        title: that.$t("m.traffic.thead.gate"),
                        template(value) {
                            return value;
                        }
                    },
                    {
                        key: "col8",
                        title: that.$t('m.traffic.thead["' + (that.currentType === 'dep' ? 'takeOff' : 'landing') + '"]'),
                        template(value, isEst) {
                            return (isEst ? '<span class="prefix">Est.</span>' : '') + value;
                        }
                    },
                    {
                        key: "col9",
                        title: that.$t("m.traffic.thead.status"),
                        template(value) {
                            return '<span class="' + that.flightStyles[value] + '">' +
                                that.$t('m.global.flightStatus["' + value + '"]') +
                                '</span>';
                        }
                    }
                ];
            },
        },
        methods: {
            //数据：设置默认值
            setDefault() {
                let that = this;
                that.airport = that.$route.params.airport;
                that.overviewData = {
                    lastTime: "--:--",
                    delay: "--",
                    delayMore: "--",
                    average: "--",
                    averageGate: ""
                };
                that.isInit = false;
                that.currentType = "dep";
                that.currentPage = -1;
            },
            //数据：获取概述数据
            getOverviewData() {
                let that = this;
                if (!that.airport || !that.currentType) return;

                that.$caxios({
                    url: Urls.operation.states,
                    method: 'get',
                    params: {
                        airport: that.airport,
                        type: that.currentType
                    }
                }, AxiosType.TokenLoading)
                    .then(data => {
                        if (that.currentType === "dep") {
                            //设置最后起飞/到达时间
                            if (data.latestDepFlight && data.latestDepFlight.actual_deptime) {
                                that.overviewData.lastTime = data.latestDepFlight.actual_deptime;
                            }
                            //设置平均延误时间
                            if (data.avgGtoTime) {
                                that.overviewData.averageGate = Math.ceil(Number(data.avgGtoTime) / 60);
                            }
                        } else if (that.currentType === "arr") {
                            //设置最后起飞/到达时间
                            if (data.latestArrFlight && data.latestArrFlight.actual_arrtime) {
                                that.overviewData.lastTime = data.latestArrFlight.actual_arrtime;
                            }
                        }
                        //设置延误率
                        if (data.ontime && data.ontime["0030"]) {
                            that.overviewData.delay = (Number(data.ontime["0030"]) * 100).toFixed(2);
                        }
                        //设置延误一小时以上延误率
                        if (data.ontime && data.ontime["60"]) {
                            that.overviewData.delayMore = (Number(data.ontime["60"]) * 100).toFixed(2);
                        }
                        //设置平均延误时间
                        if (data.avgDelayTime) {
                            that.overviewData.average = Math.ceil(Number(data.avgDelayTime) / 60);
                        }
                    })
                    .catch(err => console.info(err));
            },
            //数据：获取表格数据
            getTableData(isCurrent) {
                isCurrent = !!isCurrent;

                let that = this;
                if (!that.airport || !that.currentType || !that.currentPage) return;

                that.$caxios({
                    url: Urls.operation.screen,
                    method: 'get',
                    params: {
                        airport: that.airport,
                        type: that.currentType,
                        page: that.currentPage,
                        sort: "default"
                    }
                }, AxiosType.TokenLoading)
                    .then(data => {
                        that.isLoading = false;
                        that.pageOptions.pageCount = data.pageTotal || 1;

                        if (isCurrent) {
                            that.currentPage = data.cpage || 1;
                            that.$router.replace({
                                name: that.$route.name,
                                params: {
                                    airport: that.airport,
                                    page: that.currentPage
                                }
                            });
                        }
                        that.dataList = [];
                        let list = data.data;
                        if (that.currentType === "dep") {
                            list.forEach(item => {
                                that.dataList.push({
                                    col1: item.scheduled_deptime ?
                                        secondToDateByFormate(item.scheduled_deptime, "hh:mm") : "--:--",
                                    col2: item.fnum || "-",
                                    col3: item.ftype || "-",
                                    col4: item.aircraft_number || "-",
                                    col5: item.departure_terminal || "-",
                                    col6: item.fdst || "-",
                                    col7: item.gate || "-",
                                    col8: item.actual_deptime ?
                                        secondToDateByFormate(item.actual_deptime, "hh:mm") :
                                        (item.estimated_deptime ?
                                            secondToDateByFormate(item.estimated_deptime, "hh:mm") : "--:--"),
                                    col9: item.flight_status_code,
                                    isEst: !item.actual_deptime && item.estimated_deptime,
                                    isDelay: item.flight_status_code === "4"
                                });
                            });
                        } else if (that.currentType === "arr") {
                            list.forEach(item => {
                                that.dataList.push({
                                    col1: item.scheduled_arrtime ?
                                        secondToDateByFormate(item.scheduled_arrtime, "hh:mm") : "--:--",
                                    col2: item.fnum || "-",
                                    col3: item.ftype || "-",
                                    col4: item.aircraft_number || "-",
                                    col5: item.arrival_terminal || "-",
                                    col6: item.forg || "-",
                                    col7: item.gate || "-",
                                    col8: item.actual_arrtime ?
                                        secondToDateByFormate(item.actual_arrtime, "hh:mm") :
                                        (item.estimated_arrtime ?
                                            secondToDateByFormate(item.estimated_arrtime, "hh:mm") : "--:--"),
                                    col9: item.flight_status_code,
                                    isEst: !item.actual_arrtime && item.estimated_arrtime,
                                    isDelay: item.flight_status_code === "4"
                                });
                            });
                        }
                    })
                    .catch(err => console.info(err));
            },
            //事件：状态切换
            switchType(type) {
                this.currentType = type;
                this.getOverviewData();
                this.getTableData(true);
            },
            //监听路由
            watchRoute(route) {
                this.airport = route.params.airport;
                this.currentPage = route.params.page;
                this.getOverviewData();
                this.getTableData();
            }
        },
        watch: {
            $route: "watchRoute"
        },
        created() {
            this.setDefault();
        },
        mounted() {
            this.getOverviewData();
            this.getTableData(true);
        }
    };
</script>

<style lang="less" scoped>
    .operation-overview {
        display: block;
        margin: 30px 0;
        width: 100%;

        li {
            display: block;
            float: left;
            width: 20%;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;

            figure {
                display: block;
                float: left;
                margin-top: 10px;
                width: 52px;
                height: 48px;

                img {
                    display: block;
                    width: 100%;
                    height: 100%;
                }
            }

            dl {
                margin-left: 67px;

                dt {
                    font-size: 30px;

                    span {
                        font-size: 12px;
                        color: #626466;
                    }
                }

                dd {
                    margin-left: 5px;
                    color: #626466;
                }
            }
        }
    }
</style>