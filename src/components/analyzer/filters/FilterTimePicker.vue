<template>
    <div class="filter-item">
        <label>{{title}}</label>
        <TimePicker v-model="value" format="HH" :editable="false" :steps="[1, 60, 60]" @on-change="change"></TimePicker>
    </div>
</template>

<script>
    import {TimePicker} from 'iview'

    export default {
        components: {TimePicker},
        props: ['title', 'data'],
        data() {
            return {
                value: this.data
            }
        },
        methods: {
            change() {
                this.$emit('changeFilterTime', this.value)
            }
        }
    }
</script>

<style lang="less" scoped>
    /deep/ .ivu-date-picker {
        width: 80px;
    }
</style>