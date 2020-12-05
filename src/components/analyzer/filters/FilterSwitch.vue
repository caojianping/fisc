<template>
    <div class="filter-item">
        <label>{{title}}</label>
        <i-switch v-model="value" true-value="1" false-value="0" @on-change="change"></i-switch>
    </div>
</template>

<script>
    import {Switch} from 'iview'

    export default {
        components: {'i-switch': Switch},
        props: ['title', 'data'],
        data() {
            return {
                value: this.data
            }
        },
        methods: {
            change() {
                this.$emit('changeFilterSwitch', this.value)
            }
        }
    }
</script>