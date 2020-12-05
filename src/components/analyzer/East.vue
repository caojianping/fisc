<template>
    <div>
        <CalculateRules :rule-list="ruleList"></CalculateRules>

        <section class="filter-list">
            <FilterDate :title="titles.date" :data="filterDate"
                        @changeFilterDate="changeFilterDate"></FilterDate>

            <FilterAirport :title="titles.airport" :data="params.airport" :isEast="true"
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
            <AnalyzerTable :type="'notice'" :url="url" :params="params" :columns="columns"
                           :isRefresh="isRefresh" :isFlag="true"
                           @changeRefresh="(refresh)=>{this.isRefresh=refresh}"></AnalyzerTable>
        </div>
    </div>
</template>

<script>
    import AnalyzerController from 'src@/js/controllers/analyzer.controller';
    import {isEarly} from 'src@/js/common/utils';
    import {DefaultEastStartAirport, DefaultMinNumberEarly, DefaultMinNumber} from 'src@/js/config/defaults';
    import Urls from 'src@/js/config/urls';
    import {FlightNORegExp, MinNumberRegExp} from 'src@/js/config/regulars';

    import FilterAirport from 'src@/components/analyzer/filters/FilterAirport.vue';

    const analyzerCtrl = new AnalyzerController('east');
    analyzerCtrl.init();

    export default {
        mixins: [analyzerCtrl.data],
        components: {
            FilterAirport
        },
        data() {
            return {
                ruleList: {
                    hasScheduleFlight: true,
                    hasdepOnTimeFlight: true,
                    hasDepFlightOTP: true,
                    hasTaxiout: true
                },
                url: Urls.analyzer.east,
                params: {
                    airport: DefaultEastStartAirport,
                    flightNumber: '',
                    minNumber: isEarly() ? DefaultMinNumberEarly : DefaultMinNumber
                }
            };
        },
        methods: {
            changeFilterAirport(value) {
                this.params['airport'] = value
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
