<template>
    <div :class="['autocomplete', 'autocomplete-airport', {active: isActive}]">
        <!--IE浏览器下面解决文本框input事件触发focus事件，去除placeholder即可-->
        <span class="autocomplete-input-placeholder" v-show="isPlaceholder">{{placeholder}}</span>

        <input class="autocomplete-input" type="text" v-model="model" ref="input"
               @focus="focus" @input="input"
               @keyup.up="up" @keyup.down="down" @keyup.enter="enter">

        <div class="autocomplete-popular" v-show="isShowPopular">
            <h2>{{$t('m.label.popularAirport')}}</h2>
            <div>
                <span v-for="(item,index) in popularAirports" :key="index"
                      @click="select(item.value)">{{item.label}}</span>
            </div>
        </div>

        <div class="autocomplete-normal" v-show="isShowNormal && tempAirports.length > 0" ref="result">
            <ul class="autocomplete-normal-list">
                <li v-for="(item,index) in tempAirports" :key="index"
                    :class="{active:index===activeIndex}" @mouseover="activeIndex=index"
                    @click="select(item.value)">{{item.label}}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    //PS：IE浏览器focus事件会直接触发一次input事件BUG解决，文本框不添加placeholder提示时，focus事件即不会触发input事件
    import Events from 'src@/js/common/events';
    import AirportsList from 'src@/js/config/airportList';
    import PopularAirportList from 'src@/js/config/popularAirportList';

    export default {
        props: ['value', 'placeholder'],
        data() {
            return {
                model: null,
                airports: [],
                popularAirports: [],
                normalAirports: [],
                isActive: false,
                isPlaceholder: false,
                isShowPopular: false,
                isShowNormal: false,
                activeIndex: 0,
                //补充滚动处理
                tempAirports: [],
                isScroll: false,
                isFinish: false,
                index: 0,
                height: 0
            }
        },
        methods: {
            reset() {
                let self = this;
                self.normalAirports = [];
                self.tempAirports = [];
                self.isActive = false;
                self.isPlaceholder = !self.model;
                self.isShowPopular = false;
                self.isShowNormal = false;
                self.activeIndex = 0;
                //补充
                self.isScroll = false;
                self.isFinish = false;
                self.index = 0;
            },
            refreshHeight(isReset) {
                isReset = !!isReset;
                let self = this;
                self.$nextTick(() => {
                    if (isReset) {
                        self.$refs.result.scrollTop = 0;
                    }
                    self.height = document.querySelector('.autocomplete-normal-list').clientHeight;
                });
            },
            watchValue(value) {
                this.model = value;
            },
            setDefault() {
                let self = this;
                self.model = self.value;
                self.isPlaceholder = !self.model;
                self.airports = AirportsList;
                self.popularAirports = PopularAirportList.map(item => {
                    return {label: item.airportCode, value: item.airportCode};
                });
                self.normalAirports = [];
            },
            focus() {
                let self = this;
                self.isActive = true;
                self.isPlaceholder = false;
                self.isShowPopular = true;
                self.isShowNormal = false;
                self.bindEvents(false);
            },
            input() {
                let self = this;
                self.normalAirports = [];
                if (self.model) {
                    let locale = self.$i18n.locale,
                        value = self.model.toUpperCase();
                    self.airports.forEach(item => {
                        let code = (item.airportCode || '').toUpperCase(),
                            enName = (item.airportEnName || '').toUpperCase(),
                            cnNamePy = (item.airportPy || '').toUpperCase();
                        if (locale === 'zh-CN' &&
                            (
                                code.indexOf(value) > -1 ||
                                enName.indexOf(value) > -1
                            )
                        ) {
                            self.normalAirports.push({
                                label: item.airportName + ' (' + item.airportCode + ') ' + item.airportEnName,
                                value: item.airportCode
                            });
                        } else if (locale === 'en-US' &&
                            (
                                code.indexOf(value) > -1 ||
                                enName.indexOf(value) > -1 ||
                                cnNamePy.indexOf(value) > -1
                            )
                        ) {
                            self.normalAirports.push({
                                label: (item.airportEnName + ' (' + item.airportCode + ')'),
                                value: item.airportCode
                            });
                        }
                    });
                }
                self.isPlaceholder = false;
                self.isShowPopular = false;
                self.isShowNormal = self.normalAirports.length > 0;
                self.isScroll = false;
                self.isFinish = false;
                self.index = 11;
                self.tempAirports = self.normalAirports.slice(0, self.index);
                self.refreshHeight(true);
                self.$emit('on-change', self.model);
            },
            up() {
                if (this.isShowNormal && this.activeIndex > 0) {
                    this.activeIndex = this.activeIndex - 1;
                }
            },
            down() {
                if (this.isShowNormal && this.activeIndex < this.limitCount - 1) {
                    this.activeIndex = this.activeIndex + 1;
                }
            },
            enter() {
                let self = this;
                if (!self.isShowNormal) return;

                let item = self.tempAirports[self.activeIndex];
                self.select(item ? item.value : null);
            },
            select(code) {
                if (!code) return;

                let self = this;
                self.model = code;
                self.reset();
                self.$emit('on-select', self.model);
            },
            bindEvents(isInit) {
                isInit = !!isInit;
                if (isInit) {
                    this.scroll()();
                } else {
                    this.close();
                }
            },
            scroll() {
                let self = this,
                    timer = null;
                return function () {
                    let selector = document.querySelector('.autocomplete-normal');
                    Events.addEvent(selector, 'scroll', (event) => {
                        event.stopPropagation();
                        if (timer) {
                            clearTimeout(timer);
                        }
                        timer = setTimeout(function () {
                            if (self.isScroll || self.isFinish) return;

                            let scrollTop = (event.srcElement || event.target).scrollTop;
                            if (300 + scrollTop >= self.height) {
                                self.isScroll = true;
                                self.index += 10;
                                self.tempAirports = self.normalAirports.slice(0, self.index);
                                if (self.index >= self.normalAirports.length) {
                                    self.isFinish = true;
                                    self.index = 0;
                                    self.normalAirports = [];
                                }
                                self.isScroll = false;
                                self.refreshHeight(false);
                            }
                        }, 200);
                    }, false);
                };
            },
            close() {
                let self = this;
                Events.addEvent(document, 'click', (event) => {
                    let selector = document.querySelector('.autocomplete-airport.active');
                    if (selector) {
                        if (!selector.contains(event.target)) {
                            self.reset();
                        }
                    }
                });
            }
        },
        watch: {
            value(value) {
                // console.log('AirportAutoComplete watchValue:', value);
                this.watchValue(value);
            }
        },
        created() {
            this.setDefault();
        },
        mounted() {
            this.bindEvents(true);
        }
    }
