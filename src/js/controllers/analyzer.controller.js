import Language from 'src@/components/mobile/Language.vue';
import Logout from 'src@/components/mobile/Logout.vue';
import MobileTable from 'src@/components/mobile/analyzer/MobileTable.vue';

import CalculateRules from 'src@/components/analyzer/CalculateRules.vue';
import FilterDate from 'src@/components/analyzer/filters/FilterDate.vue';
import FilterSelect from 'src@/components/analyzer/filters/FilterSelect.vue';
import FilterText from 'src@/components/analyzer/filters/FilterText.vue';
import FilterNumber from 'src@/components/analyzer/filters/FilterNumber.vue';
import FilterAirport from 'src@/components/analyzer/filters/FilterAirport.vue';
import AnalyzerTable from 'src@/components/analyzer/AnalyzerTable.vue';

import analyzerComputed from 'src@/js/config/analyzerComputed';
import getAnalyzerAirportList from 'src@/js/config/analyzerAirportList';
import {FlightNORegExp, MinNumberRegExp} from 'src@/js/config/regulars';

function getRangeDate() {
    let today = new Date(),
        startDate = null,
        endDate = today.addDays(-1);
    if (today.getDate() === 1) {//如果是月初第一天
        startDate = today.addMonths(-1);//上个月第一天
    } else {
        startDate = new Date(today.setDate(1));
    }
    return {
        startDate: startDate,
        endDate: endDate
    };
}

function AnalyzerController(type, isMobile, isCancel) {
    this.type = type;
    this.isMobile = !!isMobile;
    this.isCancel = !!isCancel;
    this.data = null;
}

AnalyzerController.prototype = {
    init() {
        let type = this.type,
            isCancel = this.isCancel;
        if (this.isMobile) {//移动端
            this.data = {
                components: {
                    Language,
                    Logout,
                    MobileTable
                },
                props: ['isFilterShow'],
                data() {
                    return {
                        isShow: this.isFilterShow,
                        isRefresh: false,
                        params: isCancel ? {} : {
                            startDay: '',
                            endDay: '',
                            cancel: 1
                        },
                        iconTypes: {
                            flightNumber: '',
                            minNumber: ''
                        },
                        airportList: getAnalyzerAirportList(type === 'east')
                    }
                },
                computed: analyzerComputed[type],
                methods: {
                    setDefaultDate() {
                        let ranges = getRangeDate();
                        this.params['startDay'] = ranges.startDate.toFormatString('yyyy-MM-dd', true);
                        this.params['endDay'] = ranges.endDate.toFormatString('yyyy-MM-dd', true);
                    },
                    hidePopup() {
                        this.isShow = false;
                        this.$emit('changeFilter', false);
                    },
                    changeFilterFlightNumber() {
                        this.params.flightNumber = this.params.flightNumber.toUpperCase();
                        if (this.params.flightNumber && !FlightNORegExp.test(this.params.flightNumber))
                            this.iconTypes.flightNumber = 'error';
                        else
                            this.iconTypes.flightNumber = '';
                    },
                    changeFilterMinNumber() {
                        if (!MinNumberRegExp.test(this.params.minNumber))
                            this.iconTypes.minNumber = 'error';
                        else
                            this.iconTypes.minNumber = '';
                    },
                    search() {
                        if (this.params.startDay && this.params.endDay) {
                            if (Date.parse(this.params.startDay) > Date.parse(this.params.endDay))
                                return this.$Message.error(this.$t('m.validate.dateSize'));
                        }
                        this.isRefresh = true;
                        this.isShow = false;
                        this.$emit('changeFilter', false);
                    },
                    reset() {
                        if (this.params) {
                            for (let key in this.params) {
                                this.params[key] = '';
                            }
                        }
                    }
                },
                watch: {
                    isFilterShow(show) {
                        this.isShow = show;
                    }
                },
                created() {
                    if (!isCancel) {
                        this.setDefaultDate();
                    }
                }
            }
        } else {//PC端
            this.data = {
                components: {
                    CalculateRules,
                    FilterDate,
                    FilterSelect,
                    FilterText,
                    FilterNumber,
                    FilterAirport,
                    AnalyzerTable
                },
                data() {
                    return {
                        isRefresh: false,
                        filterDate: null,
                        params: isCancel ? {} : {
                            startDay: '',
                            endDay: '',
                            cancel: 1
                        }
                    }
                },
                computed: analyzerComputed[type],
                methods: {
                    _setDate(dates) {
                        this.filterDate = dates.map(item => item.toFormatString('dd/MM/yyyy', true));
                        this.params['startDay'] = dates[0].toFormatString('yyyy-MM-dd', true);
                        this.params['endDay'] = dates[1].toFormatString('yyyy-MM-dd', true);
                    },
                    setDefaultDate() {
                        let ranges = getRangeDate();
                        this._setDate([ranges.startDate, ranges.endDate]);
                    },
                    changeFilterDate(value) {
                        this._setDate(value);
                    },
                    changeFilterFlightNumber(data) {
                        this.params['flightNumber'] = data.value;
                    },
                    changeFilterMinNumber(data) {
                        this.params['minNumber'] = data.value;
                    },
                    changeFilterCancel(value) {
                        this.params['cancel'] = value;
                    },
                    search() {
                        this.isRefresh = true;
                    }
                },
                created() {
                    if (!isCancel) {
                        this.setDefaultDate();
                    }
                }
            }
        }
    }//end init
};

export default AnalyzerController;