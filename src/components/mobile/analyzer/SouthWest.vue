<template>
    <div>
        <div v-transfer-dom>
            <x-popup v-model="isShow" position="top" @on-hide="hidePopup">
                <Language></Language>

                <x-group>
                    <x-calendar v-model="params.startDay" :title="titles.startDate"
                                :show-popup-header="true"></x-calendar>

                    <x-calendar v-model="params.endDay" :title="titles.endDate"
                                :show-popup-header="true"></x-calendar>

                    <x-selector v-model="params.cancel" direction="rtl" :title="titles.cancel"
                                :options="cancels"></x-selector>
                </x-group>

                <x-group>
                    <x-button type="primary" @click.native="search">{{titles.search}}</x-button>
                </x-group>

                <Logout></Logout>
            </x-popup>
        </div>

        <MobileTable :type="'notice'" :url="url" :params="params" :columns="columns" :callback="callback"
                     :isRefresh="isRefresh" @changeRefresh="(refresh)=>{this.isRefresh=refresh}" :isFlag="true"
                     @changeScroll="(fixed)=>{this.$emit('changeScroll', fixed)}"></MobileTable>
    </div>
</template>

<script>
    import AnalyzerController from 'src@/js/controllers/analyzer.controller';
    import Urls from 'src@/js/config/urls';

    const analyzerCtrl = new AnalyzerController('southWest', true);
    analyzerCtrl.init();

    export default {
        mixins: [analyzerCtrl.data],
        data() {
            return {
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