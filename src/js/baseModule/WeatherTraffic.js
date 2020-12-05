import Urls from 'src@/js/config/urls';
import {AxiosType} from '../config/enums';

export default {
    //获取预警列表
    fetchWarnList() {
        let self = this;
        self.$caxios({
            url: Urls.weather.fetchWarnList,
            method: 'get'
        }, AxiosType.Token)
            .then(data => {
                let list = {special: {}, delay: {}};
                if (data.special && data.special.length !== 0) {//特情数据
                    data.special.forEach(item => {
                        let code3 = item.code3,
                            weather = item.weather;
                        list.special[code3] || (list.special[code3] = []);
                        list.special[code3].push(weather);
                    });
                }
                if (data.para && data.para.length !== 0) {//延迟数据
                    data.para.forEach(item => {
                        let code = item.airportcode,
                            pubdate = item.pubdate;
                        list.delay[code] || (list.delay[code] = []);
                        list.delay[code].push(pubdate);
                    });
                }
                self.warnList = list;
                self.setAirportsMarker(self.isTraffic);
            })
            .catch(err => console.info(err));
    }
}