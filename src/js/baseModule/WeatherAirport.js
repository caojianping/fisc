import Urls from 'src@/js/config/urls';
import EchartsOptions from 'src@/js/config/echartsOptions';
import AirportJson from 'src@/js/config/airport';
import {HistoryWeatherIcons, FutureWeatherIcons} from 'src@/js/config/weatherIcons';
import {AxiosType} from '../config/enums';
import {getKeys} from '../common/utils';

const WeatherUrls = Urls.weather;
const echarts = require('echarts');

export default {
    __request__(url, params, successCallback, errorCallback) {
        let self = this;
        self.$caxios({
            url: url,
            method: 'get',
            params: params
        }, AxiosType.Token)
            .then(data => successCallback && successCallback(data))
            .catch(err => errorCallback && errorCallback(err));
    },

    initWeatherDetails() {
        let self = this,
            params = self.$route.params || {},
            code = params.apt;
        if (!code) return;

        code = code.toUpperCase();
        self.fetchWeatherChart(code);
        self.fetchAirportNewestInfo(code);
        self.fetchWeatherMessageList(code);
        self.fetchWeatherAndMessageList(code);
        self.fetchAirportHourlyWeatherPatterns(code);
    },

    // 获取到天气的图表数据，并生成图表
    fetchWeatherChart(code) {
        let self = this;
        self.__request__(WeatherUrls.fetchChart, {code: code}, self.fetchWeatherChartSuccess, null);
    },
    setEcharts(id, options, key) {
        let self = this;
        if (!self[key]) {
            self[key] = echarts.init(
                document.getElementById(id)
            );
        } else {
            self[key].clear();
        }
        self[key].setOption(options);
    },
    isEmptyEcharts(data) {
        return Array.isArray(data) && data.length <= 0;
    },
    fetchWeatherChartSuccess(_data) {
        let self = this;
        if ((_data.dew_point && Object.keys(_data.dew_point.length !== 0)) || (_data.temperature && Object.keys(_data.temperature.length !== 0))) {
            let xAxis = getKeys(_data.dew_point),
                yAxis = [],
                tAxis = [];
            if ((_data.dew_point && Object.keys(_data.dew_point.length !== 0))) {
                for (var i1 = 0; i1 < xAxis.length; i1++) {
                    yAxis.push(_data.dew_point[xAxis[i1]]);
                }
            }
            if ((_data.temperature && Object.keys(_data.temperature.length !== 0))) {
                for (var i2 = 0; i2 < xAxis.length; i2++) {
                    tAxis.push(_data.temperature[xAxis[i2]]);
                }
            }

            let legends1 = [self.$t('m.weather.temperature'), self.$t('m.weather.dewPoint')],
                options1 = EchartsOptions.dewPointChart(xAxis, tAxis, yAxis, legends1);
            self.setEcharts('dewPointChart', options1, 'dewPointChart');
        }

        if (_data.wind) {
            let xAxis = self.isEmptyEcharts(_data.wind) ? [] : getKeys(_data.wind),
                yAxis = [];
            for (let i3 = 0; i3 < xAxis.length; i3++) {
                let _angle = _data.wind[xAxis[i3]][0] ? Number(_data.wind[xAxis[i3]][0]) : 0,
                    _value = _data.wind[xAxis[i3]][1] ? Number(_data.wind[xAxis[i3]][1].match(/[0-9]+/)[0]) : 0;
                yAxis.push({
                    value: _value,
                    symbolRotate: _angle,
                    text: _data.wind[xAxis[i3]][1]
                });
            }

            let legends2 = [self.$t('m.weather.wind')],
                options2 = EchartsOptions.windChart(xAxis, yAxis, legends2);
            self.setEcharts('windChart', options2, 'windChart');
        }

        if (_data.hpa) {
            let xAxis = self.isEmptyEcharts(_data.hpa) ? [] : getKeys(_data.hpa),
                yAxis = [];
            for (let i4 = 0; i4 < xAxis.length; i4++) {
                yAxis.push(Number(_data.hpa[xAxis[i4]]));
            }
            let legends3 = [self.$t('m.weather.qnh')],
                options3 = EchartsOptions.qnhChart(xAxis, yAxis, legends3);
            self.setEcharts('qnhChart', options3, 'qnhChart');
        }

        if (_data.visibility) {
            let xAxis = self.isEmptyEcharts(_data.visibility) ? [] : getKeys(_data.visibility),
                yAxis = [];
            for (let i5 = 0; i5 < xAxis.length; i5++) {
                yAxis.push(Number(_data.visibility[xAxis[i5]]));
            }
            let legends4 = [self.$t('m.weather.visibility')],
                options4 = EchartsOptions.visibilityChart(xAxis, yAxis, legends4);
            self.setEcharts('visibilityChart', options4, 'visibilityChart');
        }
    },

    // 获取机场最新相关信息
    fetchAirportNewestInfo(code) {
        let self = this,
            url = WeatherUrls.fetchNewestAirportInfo;
        self.__request__(url, {
            'airport': code,
            type: 'dep'
        }, self.fetchAirportNewestInfoSuccess, self.fetchAirportNewestInfoError);
        self.__request__(url, {
            'airport': code,
            type: 'arr'
        }, self.fetchAirportNewestInfoArrSuccess, self.fetchAirportNewestInfoArrError);
    },
    fetchAirportNewestInfoSuccess(data) {
        let self = this;
        data.depSpeed ? self.weatherDetail.outAvgTraffic = data.depSpeed + 'min/Flt' : self.weatherDetail.outAvgTraffic = '-';
        data.latestDepFlight && data.latestDepFlight.actual_deptime ? self.weatherDetail.outLatestTime = data.latestDepFlight.actual_deptime : '-';
        data.ontime && data.ontime['0030'] ? self.weatherDetail.outRate = Math.round(data.ontime['0030'] * 100) + '%' : '-';
        self.weatherDetail.paraStatus = data.paraStatus || -1;
    },
    fetchAirportNewestInfoError() {
        let self = this;
        self.weatherDetail.outAvgTraffic = '-';
        self.weatherDetail.outLatestTime = '-';
        self.weatherDetail.outRate = '-';
        self.weatherDetail.paraStatus = -1;
    },
    fetchAirportNewestInfoArrSuccess(data) {
        let self = this;
        data.arrSpeed ? self.weatherDetail.inAvgTraffic = data.arrSpeed + 'min/Flt' : self.weatherDetail.outAvgTraffic = '-';
        data.latestArrFlight && data.latestArrFlight.actual_arrtime ? self.weatherDetail.inLatestTime = data.latestArrFlight.actual_arrtime : '-';
        data.ontime && data.ontime['0030'] ? self.weatherDetail.inRate = Math.round(data.ontime['0030'] * 100) + '%' : '-';
    },
    fetchAirportNewestInfoArrError() {
        let self = this;
        self.weatherDetail.outAvgTraffic = '-';
        self.weatherDetail.inLatestTime = '-';
        self.weatherDetail.inRate = '-';
    },

    // 获取最新天气信息和报文
    fetchWeatherMessageList(code) {
        let self = this,
            url = WeatherUrls.fetchNewestWeatherInfo;
        self.__request__(url, {
            'code': code,
            type: 'm'
        }, self.fetchWeatherMessageListMSuccess, self.fetchWeatherMessageListMError);
        self.__request__(url, {
            'code': code,
            type: 't'
        }, self.fetchWeatherMessageListTSuccess, self.fetchWeatherMessageListTError);
    },
    fetchWeatherMessageListMSuccess(data) {
        let self = this,
            wob = data.wob,
            _time = data.wpubtime;
        wob ? self.weatherDetail.metarNewestText = wob : '-';
        _time ? self.weatherDetail.metarNewestTime = self.date(_time) + ' ' + self.time(_time) : '-';
        if (data.wobtext) {
            let _oo = data.wobtext,
                weather = _oo.weather.trim(),
                titleInfo = {
                    code: self.$route.params.apt.toUpperCase(),
                    temperature: Number(_oo.temperature),
                    weatherIcon: self.convert(weather, false),
                    weather: self.ellipse(weather),
                    weatherText: weather,
                    QHN: _oo.hpa,
                    dewPoint: _oo.dew_point ? Number(_oo.dew_point) : '-',
                    visibility: _oo.visibility,
                    wind: _oo.wind
                };
            self.$set(self.weatherDetail, 'weatherTitleInfo', titleInfo);
        } else {
            self.weatherDetail.metarNewestText = '-'
            self.weatherDetail.metarNewestTime = '-';
            let titleInfo = {
                code: this.$route.params.apt.toUpperCase(),
                temperature: '-',
                weatherIcon: self.convert(null, false),
                weather: '-',
                weatherText: '-',
                QHN: '-',
                dewPoint: '-',
                visibility: '-',
                wind: '-'
            };
            self.$set(self.weatherDetail, 'weatherTitleInfo', titleInfo);
        }
    },
    fetchWeatherMessageListMError() {
        let self = this;
        self.weatherDetail.metarNewestText = '-'
        self.weatherDetail.metarNewestTime = '-';
        let titleInfo = {
            code: this.$route.params.apt.toUpperCase(),
            temperature: '-',
            weatherIcon: self.convert(null, false),
            weather: '-',
            weatherText: '-',
            QHN: '-',
            dewPoint: '-',
            visibility: '-',
            wind: '-'
        };
        self.$set(self.weatherDetail, 'weatherTitleInfo', titleInfo);
    },
    fetchWeatherMessageListTSuccess(data) {
        let self = this,
            wob = data.wob,
            _time = data.wpubtime;
        wob ? self.weatherDetail.tafNewestText = wob : '-';
        _time ? self.weatherDetail.tafNewestTime = self.date(_time) + ' ' + self.time(_time) : '-';
    },
    fetchWeatherMessageListTError() {
        let self = this;
        self.weatherDetail.tafNewestText = '-';
        self.weatherDetail.tafNewestTime = '-';
    },

    // 获取天气\报文列表
    fetchWeatherAndMessageList(code) {
        let self = this,
            url = WeatherUrls.fetchWeatherAndMessageList;
        self.__request__(url, {
            'code': code,
            type: 'm'
        }, self.fetchWeatherAndMessageListMSuccess, self.fetchWeatherAndMessageListMError);
        self.__request__(url, {
            'code': code,
            type: 't'
        }, self.fetchWeatherAndMessageListTSuccess, self.fetchWeatherAndMessageListTError);
    },
    fetchWeatherAndMessageListMSuccess(_data) {
        let self = this,
            arr = [];
        for (let i = 0; i < _data.length; i++) {
            arr.push({
                wob: _data[i].wob ? _data[i].wob : '-',
                time: _data[i].wpubtime ? self.date(_data[i].wpubtime) + ' ' + self.time(_data[i].wpubtime) : '-'
            });
        }
        self.weatherDetail.metarList = arr;
    },
    fetchWeatherAndMessageListMError() {
        let self = this;
        self.weatherDetail.metarList = [];
    },
    fetchWeatherAndMessageListTSuccess(_data) {
        let self = this,
            arr = [];
        for (let i = 0; i < _data.length; i++) {
            arr.push({
                wob: _data[i].wob ? _data[i].wob : '-',
                time: _data[i].wpubtime ? self.date(_data[i].wpubtime) + ' ' + self.time(_data[i].wpubtime) : '-'
            });
        }
        self.weatherDetail.tafList = arr;
    },
    fetchWeatherAndMessageListTError() {
        let self = this;
        self.weatherDetail.tafList = [];
    },

    // 获取机场小时天气走势
    fetchAirportHourlyWeatherPatterns(code) {
        let self = this,
            apt = AirportJson[code];
        if (apt) {
            let url = WeatherUrls.fetchAirportHourlyWeatherPatterns,
                params = {
                    code: code,
                    lon: apt.aptlon,
                    lat: apt.aptlat
                };
            self.__request__(url, params, self.fetchAirportHourlyWeatherPatternsSuccess, self.fetchAirportHourlyWeatherPatternsError);
        }
    },
    fetchAirportHourlyWeatherPatternsSuccess(data) {
        let self = this;
        self.weatherDetail.historyWeatherList = [];
        self.weatherDetail.futureWeatherList = [];
        self.weatherDetail.allWeatherList = [];

        let historyList = data.history || [];
        self.weatherDetail.historyWeatherList = historyList.map(item => {
            let value = item.value.trim() || '-',
                datetime = item.datetime.trim() || '';
            return {
                time: self.time(datetime),
                weather: self.ellipse(value),
                weatherText: value,
                weatherIcon: self.convert(value, false)
            }
        });

        let forecastList = data.forecast || [];
        forecastList.forEach((item, index) => {
            let value = item.value.trim() || '-',
                datetime = item.datetime.trim() || '',
                tvalue = self.$t('m.weather.futureWeatherStatus["' + value + '"]'),
                witem = {
                    time: self.time(datetime),
                    weather: self.ellipse(tvalue),
                    weatherText: tvalue,
                    weatherIcon: self.convert(value, true)
                };
            if (index < 5) {
                self.weatherDetail.futureWeatherList.push(witem);
            }
            self.weatherDetail.allWeatherList.push(witem);
        });
    },
    fetchAirportHourlyWeatherPatternsError() {
        let self = this;
        self.weatherDetail.historyWeatherList = [];
        self.weatherDetail.futureWeatherList = [];
        self.weatherDetail.allWeatherList = [];
    },

    date(s) {
        if (!s) return '';
        return new Date(s).toFormatString('MM-dd hh:mm', true);
    },
    time(s) {
        if (!s) return '';
        return new Date(s).toFormatString('hh:mm', true);
    },
    ellipse(s) {
        s = s || '';
        return s.length >= 6 ? s.substr(0, 6) + '..' : s;
    },
    convert(weather, isFuture) {
        isFuture = !!isFuture;

        let icons = !isFuture ? HistoryWeatherIcons : FutureWeatherIcons;
        if (!weather) return icons['-'];
        if (!icons.hasOwnProperty(weather)) return icons['Unknow'];

        return icons[weather];
    }
};