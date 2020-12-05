<template>
    <div>
        <CalculateRules :rule-list="ruleList"></CalculateRules>

        <section class="filter-list">
            <FilterDate :title="titles.date" :data="filterDate"
                        @changeFilterDate="changeFilterDate"></FilterDate>

            <FilterSelect :title="titles.cancel" :data="params.cancel" :list="cancels"
                          @changeFilterSelect="changeFilterCancel"></FilterSelect>

            <Button type="primary" @click="search">{{$t('m.global.search')}}</Button>
        </section>

        <div class="table-container">
            <AnalyzerTable :type="'notice'" :url="url" :params="params" :columns="columns" :callback="callback"
                           :isFlag="true"
                           :isRefresh="isRefresh" @changeRefresh="(refresh)=>{this.isRefresh=refresh}"></AnalyzerTable>
        </div>
    </div>
</template>

<script>
    import AnalyzerController from 'src@/js/controllers/analyzer.controller';
    import {convertPercent} from 'src@/js/common/utils';
    import Urls from 'src@/js/config/urls';

    const analyzerCtrl = new AnalyzerController('southWest');
    analyzerCtrl.init();

    export default {
        mixins: [analyzerCtrl.data],
        data() {
            return {
                ruleList: {
                    hasSouthWestScheduleFlight: true,
                    hasSouthWestNormalFlight: true,
                    hasSouthWestFlightOTP: true
                },
                url: Urls.analyzer.southWest,
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
        }
    }
</script>
