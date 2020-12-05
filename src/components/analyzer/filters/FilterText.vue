<template>
    <div class="filter-item">
        <label>{{title}}</label>
        <Input v-model="value" :class="{'error-input': isError}" :placeholder="title" @on-change="change"/>
    </div>
</template>

<script>
    import {FlightNORegExp, ICAOCodeRegExp, AirlineCodeRegExp, AirplaneModelRegExp} from 'src@/js/config/regulars'

    export default {
        props: ['title', 'data', 'isUpperCase', 'isRequired', 'isICAOCode', 'isFlightNO', 'isAirlineCode', 'isAirplaneModel'],
        data() {
            return {
                isError: false,
                value: this.data
            }
        },
        methods: {
            change() {
                this.isError = false

                if (this.isUpperCase) {
                    this.value = this.value.toUpperCase()
                }
                if (this.isRequired) {
                    this.isError = !this.value
                }
                if (this.isICAOCode && this.value) {
                    this.isError = !ICAOCodeRegExp.test(this.value)
                }
                if (this.isFlightNO && this.value) {
                    this.isError = !FlightNORegExp.test(this.value)
                }
                if (this.isAirlineCode && this.value) {
                    this.isError = !AirlineCodeRegExp.test(this.value)
                }
                if (this.isAirplaneModel && this.value) {
                    this.isError = !AirplaneModelRegExp.test(this.value)
                }
                return this.$emit('changeFilterText', {value: this.value})
            }
        }
    }
</script>

<style scoped>
    /deep/ .ivu-input-wrapper {
        width: 110px;
    }

    @media screen and (max-width: 1200px) {
        /deep/ .ivu-input-wrapper {
            width: 80px;
        }
    }
</style>