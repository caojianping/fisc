<template>
    <div>
        <section class="filter-list">
            <FilterText :title="titles.airline" :data="params.airline" :isUpperCase="true" :AirlineCode="true"
                        @changeFilterText="changeFilterAirline"></FilterText>

            <FilterText :title="titles.forg" :data="params.start" :isUpperCase="true" :isICAOCode="true"
                        @changeFilterText="changeFilterStart"></FilterText>

            <FilterText :title="titles.fdst" :data="params.end" :isUpperCase="true" :isICAOCode="true"
                        @changeFilterText="changeFilterEnd"></FilterText>

            <FilterText :title="titles.planAirplane" :data="params.ftype" :isAirplaneModel="true"
                        @changeFilterText="changeFilterFtype"></FilterText>

            <FilterTimePicker :title="titles.STD" :data="params.planStartHour"
                              @changeFilterTime="changeFilterPlanStartHour"></FilterTimePicker>

            <FilterTimePicker :title="titles.STA" :data="params.planEndHour"
                              @changeFilterTime="changeFilterPlanEndHour"></FilterTimePicker>

            <FilterTimePicker :title="titles.cancelTime" :data="params.cancelTime"
                              @changeFilterTime="changeFilterCancelTime"></FilterTimePicker>

            <Button type="primary" @click="search">{{$t('m.global.search')}}</Button>
        </section>

        <div class="table-container">
            <AnalyzerTable :hasStat="true" :url="url" :params="params" :columns="columns" :isRefresh="isRefresh"
                           :isFlag="true"
                           @changeRefresh="(refresh)=>{this.isRefresh=refresh}"></AnalyzerTable>
        </div>
    </div>
</template>

<script>
    import AnalyzerController from 'src@/js/controllers/analyzer.controller';
    import Urls from 'src@/js/config/urls';
    import {DefaultStartAirport, DefaultEndAirport} from 'src@/js/config/defaults';
    import {AirlineCodeRegExp, ICAOCodeRegExp, AirplaneModelRegExp} from 'src@/js/config/regulars';

    import FilterTimePicker from 'src@/components/analyzer/filters/FilterTimePicker.vue';

    const analyzerCtrl = new AnalyzerController('cancel', false, true);
    analyzerCtrl.init();

    export default {
        mixins: [analyzerCtrl.data],
        components: {
            FilterTimePicker
        },
        data() {
            return {
                url: Urls.analyzer.cancel,
                params: {
                    airline: '',
                    start: '',
                    end: '',
                    ftype: '',
                    planStartHour: '',
                    planEndHour: '',
                    cancelTime: ''
                }
            }
        },
        methods: {
            changeFilterAirline(data) {
                this.params['airline'] = data.value;
            },
            changeFilterStart(data) {
                this.params['start'] = data.value;
            },
            changeFilterEnd(data) {
                this.params['end'] = data.value;
            },
            changeFilterFtype(data) {
                this.params['ftype'] = data.value;
            },
            changeFilterPlanStartHour(value) {
                this.params['planStartHour'] = value;
            },
            changeFilterPlanEndHour(value) {
                this.params['planEndHour'] = value;
            },
            changeFilterCancelTime(value) {
                this.params['cancelTime'] = value;
            },
            search() {
                if (this.params.airline && !AirlineCodeRegExp.test(this.params.airline))
                    return this.$Message.error(`${this.titles.airline}${this.$t('m.validate.illegal')}`);

                if (this.params.start && !ICAOCodeRegExp.test(this.params.start))
                    return this.$Message.error(`${this.titles.forg}${this.$t('m.validate.illegal')}`);

                if (this.params.end && !ICAOCodeRegExp.test(this.params.end))
                    return this.$Message.error(`${this.titles.fdst}${this.$t('m.validate.illegal')}`);

                if (this.params.ftype && !AirplaneModelRegExp.test(this.params.ftype))
                    return this.$Message.error(`${this.titles.planAirplane}${this.$t('m.validate.illegal')}`);

                this.isRefresh = true;
            }
        }
    }
</script>