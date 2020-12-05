import {convertPercent} from 'src@/js/common/utils';

function titles() {
    return {
        date: this.$t('m.analyzer.date'),
        startDate: this.$t('m.analyzer.startDate'),
        endDate: this.$t('m.analyzer.endDate'),
        seeType: this.$t('m.analyzer.seeType'),
        flightNumber: this.$t('m.analyzer.flightNumber'),
        minNumber: this.$t('m.analyzer.minNumber'),
        airport: this.$t('m.analyzer.airport'),
        airline: this.$t('m.analyzer.airlineCode2'),
        forg: this.$t('m.analyzer.tableHeader.forg'),
        fdst: this.$t('m.analyzer.tableHeader.fdst'),
        planAirplane: this.$t('m.analyzer.planAirplane'),
        STD: this.$t('m.analyzer.STD'),
        STA: this.$t('m.analyzer.STA'),
        cancelTime: this.$t('m.analyzer.cancelTime'),
        cancel: this.$t('m.analyzer.isContainCancel'),
        search: this.$t('m.global.search'),
        reset: this.$t('m.global.reset')
    }
}

function cancels() {
    return this.$t('m.analyzer.cancels')
}

export default {
    rank: {
        titles,
        cancels,
        seeTypes() {
            return this.$t('m.analyzer.seeTypes')
        },
        columns() {
            return [
                {
                    key: 'id',
                    title: this.$t('m.analyzer.tableHeader.rank'),
                    template: value => {
                        if (value < 7) return `<span>${value}</span>`
                        else return value
                    }
                },
                {
                    key: 'code',
                    title: this.$t('m.analyzer.tableHeader.airlinesCode'),
                    template: value => value,
                    style: ['mwidth80']
                },
                {
                    key: 'name',
                    title: this.$t('m.analyzer.tableHeader.airlines'),
                    template: value => value,
                    style: ['nowrap']
                },
                {
                    key: 'total',
                    title: this.$t('m.analyzer.tableHeader.scheduleFlight'),
                    template: value => value,
                    style: ['mwidth65']
                },
                {
                    key: 'normal',
                    title: this.$t('m.analyzer.tableHeader.ontimeFlight'),
                    template: value => value,
                    style: ['mwidth65']
                },
                {
                    key: 'normalRate',
                    title: this.$t('m.analyzer.tableHeader.flightOTP'),
                    template: value => `${convertPercent(value)}%`,
                    style: ['right', 'mwidth80']
                },
                {
                    key: 'reachRate',
                    title: this.$t('m.analyzer.tableHeader.arrFlightOTP'),
                    template: value => `${convertPercent(value)}%`,
                    style: ['right', 'mwidth80']
                }
            ]
        }
    },
    aviation: {
        titles,
        cancels,
        columns() {
            return [
                {
                    key: 'ranking',
                    title: this.$t('m.analyzer.tableHeader.rank'),
                    template: value => {
                        if (value < 11) return `<span>${value}</span>`
                        else return value
                    }
                },
                {
                    key: 'fnum',
                    title: this.$t('m.analyzer.tableHeader.flightNo'),
                    template: value => value
                },
                {
                    key: 'forg',
                    title: this.$t('m.analyzer.tableHeader.forg'),
                    template: value => value
                },
                {
                    key: 'fdst',
                    title: this.$t('m.analyzer.tableHeader.fdst'),
                    template: value => value
                },
                {
                    key: 'planTime',
                    title: this.$t('m.analyzer.tableHeader.ETD'),
                    template: value => value
                },
                {
                    key: 'total',
                    title: this.$t('m.analyzer.tableHeader.scheduleFlight'),
                    template: value => value,
                    style: ['mwidth65']
                },
                {
                    key: 'normal',
                    title: this.$t('m.analyzer.tableHeader.ontimeFlight'),
                    template: value => value,
                    style: ['mwidth65']
                },
                {
                    key: 'avgDelayTime',
                    title: this.$t('m.analyzer.tableHeader.averageDEPDelayTime'),
                    template: value => `${(value / 60).toFixed(0)} min`,
                    style: ['nowrap', 'mwidth80']
                },
                {
                    key: 'normalRate',
                    title: this.$t('m.analyzer.tableHeader.flightOTP'),
                    template: value => `${convertPercent(value)}%`,
                    style: ['right']
                }
            ]
        }
    },
    east: {
        titles,
        cancels,
        columns() {
            return [
                {
                    key: 'ranking',
                    title: this.$t('m.analyzer.tableHeader.rank'),
                    template: value => {
                        if (value < 11) return `<span>${value}</span>`
                        else return value
                    }
                },
                {
                    key: 'fnum',
                    title: this.$t('m.analyzer.tableHeader.flightNo'),
                    template: value => value
                },
                {
                    key: 'forg',
                    title: this.$t('m.analyzer.tableHeader.forg'),
                    template: value => value
                },
                {
                    key: 'fdst',
                    title: this.$t('m.analyzer.tableHeader.fdst'),
                    template: value => value
                },
                {
                    key: 'planTime',
                    title: this.$t('m.analyzer.tableHeader.ETD'),
                    template: value => value
                },
                {
                    key: 'total',
                    title: this.$t('m.analyzer.tableHeader.scheduleFlight'),
                    template: value => value,
                    style: ['mwidth65']
                },
                {
                    key: 'depart',
                    title: this.$t('m.analyzer.calculateRules.depOnTimeFlight'),
                    template: value => value,
                    style: ['mwidth65']
                },
                {
                    key: 'departRate',
                    title: this.$t('m.analyzer.tableHeader.depFlightOTP'),
                    template: value => `${convertPercent(value)}%`,
                    style: ['right']
                }
            ]
        }
    },
    southWest: {
        titles,
        cancels,
        columns() {
            return [
                {
                    key: 'id',
                    title: this.$t('m.analyzer.tableHeader.rank'),
                    template: value => {
                        if (value < 7) return `<span>${value}</span>`
                        else return value
                    }
                },
                {
                    key: 'code',
                    title: this.$t('m.analyzer.tableHeader.airlinesCode'),
                    template: value => value,
                    style: ['mwidth80']
                },
                {
                    key: 'name',
                    title: this.$t('m.analyzer.tableHeader.airlines'),
                    template: value => value,
                    style: ['nowrap']
                },
                {
                    key: 'total',
                    title: `${this.$t('m.analyzer.tableHeader.southWest')}${this.$t('m.analyzer.tableHeader.scheduleFlight')}`,
                    template: value => value,
                    style: ['mwidth65']
                },
                {
                    key: 'normal',
                    title: `${this.$t('m.analyzer.tableHeader.southWest')}${this.$t('m.analyzer.tableHeader.ontimeFlight')}`,
                    template: value => value,
                    style: ['mwidth65']
                },
                {
                    title: `${this.$t('m.analyzer.tableHeader.southWest')}${this.$t('m.analyzer.tableHeader.flightOTP')}`,
                    key: 'normalRate',
                    template: value => `${convertPercent(value)}%`,
                    style: ['right']
                }
            ]
        }
    },
    attention: {
        titles,
        cancels,
        columns() {
            return [
                {
                    key: 'ranking',
                    title: this.$t('m.analyzer.tableHeader.rank'),
                    template: value => {
                        if (value < 11) return `<span>${value}</span>`
                        else return value
                    }
                },
                {
                    key: 'fnum',
                    title: this.$t('m.analyzer.tableHeader.flightNo'),
                    template: value => value
                },
                {
                    key: 'forg',
                    title: this.$t('m.analyzer.tableHeader.forg'),
                    template: value => value
                },
                {
                    key: 'fdst',
                    title: this.$t('m.analyzer.tableHeader.fdst'),
                    template: value => value
                },
                {
                    key: 'planTime',
                    title: this.$t('m.analyzer.tableHeader.ETD'),
                    template: value => value
                },
                {
                    key: 'planTotal',
                    title: this.$t('m.analyzer.tableHeader.scheduleFlight'),
                    template: value => value,
                    style: ['mwidth65']
                },
                {
                    key: 'normal',
                    title: this.$t('m.analyzer.tableHeader.ontimeFlight'),
                    template: value => value,
                    style: ['mwidth65']
                },
                {
                    key: 'normalRate',
                    title: this.$t('m.analyzer.tableHeader.flightOTP'),
                    template: value => `${convertPercent(value)}%`,
                    style: ['right']
                },
                {
                    key: '',
                    title: this.$t('m.analyzer.tableHeader.RankingOfOTP'),
                    template: item => {
                        let rankLabel = this.$t('m.analyzer.tableHeader.rank'),
                            totalLabel = this.$t('m.analyzer.tableHeader.total')
                        return `<label>${rankLabel}：</label><span style="color:red">${item.normalRanking}</span>；<label>${totalLabel}：</label><span style="color:red">${item.total}</span>`
                    }
                }
            ]
        }
    },
    route: {
        titles,
        cancels,
        columns() {
            return [
                {
                    key: 'fnum',
                    title: this.$t('m.analyzer.tableHeader.flightNo'),
                    template: value => value
                },
                {
                    key: 'forg',
                    title: this.$t('m.analyzer.tableHeader.forg'),
                    template: value => value
                },
                {
                    key: 'fdst',
                    title: this.$t('m.analyzer.tableHeader.fdst'),
                    template: value => value
                },
                {
                    key: 'scheduled_deptime',
                    title: this.$t('m.analyzer.tableHeader.ETD'),
                    template: value => value
                },
                {
                    key: 'flightTotal',
                    title: this.$t('m.analyzer.tableHeader.actualFlight'),
                    template: value => value,
                    style: ['mwidth80']
                },
                {
                    key: 'outsidePunctual',
                    title: this.$t('m.analyzer.tableHeader.depOTP'),
                    template: value => `${convertPercent(value)}%`,
                    style: ['right']
                },
                {
                    key: 'avgOutDelayTime',
                    title: this.$t('m.analyzer.tableHeader.averageDEPDelayTime'),
                    template: value => `${(value / 60).toFixed(0)} min`,
                    style: ['nowrap']
                },
                {
                    key: 'insidePunctual',
                    title: this.$t('m.analyzer.tableHeader.arrOTP'),
                    template: value => `${convertPercent(value)}%`,
                    style: ['right']
                },
                {
                    key: 'avgArrDelayTime',
                    title: this.$t('m.analyzer.tableHeader.averageARRDelayTime'),
                    template: value => `${(value / 60).toFixed(0)} min`,
                    style: ['nowrap']
                },
                {
                    key: 'normalRate',
                    title: this.$t('m.analyzer.tableHeader.flightOTP'),
                    template: value => `${convertPercent(value)}%`,
                    style: ['right']
                },
                {
                    key: 'planRouteTime',
                    title: this.$t('m.analyzer.tableHeader.scheduledDuration'),
                    template: value => `${(value / 60).toFixed(0)} min`,
                    style: ['nowrap']
                },
                {
                    key: 'actualRouteTime',
                    title: this.$t('m.analyzer.tableHeader.actualDuration'),
                    template: value => `${(value / 60).toFixed(0)} min`,
                    style: ['nowrap']
                }
            ]
        }
    },
    cancel: {
        titles,
        cancels,
        columns() {
            return [
                {
                    key: 'airline',
                    title: this.$t('m.analyzer.tableHeader.airlines'),
                    template: value => value
                },
                {
                    key: 'fnum',
                    title: this.$t('m.analyzer.tableHeader.flightNo'),
                    template: value => value
                },
                {
                    key: 'forg',
                    title: this.$t('m.analyzer.tableHeader.forg'),
                    template: value => value,
                    style: ['mwidth65']
                },
                {
                    key: 'fdst',
                    title: this.$t('m.analyzer.tableHeader.fdst'),
                    template: value => value
                },
                {
                    key: 'ftype',
                    title: this.$t('m.analyzer.tableHeader.aType'),
                    template: value => value
                },
                {
                    key: 'scheduled_deptime',
                    title: this.$t('m.analyzer.STD'),
                    template: value => new Date(value * 1000).toFormatString('hh:mm', true)
                },
                {
                    key: 'scheduled_arrtime',
                    title: this.$t('m.analyzer.STA'),
                    template: value => new Date(value * 1000).toFormatString('hh:mm', true)
                },
                {
                    key: 'cancelTime',
                    title: this.$t('m.analyzer.cancelTime'),
                    template: value => value,
                    style: ['mwidth100']
                }
            ]
        }
    }
}