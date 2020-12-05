<template>
    <div class="filter-item">
        <label>{{title}}</label>
        <Select v-model="airport" @on-change="change">
            <Option v-for="(item, index) in airportList" :key="index" :value="item.value">{{item.key}}</Option>
        </Select>
    </div>
</template>

<script>
    import getAnalyzerAirportList from 'src@/js/config/analyzerAirportList'

    export default {
        props: ['title', 'data', 'isEast'],
        data() {
            return {
                airport: this.data || '',
                airportList: getAnalyzerAirportList(this.isEast)
            }
        },
        methods: {
            change() {
                this.$emit('changeFilterAirport', this.airport);
            }
        }
    }
</script>

<style lang="less" scoped>
    /deep/ .ivu-select.ivu-select-single {
        width: 100px;
    }
</style>