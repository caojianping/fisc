import waterLogo from 'src@/images/water_logo.png';

const graphic = [
    {
        type: 'image',
        id: 'logo',
        left: 'center',
        top: 'center',
        z: 10,
        bounding: 'raw',
        style: {
            image: waterLogo,
            width: 150,
            height: 55,
            opacity: 0.6
        }
    },
    {
        type: 'text',
        z: 100,
        left: 20,
        bottom: 10,
        style: {
            fill: '#333',
            text: 'SOURCE: VariFlight',
            font: '10px arial'
        }
    },
    {
        type: 'text',
        z: 100,
        right: 10,
        bottom: 10,
        style: {
            fill: '#333',
            text: 'FISC.VariFlight.com',
            font: '10px arial'
        }
    }
];

const grid = {
    show: true,
    x: 60,
    y: 50,
    x2: 5,
    y2: 50
};

function buildBaseSeries(name, yAxisData) {
    return {
        name: name,
        type: 'line',
        symbol: 'circle',
        data: yAxisData,
        itemStyle: {
            normal: {
                color: '#8d96c3'
            }
        }
    };
}

export default {
    dewPointChart(dpcdatax, tdata, dpcdatay, legends) {
        return {
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    let _html = params[0].axisValue + '</br>';
                    for (let i = 0; i < params.length; i++) {
                        _html += params[i].seriesName + ' : ' + params[i].data + '</br>';
                    }
                    return _html;
                }
            },
            legend: {
                x: 'right',
                data: legends
            },
            graphic: graphic,
            grid: grid,
            xAxis: [
                {
                    type: 'category',
                    axisLine: {show: false},
                    axisTick: {show: false},
                    splitLine: {show: false},
                    axisPointer: {
                        type: 'line',
                        lineStyle: {
                            color: 'rgba(0,0,0,0.15)',
                            width: 1,
                            type: 'dashed'
                        },
                    },
                    data: dpcdatax
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    splitArea: {
                        show: true,
                        areaStyle: {
                            color: ['#ffffff', '#F5F5F5']
                        }
                    },
                    axisLine: {show: false},
                    axisTick: {show: false},
                    splitLine: {
                        lineStyle: {
                            color: '#ddd'
                        }
                    },
                    axisLabel: {
                        show: true,
                        margin: 12,
                        formatter: '{value}℃',
                        textStyle: {
                            color: '#52585e',
                            fontFamily: 'arial',
                        }
                    }
                }
            ],
            series: [
                {
                    name: legends[0],
                    type: 'line',
                    symbol: 'circle',
                    data: tdata,
                    itemStyle: {
                        normal: {
                            color: '#8d96c3'
                        }
                    }
                },
                {
                    name: legends[1],
                    type: 'line',
                    symbol: 'emptyCircle',
                    data: dpcdatay,
                    itemStyle: {
                        normal: {
                            color: '#be8770'
                        }
                    }
                }
            ]
        }
    },
    windChart(xAxisData, yAxisData, legends, unstable) {
        return {
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    return params[0].data.text;
                }
            },
            legend: {
                x: 'right',
                data: legends
            },
            graphic: graphic,
            grid: grid,
            xAxis: [
                {
                    type: 'category',
                    axisLine: {show: false},
                    axisTick: {show: false},
                    splitLine: {show: false},
                    data: xAxisData
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    splitNumber: 4,
                    splitArea: {
                        show: true,
                        areaStyle: {
                            color: ['#ffffff', '#F5F5F5']
                        }
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#ddd'
                        }
                    },
                    axisLabel: {
                        show: true,
                        margin: 12,
                        formatter: '{value}m/s',
                        textStyle: {
                            color: '#52585e',
                            fontFamily: 'arial',
                        }
                    }
                }
            ],
            series: [
                {
                    type: 'line',
                    name: legends[0],
                    symbol: 'arrow',
                    symbolSize: 10,
                    data: yAxisData,
                    itemStyle: {
                        normal: {
                            color: '#8d96c3'
                        }
                    }
                }
            ]
        }
    },
    qnhChart(xAxisData, yAxisData, legends) {
        return {
            tooltip: {
                trigger: 'axis',
                formatter: '{a} : {c}hpa',
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        color: 'rgba(0,0,0,0.15)',
                        width: 1,
                        type: 'dashed'
                    },
                }
            },
            legend: {
                x: 'right',
                data: legends
            },
            graphic: graphic,
            grid: grid,
            xAxis: [
                {
                    type: 'category',
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    },
                    data: xAxisData
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    splitNumber: 4,
                    scale: true,
                    axisLine: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    },
                    splitArea: {
                        show: true,
                        areaStyle: {
                            color: ['#ffffff', '#F5F5F5']
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        show: true,
                        margin: 5,
                        formatter: '{value}hpa',
                        textStyle: {
                            color: '#52585e',
                            fontFamily: 'arial'
                        }
                    }
                }
            ],
            series: [buildBaseSeries(legends[0], yAxisData)]
        }
    },
    visibilityChart(xAxisData, yAxisData, legends) {
        return {
            tooltip: {
                trigger: 'axis',
                formatter: '{a} : {c}m',
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        color: 'rgba(0,0,0,0.15)',
                        width: 1,
                        type: 'dashed'
                    },
                }
            },
            legend: {
                x: 'right',
                data: legends
            },
            graphic: graphic,
            grid: grid,
            xAxis: [
                {
                    type: 'category',
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    },
                    data: xAxisData
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    splitNumber: 4,
                    axisLine: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    splitArea: {
                        show: true,
                        areaStyle: {
                            color: ['#ffffff', '#F5F5F5']
                        }
                    },
                    axisLabel: {
                        show: true,
                        margin: 5,
                        formatter: '{value}km',
                        textStyle: {
                            color: '#52585e',
                            fontFamily: 'arial',
                        }
                    }
                }
            ],
            series: [buildBaseSeries(legends[0], yAxisData)]
        }
    }
}