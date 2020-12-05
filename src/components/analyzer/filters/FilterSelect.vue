<template>
    <div class="filter-item">
        <label>{{title}}</label>
        <Select v-model="value" @on-change="change">
            <Option v-for="(item, index) in list" :key="index" :value="item.key">{{item.value}}</Option>
        </Select>
    </div>
</template>

<script>
    export default {
        props: ['title', 'data', 'list'],
        data() {
            return {
                value: this.data || 1
            }
        },
        methods: {
            change() {
                this.$emit('changeFilterSelect', this.value)
            }
        }
    }
</script>

<style lang="less" scoped>
    /deep/ .ivu-select {
        width: auto;
        min-width: 100px;
    }
</style>