<template>
    <div class="fisc-container">
        <ul class="search-types">
            <li :class="{active: searchType === item.value}" v-for="(item, index) in searchTypeList"
                :key="index" @click="changeSearchType(index)">{{$t('m.label.' + item.key)}}
            </li>
        </ul>

        <div class="search-value">
            <div class="search-fnum" v-if="searchType === 'fnum'">
                <input class="search-input" type="text" v-model="fnumInputValue"
                       :placeholder="$t('m.placeholder.flightNO')" @keyup.enter="search">
            </div>
            <div class="search-airport" v-if="searchType === 'airport'">
                <AirportAutoComplete :placeholder="$t('m.placeholder.airportStart')" :value="airportInputValue1"
                                     @on-change="changeAirportInputValue1" @on-select="changeAirportInputValue1"/>
                <i class="airport-swap" @click="swapAirport"></i>
                <AirportAutoComplete :placeholder="$t('m.placeholder.airportEnd')" :value="airportInputValue2"
                                     @on-change="changeAirportInputValue2" @on-select="changeAirportInputValue2"/>
            </div>
            <div class="search-airline" v-if="searchType === 'airline'">
                <input class="search-input" type="text" v-model="airlineInputValue"
                       :placeholder="$t('m.placeholder.airline')" @keyup.enter="search">
            </div>
        </div>

        <div class="search-date">
            <label class="search-date-label">{{$t('m.label.departDate')}}</label>
            <DatePicker :value="searchDate" :options="options" :placeholder="$t('m.placeholder.date')"
                        @on-change="changeSearchDate" format="dd/MM/yyyy" type="date"></DatePicker>
        </div>

        <a class="search-btn" @click="search">{{$t('m.global.search')}}</a>
    </div>
</template>

<script>
    import {dateFormate} from 'src@/js/common/utils';
    import AirportAutoComplete from 'src@/components/AirportAutoComplete.vue';

    export default {
        components: {AirportAutoComplete},
        props: ['data'],
        data() {
            return {
                isSwap: false,
                searchTypeList: [
                    {
                        key: 'flightNO',
                        value: 'fnum',
                        active: true
                    },
                    {
                        key: 'airport',
                        value: 'airport',
                        active: false
                    },
                    {
                        key: 'airline',
                        value: 'airline',
                        active: false
                    }
                ],
                searchType: this.data && this.data.type ? this.data.type : 'fnum',
                fnumInputValue: this.data && this.data.type === 'fnum' ? this.data.searchValue : '',
                airportInputValue1: this.data && this.data.type === 'airport' ? this.data.searchValue.split(',')[0] : '',
                airportInputValue2: this.data && this.data.type === 'airport' ? this.data.searchValue.split(',')[1] : '',
                airlineInputValue: this.data && this.data.type === 'airline' ? this.data.searchValue : '',
                searchDate: this.data && this.data.searchDate ? this.data.searchDate : dateFormate(new Date(), 'dd/MM/yyyy'),
                options: {
                    disabledDate(date) {
                        return date && (date.valueOf() < Date.now() - 2592000000 || date.valueOf() > Date.now() + 259200000);
                    }
                }
            }
        },
        computed: {
            searchValue() {
                let self = this,
                    result = null;
                switch (self.searchType) {
                    case 'fnum':
                        result = self.fnumInputValue;
                        break;
                    case 'airport':
                        result = self.airportInputValue1 + ',' + self.airportInputValue2;
                        break;
                    case 'airline':
                        result = self.airlineInputValue;
                        break;
                }
                return result;
            }
        },
        methods: {
            changeSearchType(index) {
                let self = this;
                self.fnumInputValue = '';
                self.airportInputValue1 = '';
                self.airportInputValue2 = '';
                self.airlineInputValue = '';

                self.searchTypeList.forEach((sitem, sindex) => sitem.active = (sindex === index));
                self.searchType = self.searchTypeList[index].value;
            },
            changeSearchDate(value) {
                this.searchDate = value;
            },
            swapAirport() {
                this.isSwap = !this.isSwap;
                let temp = this.airportInputValue1;
                this.airportInputValue1 = this.airportInputValue2;
                this.airportInputValue2 = temp;
            },
            changeAirportInputValue1(value) {
                this.airportInputValue1 = value;
            },
            changeAirportInputValue2(value) {
                this.airportInputValue2 = value;
            },
            search() {
                let self = this;
                //判断日期是否为空
                if (!self.searchDate) {
                    self.$Message.error(self.$t('m.validate.dateRequired'));
                    return;
                }

                //判断日期格式是否是1970年和正规的日期格式 xx/xx/xxxx
                if (self.searchDate === '01/01/1970' || !self.searchDate.match(/^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/)) {
                    self.$Message.error(self.$t('m.validate.dateIllegal'));
                    return;
                }

                //判断航班号是否为空以及是否合法
                if (self.searchType === 'fnum') {
                    if (!self.fnumInputValue) {
                        self.$Message.error(self.$t('m.validate.flightRequired'));
                        return;
                    } else {
                        if (!self.fnumInputValue.match(/^[a-zA-Z0-9]+$/)) {
                            self.$Message.error(self.$t('m.validate.flightIllegal'));
                            return;
                        }
                    }
                }

                //判断航司是否为空以及是否合法
                if (self.searchType === 'airline') {
                    if (self.airlineInputValue === '') {
                        self.$Message.error(self.$t('m.validate.airlineRequired'));
                        return;
                    } else {
                        if (!self.airlineInputValue.match(/^[0-9a-zA-Z]{2,3}$/)) {
                            self.$Message.error(self.$t('m.validate.airlineIllegal'));
                            return;
                        }
                    }
                }

                //判断机场是否为空以及是否合法
                if (self.searchType === 'airport') {
                    if (!self.airportInputValue1 || !self.airportInputValue2) {
                        self.$Message.error(self.$t('m.validate.airportRequired'));
                        return;
                    } else {
                        if (!self.airportInputValue1.match(/^[a-zA-Z]{3}$/) || !self.airportInputValue2.match(/^[a-zA-Z]{3}$/)) {
                            self.$Message.error(self.$t('m.validate.airportIllegal'));
                            return;
                        }
                    }
                }

                //输入执行跳转
                let routeName = 'flightData';
                if (self.$i18n.locale === 'zh-CN') {
                    routeName = 'cnFlightData';
                }
                self.$router.push({
                    name: routeName,
                    params: {
                        type: self.searchType,
                        value: self.searchValue,
                        date: self.searchDate,
                        page: 1
                    }
                });
            }
        }
    }
</script>

<style lang="less" scoped>
    @import "../less/search.less";
</style>