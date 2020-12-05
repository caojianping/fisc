<template>
    <div>
        <div class="wave-item">
            <h1 class="operation-title">{{title1}}</h1>
            <div class="echarts" id="waveEcharts"></div>
        </div>

        <div class="wave-item">
            <h1 class="operation-title">{{title2}}</h1>

            <ul class="operation-tabs clearfix">
                <li v-for="(item, index) in $t('m.traffic.types')" :key="index"
                    :class="{active: currentType === item.key}">
                    <a href="javascript:void(0)" @click="switchType(item.key)">{{item.value}}</a>
                </li>
            </ul>

            <div class="echarts" id="columnEcharts"></div>

            <Loading class="echarts-loading" v-show="isLoading"></Loading>

            <ul class="mark-list clearfix">
                <li class="mark-item" v-for="(item, index) in markList" :key="index">
                    <p v-for="(legend, i) in item" :key="i" :style="{backgroundColor: legend.hexColor}">
                        {{legend.name}}</p>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import Echarts from "echarts";
    import Loading from "src@/components/Loading.vue";
    import Urls from "src@/js/config/urls";
    import {zerofill} from "src@/js/common/utils";
    import {AxiosType} from "src@/js/config/enums";

    import waterImg from "src@/images/water_logo.png";
    import timeImg from "src@/images/time.png";

    export default {
        components: {Loading},
        data() {
            return {
                airport: "",
                //波形图表
                waveEcharts: null,
                waveHours: [],
                waveSeries: [],
                //柱形图表
                currentType: "",
                columnEcharts: null,
                columnColor: [],
                columnHours: [],
                columnSeries: [],
                //正在加载
                isLoading: false
            };
        },
        computed: {
            title1() {
                return this.airport + ' ' +
                    new Date().toFormatString('yyyy/MM/dd', true) + ' ' +
                    this.$t('m.traffic.title1');
            },
            title2() {
                return this.airport + ' ' +
                    new Date().toFormatString('yyyy/MM/dd', true) + ' ' +
                    this.$t('m.traffic.title2');
            },
            colors() {
                return {
                    dep: [
                        {name: this.$t('m.traffic.columnLegends["CANCELED"]'), hexColor: "#646c75"},
                        {name: this.$t('m.traffic.columnLegends["ONSCHEDULE"]'), hexColor: "#6AD993"},
                        {name: this.$t('m.traffic.columnLegends["ATD_DLY_30"]'), hexColor: "#FFC1AB"},
                        {name: this.$t('m.traffic.columnLegends["ATD_DLY_60"]'), hexColor: "#FF9870"},
                        {name: this.$t('m.traffic.columnLegends["ATD_DLY_90"]'), hexColor: "#FF7A37"},
                        {name: this.$t('m.traffic.columnLegends["ATD_DLY_MORE"]'), hexColor: "#FF090B"},
                        {name: this.$t('m.traffic.columnLegends["ETD_DLY_30"]'), hexColor: "#8B96C7"},
                        {name: this.$t('m.traffic.columnLegends["ETD_DLY_60"]'), hexColor: "#3C4D99"},
                        {name: this.$t('m.traffic.columnLegends["ETD_DLY_MORE"]'), hexColor: "#0D1F6D"},
                        {name: this.$t('m.traffic.columnLegends["ETD NOT ASSIGNED/NO DLY"]'), hexColor: "#cbcccd"}
                    ],
                    arr: [
                        {name: this.$t('m.traffic.columnLegends["CANCELED"]'), hexColor: "#646c75"},
                        {name: this.$t('m.traffic.columnLegends["ONSCHEDULE"]'), hexColor: "#6AD993"},
                        {name: this.$t('m.traffic.columnLegends["ATA_DLY_30"]'), hexColor: "#FFC1AB"},
                        {name: this.$t('m.traffic.columnLegends["ATA_DLY_60"]'), hexColor: "#FF9870"},
                        {name: this.$t('m.traffic.columnLegends["ATA_DLY_90"]'), hexColor: "#FF7A37"},
                        {name: this.$t('m.traffic.columnLegends["ATA_DLY_MORE"]'), hexColor: "#FF090B"},
                        {name: this.$t('m.traffic.columnLegends["ETA_DLY_30"]'), hexColor: "#8B96C7"},
                        {name: this.$t('m.traffic.columnLegends["ETA_DLY_60"]'), hexColor: "#3C4D99"},
                        {name: this.$t('m.traffic.columnLegends["ETA_DLY_MORE"]'), hexColor: "#0D1F6D"},
                        {name: this.$t('m.traffic.columnLegends["NOT AIRBORNE/NO DLY"]'), hexColor: "#cbcccd"}
                    ],
                    gate: [
                        {name: this.$t('m.traffic.columnLegends["WITHIN 30"]'), hexColor: "#FFC1AB"},
                        {name: this.$t('m.traffic.columnLegends["WITHIN 60"]'), hexColor: "#FF9870"},
                        {name: this.$t('m.traffic.columnLegends["WITHIN 90"]'), hexColor: "#FF7A37"},
                        {name: this.$t('m.traffic.columnLegends["MORE THAN 90"]'), hexColor: "#FF090B"},
                        {name: this.$t('m.traffic.columnLegends["NOT ASSIGNED"]'), hexColor: "#cbcccd"}
                    ]
                };
            },
            markList() {
                let that = this,
                    legends = {
                        dep: [
                            [{name: that.$t('m.traffic.columnLegends["ONSCHEDULE"]'), hexColor: "#6AD993"}],
                            [
                                {name: that.$t('m.traffic.columnLegends["ATD_DLY_30"]'), hexColor: "#FFC1AB"},
                                {name: that.$t('m.traffic.columnLegends["ATD_DLY_60"]'), hexColor: "#FF9870"},
                                {name: that.$t('m.traffic.columnLegends["ATD_DLY_90"]'), hexColor: "#FF7A37"},
                                {name: that.$t('m.traffic.columnLegends["ATD_DLY_MORE"]'), hexColor: "#FF090B"}
                            ],
                            [
                                {
                                    name: that.$t('m.traffic.columnLegends["ETD NOT ASSIGNED/NO DLY"]'),
                                    hexColor: "#cbcccd"
                                },
                                {name: that.$t('m.traffic.columnLegends["CANCELED"]'), hexColor: "#646c75"}
                            ],
                            [
                                {name: that.$t('m.traffic.columnLegends["ETD_DLY_30"]'), hexColor: "#8B96C7"},
                                {name: that.$t('m.traffic.columnLegends["ETD_DLY_60"]'), hexColor: "#3C4D99"},
                                {name: that.$t('m.traffic.columnLegends["ETD_DLY_MORE"]'), hexColor: "#0D1F6D"}
                            ]
                        ],
                        arr: [
                            [{name: that.$t('m.traffic.columnLegends["ONSCHEDULE"]'), hexColor: "#6AD993"}],
                            [
                                {name: that.$t('m.traffic.columnLegends["ATA_DLY_30"]'), hexColor: "#FFC1AB"},
                                {name: that.$t('m.traffic.columnLegends["ATA_DLY_60"]'), hexColor: "#FF9870"},
                                {name: that.$t('m.traffic.columnLegends["ATA_DLY_90"]'), hexColor: "#FF7A37"},
                                {name: that.$t('m.traffic.columnLegends["ATA_DLY_MORE"]'), hexColor: "#FF090B"}
                            ],
                            [
                                {name: that.$t('m.traffic.columnLegends["NOT AIRBORNE/NO DLY"]'), hexColor: "#cbcccd"},
                                {name: that.$t('m.traffic.columnLegends["CANCELED"]'), hexColor: "#646c75"}
                            ],
                            [
                                {name: that.$t('m.traffic.columnLegends["ETA_DLY_30"]'), hexColor: "#8B96C7"},
                                {name: that.$t('m.traffic.columnLegends["ETA_DLY_60"]'), hexColor: "#3C4D99"},
                                {name: that.$t('m.traffic.columnLegends["ETA_DLY_MORE"]'), hexColor: "#0D1F6D"}
                            ]
                        ],
                        gate: [
                            [
                                {name: that.$t('m.traffic.columnLegends["WITHIN 30"]'), hexColor: "#FFC1AB"},
                                {name: that.$t('m.traffic.columnLegends["WITHIN 60"]'), hexColor: "#FF9870"},
                                {name: that.$t('m.traffic.columnLegends["WITHIN 90"]'), hexColor: "#FF7A37"},
                                {name: that.$t('m.traffic.columnLegends["MORE THAN 90"]'), hexColor: "#FF090B"}
                            ],
                            [{name: that.$t('m.traffic.columnLegends["NOT ASSIGNED"]'), hexColor: "#cbcccd"}]
                        ]
                    };
                return legends[that.currentType].slice(0);
            }
        },
        methods: {
            //数据：设置默认值
            setDefault() {
                let that = this;
                that.airport = that.$route.params.airport;
                that.currentType = "dep";
            },
            //数据：获取波形图表数据
            getWaveData() {
                let that = this;
                if (!that.airport) return;

                that.$caxios({
                    url: Urls.operation.traffics,
                    method: 'get',
                    params: {airport: that.airport}
                }, AxiosType.TokenLoading)
                    .then(data => {
                        //时刻补全处理
                        for (let i = 0; i < 24; i++) {
                            let isExist = data.some(function (item) {
                                return Number(item.hour) === i;
                            });
                            if (!isExist) {
                                data.push({
                                    "airportcode": that.airport,
                                    "port": "",
                                    "aport": "",
                                    "enter": "",
                                    "aenter": "",
                                    "hour": String(i)
                                });
                            }
                        }
                        //根据时间排序
                        data.sort((a, b) => {
                            return Number(a.hour) - Number(b.hour);
                        });
                        //获取X轴时刻数据
                        that.waveHours = data.map(function (item) {
                            return Number(item.hour);
                        });
                        //根据配置填充series数据
                        that.waveSeries = [];
                        let config = {
                            port: that.$t('m.traffic.waveLegends[0]'),
                            aport: that.$t('m.traffic.waveLegends[1]'),
                            enter: that.$t('m.traffic.waveLegends[2]'),
                            aenter: that.$t('m.traffic.waveLegends[3]')
                        };
                        for (const key in config) {
                            let temp = {
                                name: config[key],
                                type: "line",
                                symbolSize: 10,
                                smooth: true,
                                data: data.map(function (item) {
                                    return item[key];
                                })
                            };
                            if (key.indexOf("enter") > -1) {
                                temp.xAxisIndex = 1;
                                temp.yAxisIndex = 1;
                            }
                            that.waveSeries.push(temp);
                        }
                        that.setWaveEcharts();
                    })
                    .catch(err => console.info(err));
            },
            //数据：获取柱形图表数据
            getColumnData() {
                let that = this;
                if (!that.airport || !that.currentType) return;

                that.$caxios({
                    url: Urls.operation.screenDiagram,
                    method: 'get',
                    params: {
                        airport: that.airport,
                        type: that.currentType
                    }
                }, AxiosType.TokenLoading)
                    .then(data => {
                        that.isLoading = false;
                        let series = [],
                            sorts = [];
                        //获取X轴坐标时刻数据
                        that.columnHours = (function () {
                            let result = [];
                            for (let i = 0; i < 24; i++) {
                                result.push(i);
                            }
                            return result;
                        })();
                        //获取series数据
                        for (let key in data) {
                            let value = data[key],
                                temp = {
                                    name: that.$t('m.traffic.columnLegends["' + key + '"]'),
                                    type: "bar",
                                    barWidth: "50%",
                                    stack: "data",
                                    areaStyle: {normal: {}},
                                    data: []
                                },
                                arrs = [];
                            that.columnHours.forEach(function (item) {
                                arrs.push(value[String(item)] || 0);
                            });
                            temp.data = arrs;
                            series.push(temp);
                        }
                        //根据不同type、color、legend排序series数据
                        that.columnColor = [];
                        that.colors[that.currentType].forEach(function (item) {
                            that.columnColor.push(item.hexColor);
                            series.forEach(function (sitem) {
                                if (item.name === sitem.name) {
                                    sorts.push(sitem);
                                    return false;
                                }
                            });
                        });
                        //设置当前时间的标志点、标志线
                        let now = new Date(),
                            hours = zerofill(now.getHours()),
                            minutes = zerofill(now.getMinutes());
                        sorts[0]["markPoint"] = {
                            symbol: "image://" + timeImg,
                            itemStyle: {
                                normal: {
                                    label: {
                                        show: true,
                                        formatter: function (param) {
                                            return param.data.value;
                                        },
                                        offset: [6, -4],
                                        fontSize: "14",
                                        textStyle: {
                                            align: "center",
                                            baseline: "middle",
                                            color: "#fff"
                                        }
                                    }
                                }
                            },
                            data: [
                                {
                                    name: "TIME",
                                    value: hours + ":" + minutes,
                                    xAxis: Number(now.getHours()),
                                    y: 17,
                                    symbolSize: [90, 36]
                                }
                            ]
                        };
                        sorts[0]["markLine"] = {
                            itemStyle: {
                                normal: {
                                    label: {
                                        show: true,
                                        formatter: function () {
                                            return "";
                                        }
                                    }
                                }
                            },
                            data: [{xAxis: Number(now.getHours())}]
                        };
                        that.columnSeries = sorts;
                        that.setColumnEcharts();
                    })
                    .catch(err => console.info(err));
            },
            //DOM：设置波形图表
            setWaveEcharts() {
                let that = this,
                    options = {
                        tooltip: {
                            trigger: "axis",
                            formatter: function (params) {
                                let arr = params;
                                if (params[0].axisIndex === 1) {
                                    arr = [params[2], params[3], params[0], params[1]]
                                }
                                let str = arr[0].name + '<br/>';
                                for (let i = 0; i < arr.length; i++) {
                                    let item = arr[i];
                                    str += '<span class="echarts-icon" style="background-color:' + item.color + '"></span>' + item.seriesName + ' : ' + item.value + '<br/>';
                                }
                                return str;
                            }
                        },
                        color: ['#5096fa', '#911606', '#e4a200', '#003db0'],
                        legend: {
                            data: that.$t('m.traffic.waveLegends'),
                            x: "center",
                            bottom: 12
                        },
                        grid: [
                            {
                                top: "6%",
                                left: "1%",
                                right: "1%",
                                height: "39%",
                                containLabel: true
                            },
                            {
                                top: "46.5%",
                                left: "1%",
                                right: "1%",
                                height: "39%",
                                containLabel: true
                            }
                        ],
                        graphic: [
                            {
                                type: "image",
                                id: "logo",
                                left: 70,
                                top: 30,
                                z: 10,
                                bounding: "raw",
                                style: {
                                    image: waterImg,
                                    width: 310,
                                    height: 113,
                                    opacity: 0.6
                                }
                            },
                            {
                                type: "text",
                                z: 100,
                                left: "1%",
                                bottom: 0,
                                style: {
                                    fill: "#333",
                                    text: "SOURCE: VariFlight",
                                    font: "12px arial"
                                }
                            },
                            {
                                type: "text",
                                z: 100,
                                right: "1%",
                                bottom: 0,
                                style: {
                                    fill: "#333",
                                    text: "FISC.VariFlight.com",
                                    font: "12px arial"
                                }
                            }
                        ],
                        dataZoom: [
                            {
                                show: true,
                                realtime: true,
                                start: 0,
                                end: 100,
                                xAxisIndex: [0, 1],
                                left: "1%",
                                right: "1%",
                                bottom: 36
                            },
                            {
                                type: 'inside',
                                realtime: true,
                                start: 0,
                                end: 100,
                                xAxisIndex: [0, 1],
                                left: "1%",
                                right: "1%",
                                bottom: 36
                            }
                        ],
                        axisPointer: {link: {xAxisIndex: "all"}},
                        xAxis: [
                            {
                                type: 'category',
                                boundaryGap: false,
                                axisLine: {onZero: true},
                                data: that.waveHours
                            },
                            {
                                gridIndex: 1,
                                type: 'category',
                                boundaryGap: false,
                                axisLabel: {show: false},
                                axisLine: {onZero: true},
                                data: that.waveHours,
                                position: 'top'
                            }
                        ],
                        yAxis: [
                            {
                                name: that.$t('m.global.flight'),
                                nameTextStyle: {padding: [0, 0, 0, 0]},
                                splitLine: {show: false},
                                axisTick: {show: false},
                                axisLine: {lineStyle: {color: '#555'}}
                            },
                            {
                                gridIndex: 1,
                                inverse: true,
                                nameTextStyle: {padding: [15, 0, 0, 15]},
                                splitLine: {show: false},
                                axisTick: {show: false},
                                axisLine: {lineStyle: {color: '#555'}}
                            }
                        ],
                        series: that.waveSeries
                    };
                if (!that.waveEcharts) {
                    that.waveEcharts = Echarts.init(
                        document.getElementById("waveEcharts")
                    );
                    that.waveEcharts.setOption(options);
                } else {
                    that.waveEcharts.clear();
                    that.waveEcharts.setOption(options);
                }
            },
            //DOM：设置柱形图表
            setColumnEcharts() {
                let that = this,
                    options = {
                        tooltip: {
                            trigger: "axis",
                            axisPointer: {
                                type: "cross",
                                label: {backgroundColor: "#6a7985"}
                            },
                            formatter: function (params) {
                                let value = params[0].axisValue,
                                    result = zerofill(value) + ":00<br />";
                                params.forEach(function (item) {
                                    if (item.value !== 0) {
                                        result +=
                                            item.seriesName +
                                            " : " +
                                            item.value +
                                            "</br>";
                                    }
                                });
                                return result;
                            }
                        },
                        color: that.columnColor,
                        grid: {
                            left: 0,
                            right: 0,
                            bottom: "4%",
                            containLabel: true
                        },
                        graphic: [
                            {
                                type: "image",
                                id: "logo",
                                left: 40,
                                top: 30,
                                z: 10,
                                bounding: "raw",
                                style: {
                                    image: waterImg,
                                    width: 310,
                                    height: 113,
                                    opacity: 0.6
                                }
                            },
                            {
                                type: "text",
                                z: 100,
                                left: 17,
                                bottom: 0,
                                style: {
                                    fill: "#333",
                                    text: "SOURCE: VariFlight",
                                    font: "12px arial"
                                }
                            },
                            {
                                type: "text",
                                z: 100,
                                right: 0,
                                bottom: 0,
                                style: {
                                    fill: "#333",
                                    text: "FISC.VariFlight.com",
                                    font: "12px arial"
                                }
                            }
                        ],
                        xAxis: [
                            {
                                type: "category",
                                data: that.columnHours
                            }
                        ],
                        yAxis: [
                            {
                                show: false,
                                type: "value",
                                axisPointer: {show: false}
                            }
                        ],
                        series: that.columnSeries
                    };
                if (!that.columnEcharts) {
                    that.columnEcharts = Echarts.init(
                        document.getElementById("columnEcharts")
                    );
                    that.columnEcharts.setOption(options);
                } else {
                    that.columnEcharts.clear();
                    that.columnEcharts.setOption(options);
                }
            },
            //事件：状态切换
            switchType(type) {
                this.currentType = type;
                this.getColumnData();
            },
            //事件：重置图表大小
            resizeEcharts() {
                var that = this,
                    timer = null;
                return function () {
                    window.onresize = function () {
                        if (timer) {
                            clearTimeout(timer);
                        }
                        timer = setTimeout(function () {
                            if (that.waveEcharts) {
                                that.waveEcharts.resize();
                            }
                            if (that.columnEcharts) {
                                that.columnEcharts.resize();
                            }
                        }, 500);
                    };
                };
            },
            //监听路由
            watchRoute(route) {
                this.airport = route.params.airport;
                this.getWaveData();
                this.getColumnData();
            }
        },
        watch: {
            $route: "watchRoute"
        },
        created() {
            this.setDefault();
        },
        mounted() {
            this.getWaveData();
            this.getColumnData();
            this.resizeEcharts()();
        }
    };
</script>

<style lang="less" scoped>
    .wave-item {
        position: relative;
        padding-bottom: 30px;
        border-bottom: 1px solid #ebf0f5;
    }

    .echarts {
        width: 100%;
        height: 600px;

        @media screen {
            @media (max-width: 1200px) {
                max-height: 500px;
            }
        }
    }

    .echarts-loading {
        position: absolute;
        top: 135px;
        right: 0;
        bottom: 170px;
        left: 0;
        height: 600px;
        background-color: rgba(255, 255, 255, 0.8);

        @media screen {
            @media (max-width: 1200px) {
                max-height: 500px;
            }
        }
    }

    .mark-list {
        display: block;
        margin: 10px 0 0 8px;
        width: 50%;

        @media screen {
            @media (max-width: 1200px) {
                width: 75%;
            }
        }

        .mark-item {
            width: 25%;
            float: left;

            p {
                margin: 15px auto;
                width: 90%;
                height: 20px;
                font-size: 12px;
                line-height: 20px;
                color: white;
                text-indent: 15px;
                background-color: #ccc;
                border-radius: 2px;
            }
        }
    }
</style>