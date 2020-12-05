<template>
    <div>
        <CalculateRules :rule-list="ruleList"></CalculateRules>

        <section class="filter-list">
            <FilterDate :title="titles.date" :data="filterDate"
                        @changeFilterDate="changeFilterDate"></FilterDate>

            <FilterAirport :title="titles.airport" :data="params.airport"
                           @changeFilterAirport="changeFilterAirport"></FilterAirport>

            <FilterText :title="titles.flightNumber" :data="params.flightNumber" :isUpperCase="true" :isFlightNO="true"
                        @changeFilterText="changeFilterFlightNumber"></FilterText>

            <FilterNumber :title="titles.minNumber" :data="params.minNumber"
                          @changeFilterNumber="changeFilterMinNumber"></FilterNumber>

            <FilterSelect :title="titles.cancel" :data="params.cancel" :list="cancels"
                          @changeFilterSelect="changeFilterCancel"></FilterSelect>

            <Button type="primary" @click="search">{{$t('m.global.search')}}</Button>
        </section>

        <div class="table-container">
            <AnalyzerTable :type="'notice'" :url="url" :params="params" :columns="columns" :callback="callback"
                           :isRefresh="isRefresh" :isFlag="true"
                           @changeRefresh="(refresh)=>{this.isRefresh=refresh}"></AnalyzerTable>
        </div>
    </div>
</template>

<script>
    import AnalyzerController from 'src@/js/controllers/analyzer.controller';
    import {isEarly} from 'src@/js/common/utils';
    import {DefaultStartAirport, DefaultMinNumberEarly, DefaultMinNumber} from 'src@/js/config/defaults';
    import Urls from 'src@/js/config/urls';
    import {FlightNORegExp, MinNumberRegExp} from 'src@/js/config/regulars';

    import FilterAirport from 'src@/components/analyzer/filters/FilterAirport.vue';
    import FilterSwitch from 'src@/components/analyzer/filters/FilterSwitch.vue';

    const analyzerCtrl = new AnalyzerController('aviation');
    analyzerCtrl.init();

    export default {
        mixins: [analyzerCtrl.data],
        components: {
            FilterAirport,
            FilterSwitch
        },
        data() {
            return {
                ruleList: {
                    hasScheduleFlight: true,
                    hasdepOnTimeFlight: true,
                    hasarrOnTimeFlight: true,
                    hasOntimeFlight: true,
                    hasFlightOTP: true,
                    hasaverageDEPDelayTimeAnother: true,
                    hasTaxiout: true
                },
                url: Urls.analyzer.aviation,
                params: {
                    airport: DefaultStartAirport,
                    flightNumber: '',
                    minNumber: isEarly() ? DefaultMinNumberEarly : DefaultMinNumber
                },
                callback: data => {//这个地方服务端根据不同条件返回的数据结构不一样，服务端BUG
                    if (Array.isArray(data)) return data;
                    let result = [];
                    for (let key in data) {
                        result.push(data[key]);
                    }
                    return result;
                }
            }
        },
        methods: {
            changeFilterAirport(value) {
                this.params['airport'] = value;
            },
            search() {
                if (this.params.flightNumber && !FlightNORegExp.test(this.params.flightNumber))
                    return this.$Message.error(`${this.titles.flight}${this.$t('m.validate.illegal')}`);

                if (this.params.minNumber && !MinNumberRegExp.test(this.params.minNumber))
                    return this.$Message.error(this.$t('m.validate.mustNumeric'));

                this.isRefresh = true;
            }
        }
    }
</script>
