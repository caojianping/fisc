<template>
    <div>
        <CalculateRules :rule-list="ruleList"></CalculateRules>

        <section class="filter-list">
            <FilterDate :title="titles.date" :data="filterDate"
                        @changeFilterDate="changeFilterDate"></FilterDate>

            <FilterText :title="titles.flightNumber" :data="params.flightNumber" :isUpperCase="true" :isFlightNO="true"
                        @changeFilterText="changeFilterFlightNumber"></FilterText>

            <FilterText :title="titles.forg" :data="params.startAirport" :isUpperCase="true" :isRequired="true"
                        :isICAOCode="true" @changeFilterText="changeFilterStartAirport"></FilterText>

            <FilterText :title="titles.fdst" :data="params.reachAirport" :isUpperCase="true" :isRequired="true"
                        :isICAOCode="true" @changeFilterText="changeFilterReachAirport"></FilterText>

            <FilterSelect :title="titles.cancel" :data="params.cancel" :list="cancels"
                          @changeFilterSelect="changeFilterCancel"></FilterSelect>

            <Button type="primary" @click="search">{{$t('m.global.search')}}</Button>
        </section>

        <div class="table-container">
            <AnalyzerTable :url="url" :params="params" :columns="columns" :isRefresh="isRefresh" :isFlag="true"
                           @changeRefresh="(refresh)=>{this.isRefresh=refresh}"></AnalyzerTable>
        </div>
    </div>
</template>

<script>
    import AnalyzerController from 'src@/js/controllers/analyzer.controller';
    import Urls from 'src@/js/config/urls';
    import {DefaultStartAirport, DefaultEndAirport} from 'src@/js/config/defaults';
    import {FlightNORegExp, MinNumberRegExp, ICAOCodeRegExp} from 'src@/js/config/regulars';

    const analyzerCtrl = new AnalyzerController('route');
    analyzerCtrl.init();

    export default {
        mixins: [analyzerCtrl.data],
        data() {
            return {
                ruleList: {
                    hasdepOTP: true,
                    hasaverageDEPDelayTime: true,
                    hasarrOTP: true,
                    hasaverageARRDelayTime: true,
                    hasscheduledDuration: true,
                    hasactualDuration: true,
                    hasTaxiout: true
                },
                url: Urls.analyzer.route,
                params: {
                    flightNumber: '',
                    startAirport: DefaultStartAirport,
                    reachAirport: DefaultEndAirport
                }
            }
        },
        methods: {
            changeFilterStartAirport(data) {
                this.params['startAirport'] = data.value;
            },
            changeFilterReachAirport(data) {
                this.params['reachAirport'] = data.value;
            },
            search() {
                if (this.params.flightNumber && !FlightNORegExp.test(this.params.flightNumber))
                    return this.$Message.error(`${this.titles.flight}${this.$t('m.validate.illegal')}`);

                if (!this.params.startAirport)
                    return this.$Message.error(`${this.titles.forg}${this.$t('m.validate.required')}`);

                if (!ICAOCodeRegExp.test(this.params.startAirport))
                    return this.$Message.error(`${this.titles.forg}${this.$t('m.validate.illegal')}`);

                if (!this.params.reachAirport)
                    return this.$Message.error(`${this.titles.fdst}${this.$t('m.validate.required')}`);

                if (!ICAOCodeRegExp.test(this.params.reachAirport))
                    return this.$Message.error(`${this.titles.fdst}${this.$t('m.validate.illegal')}`);

                this.isRefresh = true;
            }
        }
    }
</script>