<template>
    <div>
        <div v-transfer-dom>
            <x-popup v-model="isShow" position="top" @on-hide="hidePopup">
                <Language></Language>

                <x-group>
                    <x-input v-model="params.airline" :title="titles.airline"
                             novalidate :icon-type="iconTypes.airline" :show-clear="false"
                             @on-change="changeFilterAirline"></x-input>

                    <x-input v-model="params.start" :title="titles.forg"
                             novalidate :icon-type="iconTypes.start" :show-clear="false"
                             @on-change="changeFilterStart"></x-input>

                    <x-input v-model="params.end" :title="titles.fdst"
                             novalidate :icon-type="iconTypes.end" :show-clear="false"
                             @on-change="changeFilterEnd"></x-input>

                    <x-input v-model="params.ftype" :title="titles.planAirplane"
                             novalidate :icon-type="iconTypes.ftype" :show-clear="false"
                             @on-change="changeFilterFtype"></x-input>

                    <x-selector v-model="params.planStartHour" direction="rtl" :title="titles.STD"
                                :options="hourList"></x-selector>

                    <x-selector v-model="params.planEndHour" direction="rtl" :title="titles.STA"
                                :options="hourList"></x-selector>

                    <x-selector v-model="params.cancelTime" direction="rtl" :title="titles.cancelTime"
                                :options="hourList"></x-selector>
                </x-group>

                <x-group class="inline-group">
                    <x-button type="default" @click.native="reset">{{titles.reset}}</x-button>
                </x-group>

                <x-group class="inline-group">
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
    import {AirlineCodeRegExp, ICAOCodeRegExp, AirplaneModelRegExp} from 'src@/js/config/regulars';

    const analyzerCtrl = new AnalyzerController('cancel', true, true);
    analyzerCtrl.init();

    export default {
        mixins: [analyzerCtrl.data],
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
                },
                hourList: (function () {
                    let result = [{key: '', value: 'All'}];
                    for (let i = 0; i < 24; i++) {
                        let item = i < 10 ? '0' + i : i;
                        result.push({key: item, value: item});
                    }
                    return result;
                })(),
                iconTypes: {
                    airline: '',
                    start: '',
                    end: '',
                    ftype: ''
                }
            }
        },
        methods: {
            changeFilterAirline() {
                this.params.airline = this.params.airline.toUpperCase();
                if (this.params.airline && !AirlineCodeRegExp.test(this.params.airline))
                    this.iconTypes.airline = 'error';
                else
                    this.iconTypes.airline = '';
            },
            changeFilterStart() {
                this.params.start = this.params.start.toUpperCase();
                if (this.params.start && !ICAOCodeRegExp.test(this.params.start))
                    this.iconTypes.start = 'error';
                else
                    this.iconTypes.start = '';
            },
            changeFilterEnd() {
                this.params.end = this.params.end.toUpperCase();
                if (this.params.end && !ICAOCodeRegExp.test(this.params.end))
                    this.iconTypes.end = 'error';
                else
                    this.iconTypes.end = '';
            },
            changeFilterFtype() {
                if (this.params.ftype && !AirplaneModelRegExp.test(this.params.ftype))
                    this.iconTypes.ftype = 'error';
                else
                    this.iconTypes.ftype = '';
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
                this.isShow = false;
                this.$emit('changeFilter', false);
            }
        }
    }
</script>

<style lang="less" scoped>
    .inline-group /deep/ .weui-cells {
        text-align: center;
    }
</style>