<template>
    <div class="filter-item">
        <label>{{title}}</label>
        <Input v-model="value" :class="{'error-input': isError}" @on-change="change"/>
    </div>
</template>

<script>
    import {MinNumberRegExp} from 'src@/js/config/regulars'

    export default {
        props: ['title', 'data'],
        data() {
            return {
                isError: false,
                value: this.data || 4
            }
        },
        methods: {
            change() {
                this.isError = !MinNumberRegExp.test(this.value)
                this.$emit('changeFilterNumber', {value: this.value})
            }
        }
    }
</script>

<style scoped>
    /deep/ .ivu-input-wrapper {
        width: 40px;
    }
</style>