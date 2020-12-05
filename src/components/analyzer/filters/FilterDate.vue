<template>
    <div class="filter-item">
        <label>{{title}}</label>
        <DatePicker v-model="date" format="dd/MM/yyyy" type="daterange" :options="options" :editable="false"
                    :clearable="false"
                    @on-change="change"></DatePicker>
    </div>
</template>

<script>
    export default {
        props: ['title', 'data'],
        data() {
            return {
                date: this.data,
                options: {
                    disabledDate(date) {
                        let highEdge = Date.now(),
                            lowEdge = new Date('2016-12-31').getTime();
                        return date && (date.valueOf() > highEdge || date.valueOf() < lowEdge);
                    }
                }
            };
        },
        methods: {
            change() {
                this.$emit('changeFilterDate', this.date)
            }
        }
    }
</script>

<style lang="less" scoped>
    /deep/ .ivu-date-picker {
        min-width: 180px;
    }
</style>