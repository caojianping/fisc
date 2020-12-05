<template>
    <div id="test">

    </div>
</template>

<script>
    import {AxiosType} from "./js/config/enums";

    export default {
        data(){
            return {
                timer: 0,
                interval: 5000
            };
        },
        methods: {
            fetchData() {
                // console.log('轮询测试数据！');
                let self = this;
                self.clearTimer();
                self.$caxios({
                    url: Urls.fetchRealtimePlanesOfMapUrl,
                    method: 'get',
                    params: {
                        longleftdown: 62.33642578125,
                        latleftdown: 17.30868788677001,
                        longrightup: 145.12939453125,
                        latrightup: 49.009050809382046,
                        timerange: 50
                    }
                }, AxiosType.Token)
                    .then(data => {
                        let self = this;
                        setTimeout(()=>{
                            let self = this;
                            this.timer = setTimeout(() => {
                                self.fetchBoundsPlanes()
                            }, self.interval);
                        }, 2000);
                    })
                    .catch(err => {
                        // console.log('Error: ', err);
                    });
            },
            clearTimer() {
                if (this.timer) {
                    clearTimeout(this.timer);
                }
            },
        }
    }
</script>