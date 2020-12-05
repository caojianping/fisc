<template>
    <div>
        <section v-if="!isFixed" class="position">
            <span :class="{cover: index + 1 >= leftPosition && index + 1 <= rightPosition}"
                  v-for="(column, index) in columns" :key="index"></span>
        </section>

        <section class="table-container" id="container" :style="{minHeight: minHeight + 'px'}">
            <table :class="['fisc-table', 'mobile', type ? 'fisc-table-' + type: '']">
                <thead>
                <tr>
                    <th v-for="(column, index) in columns" :key="index" ref="columns">{{column.title}}</th>
                </tr>
                </thead>
                <tbody v-if="!isLoading">
                <tr v-if="tempList.length !== 0" v-for="(item, index) in tempList" :key="index"
                    :class="{red: setFlag(item)}">
                    <td v-for="(column, cindex) in columns" :key="cindex"
                        :class="column.style || ''"
                        v-html="column.template(column.key ? item[column.key]: item)"></td>
                </tr>
                <tr v-if="tempList.length === 0">
                    <td class="colspan" :colspan="columns.length">no data</td>
                </tr>
                </tbody>
            </table>
        </section>

        <div v-transfer-dom>
            <loading :show="isLoading"></loading>
        </div>

        <a v-if="isTop" class="top" href="#t"></a>
    </div>
</template>

<script>
    import qs from 'qs';
    import CONSTANTS from 'src@/js/config/constants';
    import {AxiosType} from 'src@/js/config/enums';
    import UserToken from 'src@/js/helpers/userToken';
    import {Loading} from 'vux';

    export default {
        components: {Loading},
        props: ['type', 'url', 'params', 'columns', 'callback', 'isRefresh', 'isFlag'],
        data() {
            return {
                airlineCode: null,
                isFixed: false,
                isTop: false,
                isScroll: false,
                isFinish: false,
                isLoading: false,
                //X轴位置
                leftPosition: null,
                rightPosition: null,
                docWidth: null,
                docHeight: null,
                minHeight: null,
                scrollLeft: null,
                //数据列表
                currentIndex: 20,
                dataList: [],
                tempList: [],
                beforeTop: 0
            }
        },
        methods: {
            setDefault() {
                let userInfo = UserToken.getUserInfo();
                if (userInfo) {
                    this.airlineCode = userInfo.airlineCode;
                }

                this.currentPosition = 0;
                this.docWidth = document.documentElement.clientWidth || document.body.clientWidth;
                this.docHeight = 0;
                this.minHeight = (document.documentElement.clientHeight || document.body.clientHeight) - CONSTANTS.HEADER_HEIGHT;
                this.scrollLeft = 0;
            },
            setFlag(item) {
                if (!this.isFlag) return false;
                else return (item.hasOwnProperty('code') && item.code === this.airlineCode) ||
                    (item.hasOwnProperty('fnum') && item.fnum.indexOf(this.airlineCode) > -1);
            },
            setPosition() {
                let that = this,
                    start = that.scrollLeft,
                    end = that.docWidth + that.scrollLeft;
                that.$refs.columns.forEach((item, index) => {
                    let left = item.offsetLeft,
                        right = item.offsetLeft + item.clientWidth;
                    if (start > left && start <= right) {
                        that.leftPosition = index + 1;
                    }
                    if (end > left && end <= right) {
                        that.rightPosition = index + 1;
                    }
                })
            },
            scrollX() {
                let that = this,
                    container = document.getElementById('container');
                container.addEventListener('scroll', () => {
                    that.scrollLeft = container.scrollLeft;
                    that.setPosition();
                });
            },
            scrollY() {
                let that = this;
                window.addEventListener('scroll', () => {
                    let scrollTop = document.documentElement.scrollTop || document.body.scrollTop,
                        winHeight = window.innerHeight;

                    //悬浮表格标题
                    let thead = document.querySelector('#container>table>thead');
                    if (!that.isFixed && scrollTop >= CONSTANTS.HEADER_HEIGHT) {
                        that.isFixed = true;
                        this.$emit('changeScroll', true);
                    } else if (that.isFixed && scrollTop < CONSTANTS.HEADER_HEIGHT) {
                        that.isFixed = false;
                        this.$emit('changeScroll', false);
                    } else {
                        if (thead) {
                            thead.style.transform = 'translateY(' + scrollTop + 'px)';
                        }
                    }

                    //切换置顶按钮
                    if (scrollTop >= winHeight) that.isTop = true;
                    else that.isTop = false;

                    //加载更多数据
                    if (that.isScroll || that.isFinish) return;
                    if (winHeight + scrollTop + CONSTANTS.HEADER_HEIGHT >= that.docHeight) {
                        that.isScroll = true;
                        that.currentIndex += 20;
                        that.tempList = that.dataList.slice(0, that.currentIndex);
                        if (that.currentIndex >= that.dataList.length) {
                            that.isFinish = true;
                        }
                        that.isScroll = false;
                    }
                });
            },
            resize() {
                let that = this,
                    timer = null;
                return function () {
                    window.onresize = () => {
                        if (timer) {
                            clearTimeout(timer)
                        }
                        timer = setTimeout(function () {
                            that.docWidth = document.documentElement.clientWidth || document.body.clientWidth;
                            that.docHeight = CONSTANTS.HEADER_HEIGHT + document.getElementById('container').clientHeight;
                            that.minHeight = (document.documentElement.clientHeight || document.body.clientHeight) - CONSTANTS.HEADER_HEIGHT;
                            that.setPosition();
                        }, 100);
                    }
                };
            },
            bindEvents() {
                let that = this;
                that.scrollX();
                that.scrollY();
                that.resize()();
            },
            getData() {
                let that = this;
                that.$caxios({
                    url: that.url,
                    method: 'post',
                    data: qs.stringify(that.params)
                }, AxiosType.TokenLoading)
                    .then(data => {
                        if (that.callback) {
                            data = that.callback(data);
                        }
                        that.dataList = data;
                        that.tempList = data.slice(0, that.currentIndex);
                    })
                    .catch(err => that.dataList = []);
            }
        },
        watch: {
            isRefresh(nvalue, ovalue) {
                if (nvalue && !ovalue) {
                    this.getData();
                    this.$emit('changeRefresh', false);
                }
            },
            tempList() {
                this.$nextTick(() => {
                    this.docHeight = CONSTANTS.HEADER_HEIGHT + document.getElementById('container').clientHeight;
                });
            }
        },
        created() {
            this.setDefault();
            this.getData();
        },
        updated() {
            this.setPosition();
        },
        mounted() {
            this.bindEvents();
        }
    }
</script>

<style lang="less" scoped>
    .position {
        height: 25px;
        line-height: 25px;
        text-align: center;

        span {
            display: inline-block;
            margin: 0 10px;
            width: 6px;
            height: 6px;
            background-color: #c1c9d6;
            border-radius: 100%;
            transition: background-color .5s;

            &.cover {
                background-color: #6196f4;
            }
        }
    }

    .table-container {
        display: block;
        width: 100%;
        overflow: auto;
    }
</style>