<template>
    <div>
        <h3 v-if="hasStat">{{$t('m.analyzer.cancelTotalText')}}: {{totalCount}}</h3>

        <table :class="['fisc-table', type ? 'fisc-table-' + type: '']">
            <thead>
            <tr>
                <th v-for="item in columns" :key="item.title">{{item.title}}</th>
            </tr>
            </thead>
            <tbody v-if="!isLoading">
            <tr v-if="dataList.length !== 0" v-for="(item, index) in dataList" :key="index"
                :class="{red: setFlag(item)}">
                <td v-for="(column, cindex) in columns" :key="cindex"
                    v-html="column.template(column.key ? item[column.key]: item)"></td>
            </tr>
            <tr v-if="dataList.length === 0">
                <td class="colspan" :colspan="columns.length">no data</td>
            </tr>
            </tbody>
            <tbody v-if="isLoading">
            <tr>
                <td class="colspan" :colspan="columns.length">
                    <Loading></Loading>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import qs from 'qs';
    import {parseJSON} from 'src@/js/common/utils';
    import {AxiosType} from 'src@/js/config/enums';
    import UserToken from 'src@/js/helpers/userToken';
    import Loading from 'src@/components/Loading.vue';

    export default {
        components: {Loading},
        props: ['type', 'hasStat', 'url', 'params', 'columns', 'callback', 'isRefresh', 'isFlag'],
        data() {
            return {
                airlineCode: null,
                isLoading: false,
                dataList: null,
                totalCount: 0
            }
        },
        methods: {
            setDefault() {
                let userInfo = UserToken.getUserInfo();
                if (userInfo) {
                    this.airlineCode = userInfo.airlineCode;
                }
                this.dataList = [];
            },
            setFlag(item) {
                if (!this.isFlag) return false;
                else return (item.hasOwnProperty('code') && item.code === this.airlineCode) ||
                    (item.hasOwnProperty('fnum') && item.fnum.indexOf(this.airlineCode) > -1);
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
                        that.totalCount = data.length;
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
            }
        },
        created() {
            this.setDefault();
            this.getData();
        }
    }
</script>

<style lang="less" scoped>
    h3 {
        font-size: 14px;
        color: #666;
        padding: 0 0 15px 0;
    }
</style>
