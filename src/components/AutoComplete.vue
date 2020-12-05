<template>
    <div class="autocomplete" :style="{'width':this.width}">
        <div class="autocomplete-main">
            <div class="autocomplete-value">
                <input class="autocomplete-input" type="text" v-model="model" :placeholder="placeholder"
                       @focus="focus" @input="input">
                <i class="autocomplete-clear" @click.stop="clear">&times;</i>
            </div>

            <div class="autocomplete-result" v-show="isSearch && tempList.length > 0" ref="result">
                <ul class="autocomplete-result-list">
                    <li v-for="(item,index) in tempList" :key="index" :data-value="item.value"
                        @click="select(item)" v-html="item.label"></li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import Events from 'src@/js/common/events';

    export default {
        props: ['value', 'data', 'placeholder', 'width'],
        data() {
            return {
                model: this.value,
                sourceList: [],
                tempList: [],
                isSelect: false,
                isSearch: false,
                isScroll: false,
                isFinish: false,
                index: 0,
                height: 0
            };
        },
        methods: {
            reset() {
                let self = this;
                self.sourceList = [];
                self.tempList = [];
                self.isSelect = false;
                self.isSearch = false;
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
                    self.height = document.querySelector('.autocomplete-result-list').clientHeight;
                });
            },
            watchValue(value) {
                this.model = value;
            },
            watchData(value) {
                let self = this;
                self.isScroll = false;
                self.isFinish = false;
                self.index = 11;
                self.sourceList = (value || []).slice(0);
                self.tempList = self.sourceList.slice(0, self.index);
                self.refreshHeight(true);
            },
            focus() {
                let self = this;
                self.isSelect = true;
                self.isSearch = true;
                // console.log('AutoComplete focus:', self.model);
                self.$emit('on-change', self.model);
            },
            input() {
                let self = this;
                if (!self.isSelect) return;
                // console.log('AutoComplete input:', self.model);
                self.$emit(!self.model ? 'on-select' : 'on-change', self.model);
            },
            clear() {
                let self = this;
                self.reset();
                self.model = '';
                self.$emit('on-select', self.model);
            },
            select(data) {
                let self = this;
                self.reset();
                self.model = data.value;
                // console.log('AutoComplete select:', data.value);
                self.$emit('on-select', data.value);
            },
            enter() {
                let self = this,
                    value = self.model;
                if (value) {
                    let first = self.sourceList.filter(item => (item.label || '').toUpperCase() === value.toUpperCase())[0];
                    if (first) {
                        value = first.value;
                    }
                }
                // console.log('AutoComplete enter:', value);
                self.$emit('on-select', value);
            },
            bindEvents() {
                let self = this;
                self.scrollResult()();
                self.closeResult();
            },
            scrollResult() {
                let self = this,
                    timer = null;
                return function () {
                    let selector = document.querySelector('.autocomplete-result');
                    Events.addEvent(selector, 'scroll', (event) => {
                        event.stopPropagation();
                        if (timer) {
                            clearTimeout(timer);
                        }
                        timer = setTimeout(function () {
                            if (self.isScroll || self.isFinish) return;

                            let scrollTop = (event.srcElement || event.target).scrollTop;
                            // console.log('scrollResult scrollTop、height:', scrollTop, self.height);
                            if (370 + scrollTop >= self.height) {
                                self.isScroll = true;
                                self.index += 10;
                                self.tempList = self.sourceList.slice(0, self.index);
                                if (self.index >= self.sourceList.length) {
                                    self.isFinish = true;
                                    self.index = 0;
                                    self.sourceList = [];
                                }
                                self.isScroll = false;
                                self.refreshHeight(false);
                            }
                        }, 200);
                    }, false);
                };
            },
            closeResult() {
                let self = this;
                Events.addEvent(document, 'click', (event) => {
                    let selector = document.querySelector('.autocomplete');
                    if (selector) {
                        if (!selector.contains(event.target)) {
                            self.reset();
                        }
                    }
                }, false);
            }
        },
        watch: {
            value(value) {
                // console.log('AutoComplete watchValue:', value);
                this.watchValue(value);
            },
            data(value) {
                // console.log('AutoComplete watchData:', value.length);
                this.watchData(value);
            }
        },
        created() {
            this.watchData(this.data);
        },
        mounted() {
            this.bindEvents();
        }
    };
</script>

<style lang="less" scoped>
    @import "../less/mixin";

    .autocomplete {
        display: inline-block;
        min-width: 220px;
        border-radius: 2px;
        box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);

        .autocomplete-main {
            position: relative;
            width: 100%;
            height: 40px;

            .autocomplete-value {
                display: flex;
                justify-content: space-between;
                width: 100%;
                height: 40px;
                overflow: hidden;

                .autocomplete-input {
                    margin: 0;
                    padding: 0;
                    width: 100%;
                    height: 40px;
                    font-size: 15px;
                    line-height: 40px;
                    color: #333;
                    text-indent: 10px;
                    background-color: white;
                    border: none;
                    border-radius: 4px;
                    outline: none;
                }

                .autocomplete-enter {
                    position: absolute;
                    top: 0;
                    right: 0;
                    display: inline-block;
                    width: 30px;
                    height: 40px;
                    line-height: 40px;
                    cursor: pointer;

                    &:before,
                    &:after {
                        position: absolute;
                        display: block;
                        content: " ";
                    }

                    &:before {
                        top: 10px;
                        left: 2px;
                        width: 18px;
                        height: 18px;
                        border: 2px solid #666;
                        border-radius: 100%;
                        background-color: white;
                    }

                    &:after {
                        top: 24px;
                        right: 9px;
                        width: 2px;
                        height: 8px;
                        background-color: #666;
                        transform: rotate(-45deg);
                    }
                }

                .autocomplete-clear {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    z-index: 1;
                    display: inline-block;
                    content: "";
                    width: 20px;
                    height: 20px;
                    font-size: 15px;
                    line-height: 20px;
                    color: white;
                    text-align: center;
                    background-color: rgba(0, 0, 0, .4);
                    border-radius: 100%;
                    cursor: pointer;
                }
            }

            .autocomplete-result {
                position: absolute;
                top: 43px;
                right: 0;
                left: 0;
                z-index: 2;
                display: block;
                padding: 5px 0;
                max-height: 370px;
                overflow: auto;
                background-color: white;
                box-shadow: 0 1px 5px rgba(0, 0, 0, .2);
                border-radius: 4px;

                .autocomplete-result-list {
                    list-style: none;

                    li {
                        margin: 0;
                        padding: 0 15px;
                        width: 100%;
                        height: 35px;
                        font-size: 14px;
                        line-height: 35px;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        cursor: pointer;

                        &:hover {
                            color: white;
                            background-color: rgba(40, 123, 211, .8);
                        }
                    }
                }
            }

            .custom-scrollbar();
        }
    }
</style>