<template>
    <div class="fisc">
        <FISCHeader :index="1"></FISCHeader>

        <div class="fisc-main">
            <div class="search-container">
                <FlightSearch :data="searchData"></FlightSearch>
            </div>
            <FlightList></FlightList>
        </div>

        <FISCFooter></FISCFooter>
    </div>
</template>

<script>
    import FISCHeader from 'src@/components/FISCHeader.vue';
    import FISCFooter from 'src@/components/FISCFooter.vue';
    import FlightSearch from 'src@/components/FlightSearch.vue';
    import FlightList from 'src@/components/FlightList.vue';
    import {dateFormate} from 'src@/js/common/utils'

    export default {
        components: {
            FISCHeader,
            FISCFooter,
            FlightSearch,
            FlightList
        },
        data() {
            return {
                searchData: {}
            }
        },
        created() {
            let params = this.$route.params;
            this.searchData = {
                type: params.type || 'fnum',
                searchValue: params.value || '',
                searchDate: params.date || dateFormate(new Date(), 'dd/MM/yyyy')
            }
        }
    }
</script>

<style lang="less" scoped>
    body {
        background-color: #efefef;
    }

    .search-container {
        padding: 35px 0;
        background-color: #e0e9f1;
        background-clip: border-box;
    }
</style>

