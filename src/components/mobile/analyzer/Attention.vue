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

                    <x-input v-model="params.airport" :title="titles.forg"
                             novalidate :icon-type="iconTypes.airport" :show-clear="false"
                             @on-change="changeFilterAirport"></x-input>

                    <x-input v-model="params.flightNumber" :title="titles.flightNumber"
                             novalidate :icon-type="iconTypes.flightNumber" :show-clear="false"
                             @on-change="changeFilterFlightNumber"></x-input>

                    <x-input v-model="params.minNumber" :title="titles.minNumber"
                             novalidate :icon-type="iconTypes.minNumber" :show-clear="false"
                             @on-change="changeFilterMinNumber"></x-input>

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
                     :isRefresh="isRefresh" :isFlag="false" @changeRefresh="(refresh)=>{this.isRefresh=refresh}"
                     @changeScroll="(fixed)=>{this.$emit('changeScroll', fixed)}"></MobileTable>
    </div>
</template>

<script>
    import AnalyzerController from 'src@/js/controllers/analyzer.controller';
    import {isEarly} from 'src@/js/common/utils';
    import {DefaultStartAirport, DefaultMinNumberEarly, DefaultMinNumber} from 'src@/js/config/defaults';
    import Urls from 'src@/js/config/urls';
    import {ICAOCodeRegExp, FlightNORegExp, MinNumberRegExp} from 'src@/js/config/regulars';

    const analyzerCtrl = new AnalyzerController('attention', true);
    analyzerCtrl.init();

    export default {
        mixins: [analyzerCtrl.data],
        data() {
            return {
                url: Urls.analyzer.attention,
                params: {
                    airport: '',
                    flightNumber: '',
                    minNumber: isEarly() ? DefaultMinNumberEarly : DefaultMinNumber
                },
                iconTypes: {
                    airport: '',
                    flightNumber: '',
                    minNumber: ''
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
            changeFilterAirport() {
                this.params.airport = this.params.airport.toUpperCase();
                if (this.params.airport && !ICAOCodeRegExp.test(this.params.airport))
                    this.iconTypes.airport = 'error';
                else
                    this.iconTypes.airport = '';
            },
            search() {
                if (Date.parse(this.params.startDay) > Date.parse(this.params.endDay))
                    return this.$Message.error(this.$t('m.validate.dateSize'));

                if (this.params.airport && !ICAOCodeRegExp.test(this.params.airport))
                    return this.$Message.error(`${this.titles.forg}${this.$t('m.validate.illegal')}`);

                if (this.params.flightNumber && !FlightNORegExp.test(this.params.flightNumber))
                    return this.$Message.error(`${this.titles.flight}${this.$t('m.validate.illegal')}`);

                if (this.params.minNumber && !MinNumberRegExp.test(this.params.minNumber))
                    return this.$Message.error(this.$t('m.validate.mustNumeric'));

                this.isRefresh = true;
                this.isShow = false;
                this.$emit('changeFilter', false);
            }
        }
    }
</script>