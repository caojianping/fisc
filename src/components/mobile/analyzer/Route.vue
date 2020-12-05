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

                    <x-input v-model="params.flightNumber" :title="titles.flightNumber"
                             novalidate :icon-type="iconTypes.flightNumber" :show-clear="false"
                             @on-change="changeFilterFlightNumber"></x-input>

                    <x-input v-model="params.startAirport" :title="titles.forg"
                             novalidate :icon-type="iconTypes.startAirport" :show-clear="false"
                             @on-change="changeFilterStartAirport"></x-input>

                    <x-input v-model="params.reachAirport" :title="titles.fdst"
                             novalidate :icon-type="iconTypes.reachAirport" :show-clear="false"
                             @on-change="changeFilterReachAirport"></x-input>

                    <x-selector v-model="params.cancel" direction="rtl" :title="titles.cancel"
                                :options="cancels"></x-selector>
                </x-group>

                <x-group>
                    <x-button type="primary" @click.native="search">{{titles.search}}</x-button>
                </x-group>

                <Logout></Logout>
            </x-popup>
        </div>

        <MobileTable :url="url" :params="params" :columns="columns" :isRefresh="isRefresh"
                     @changeRefresh="(refresh)=>{this.isRefresh=refresh}" :isFlag="true"
                     @changeScroll="(fixed)=>{this.$emit('changeScroll', fixed)}"></MobileTable>
    </div>
</template>

<script>
    import AnalyzerController from 'src@/js/controllers/analyzer.controller';
    import Urls from 'src@/js/config/urls';
    import {DefaultStartAirport, DefaultEndAirport} from 'src@/js/config/defaults';
    import {FlightNORegExp, ICAOCodeRegExp} from 'src@/js/config/regulars';

    const analyzerCtrl = new AnalyzerController('route', true);
    analyzerCtrl.init();

    export default {
        mixins: [analyzerCtrl.data],
        data() {
            return {
                url: Urls.analyzer.route,
                params: {
                    flightNumber: '',
                    startAirport: DefaultStartAirport,
                    reachAirport: DefaultEndAirport
                },
                iconTypes: {
                    flightNumber: '',
                    startAirport: '',
                    reachAirport: ''
                }
            }
        },
        methods: {
            changeFilterStartAirport() {
                this.params.startAirport = this.params.startAirport.toUpperCase();
                if (this.params.startAirport && !ICAOCodeRegExp.test(this.params.startAirport))
                    this.iconTypes.startAirport = 'error';
                else
                    this.iconTypes.startAirport = '';
            },
            changeFilterReachAirport() {
                this.params.reachAirport = this.params.reachAirport.toUpperCase();
                if (this.params.reachAirport && !ICAOCodeRegExp.test(this.params.reachAirport))
                    this.iconTypes.reachAirport = 'error';
                else
                    this.iconTypes.reachAirport = '';
            },
            search() {
                if (Date.parse(this.params.startDay) > Date.parse(this.params.endDay))
                    return this.$Message.error(this.$t('m.validate.dateSize'));

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
                this.isShow = false;
                this.$emit('changeFilter', false);
            }
        }
    }
</script>