</script>

<style lang="less" scoped>
    @import "../less/mixin";

    .absolute-placeholder {
        position: absolute;
        top: 0;
        bottom: 0;
        display: block;
        width: 100%;
    }

    .absolute-dropdown {
        position: absolute;
        top: 52px;
        display: block;
        background-color: white;
        box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, .2);
        overflow: auto;
    }

    .autocomplete.autocomplete-airport {
        position: relative;
        z-index: 1;
        width: 140px;
        .height50px;

        .autocomplete-input-placeholder {
            .absolute-placeholder;
            z-index: 2;
            .height50px;
            color: #666;
            text-align: center;
            border-radius: 3px;
        }

        .autocomplete-input {
            .absolute-placeholder;
            z-index: 3;
            .height50px;
            color: #333;
            text-align: center;
            border-radius: 3px;
            background-color: transparent;
            border: none;
            outline: none;
        }

        .autocomplete-popular {
            .absolute-dropdown;
            z-index: 1;
            padding: 20px;
            width: 480px;

            h2 {
                font-size: 14px;
                line-height: 26px;
                font-weight: bold;
            }

            div {
                span {
                    float: left;
                    padding: 3px 10px;
                    font-size: 14px;
                    line-height: 20px;
                    border-radius: 3px;
                    cursor: pointer;
                    transition: all .2s;

                    &:hover {
                        color: white;
                        background-color: #3d86e5;
                    }
                }
            }
        }

        .autocomplete-normal {
            .absolute-dropdown;
            z-index: 2;
            width: 344px;
            max-height: 300px;

            .custom-scrollbar();

            .autocomplete-normal-list {
                padding: 0;
                background-color: white;

                li {
                    position: relative;
                    display: block;
                    margin: 0;
                    padding: 0 5px;
                    height: 30px;
                    font-size: 12px;
                    line-height: 30px;
                    overflow: hidden;
                    cursor: pointer;

                    &.active {
                        color: white;
                        background-color: #1e90ff;
                    }
                }
            }
        }
    }
</style>