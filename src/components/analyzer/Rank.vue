<template>
    <div>
        <CalculateRules :rule-list="ruleList"></CalculateRules>

        <section class="filter-list">
            <FilterDate :title="titles.date" :data="filterDate"
                        @changeFilterDate="changeFilterDate"></FilterDate>

            <FilterSelect :title="titles.seeType" :data="params.seeType" :list="seeTypes"
                          @changeFilterSelect="changeFilterSeeType"></FilterSelect>

            <FilterSelect :title="titles.cancel" :data="params.cancel" :list="cancels"
                          @changeFilterSelect="changeFilterCancel"></FilterSelect>

            <Button type="primary" @click="search">{{$t('m.global.search')}}</Button>
        </section>

        <div class="table-container">
            <AnalyzerTable :type="'rank'" :url="url" :params="params" :columns="columns" :callback="callback"
                           :isRefresh="isRefresh" :isFlag="true"
                           @changeRefresh="(refresh)=>{this.isRefresh=refresh}"></AnalyzerTable>
        </div>
    </div>
</template>

<script>
    import AnalyzerController from 'src@/js/controllers/analyzer.controller';
    import Urls from 'src@/js/config/urls';

    const analyzerCtrl = new AnalyzerController('rank');
    analyzerCtrl.init();

    export default {
        mixins: [analyzerCtrl.data],
        data() {
            return {
                ruleList: {
                    hasScheduleFlight: true,
                    hasdepOnTimeFlight: true,
                    hasarrOnTimeFlight: true,
                    hasOntimeFlight: true,
                    hasFlightOTP: true,
                    hasTaxiout: true
                },
                url: Urls.analyzer.rank,
                params: {seeType: 1},
                callback: data => {
                    let result = [],
                        index = 0;
                    for (let key in data) {
                        index++;
                        let value = data[key];
                        value['id'] = index;
                        value['code'] = key;
                        result.push(value);
                    }
                    return result;
                }
            }
        },
        methods: {
            changeFilterSeeType(value) {
                this.params['seeType'] = value;
            }
        }
    }
</script>