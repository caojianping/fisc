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

                    <x-selector v-model="params.airport" direction="rtl" :title="titles.airport"
                                :options="airportList"></x-selector>

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

        <MobileTable :type="'notice'" :url="url" :params="params" :columns="columns" :isRefresh="isRefresh"
                     @changeRefresh="(refresh)=>{this.isRefresh=refresh}" :isFlag="true"
                     @changeScroll="(fixed)=>{this.$emit('changeScroll', fixed)}"></MobileTable>
    </div>
</template>

<script>
    import AnalyzerController from 'src@/js/controllers/analyzer.controller';
    import {isEarly} from 'src@/js/common/utils';
    import {DefaultEastStartAirport, DefaultMinNumberEarly, DefaultMinNumber} from 'src@/js/config/defaults';
    import Urls from 'src@/js/config/urls';
    import {FlightNORegExp, MinNumberRegExp} from 'src@/js/config/regulars';

    const analyzerCtrl = new AnalyzerController('east', true);
    analyzerCtrl.init();

    export default {
        mixins: [analyzerCtrl.data],
        data() {
            return {
                url: Urls.analyzer.east,
                params: {
                    airport: DefaultEastStartAirport,
                    flightNumber: '',
                    minNumber: isEarly() ? DefaultMinNumberEarly : DefaultMinNumber
                }
            }
        },
        methods: {
            search() {
                if (Date.parse(this.params.startDay) > Date.parse(this.params.endDay))
                    return this.$Message.error(this.$t('m.validate.dateSize'));

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