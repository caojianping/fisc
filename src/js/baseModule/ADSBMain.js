import GoogleMap from './GoogleMap.js';
import AirportJson from '../config/airport.js';
import PlaneMarker from './PlaneMarker.js';
import HeaderAnimation from './HeaderAnimation.js';

export default Object.assign({
    //初始化地图
    initMap() {
        let self = this;
        self.map = new GoogleMap('map', 5).initMap();
        self.routerController();
    },
    //路由监控函数
    routerController() {
        let self = this;
        self.reset();
        self.clearAllCover();

        self.mapType = 'mapbox';
        self.setFlyingMapType();
        google.maps.event.clearListeners(self.map, 'idle');

        let params = self.$route.params || {};
        // console.log('watch type:', params.type);
        switch (params.type) {
            case 'fnum'://路由：/adsb/fnum/### 搜索单个航班
                self.renderSingleFlight();
                break;
            case 'airline'://路由：/adsb/arline/### 搜索航司
                self.bindGoogleIdle()();
                self.renderAirline();
                break;
            case 'airport'://路由：/adsb/airport/### 搜索机场
                self.bindGoogleIdle()();
                self.renderAirport();
                break;
            case 'ground-monitoring'://路由：/adsb/ground-monitoring 地面监控
                self.aptAroundValue = '';//补充
                self.renderGroundMonitoring();
                break;
            case undefined:
                self.bindGoogleIdle()();
                break;
        }
    },

    //----------------------------飞行航班------------------------------//
    //飞行航班：搜索航班
    renderSingleFlight() {
        let self = this,
            value = (self.$route.params || {}).value;
        if (value) {
            let code = value.toUpperCase();
            if (code.match(/^[0-9a-zA-Z]*$/)) {
                let dparams = self.buildSearchFnumParams(code);
                self.fetchSearchFnumData(dparams);
            } else {
                self.searchError(self.$t('m.validate.flightIllegal'));
            }
        }
    },
    //飞行航班：搜索航司
    renderAirline() {
        let self = this,
            value = (self.$route.params || {}).value;
        if (value) {
            let code = value.toUpperCase();
            if (code.match(/^[0-9a-zA-Z]{2,3}$/)) {
                self.fetchBoundsPlanes();
            } else {
                self.searchError(self.$t('m.validate.airlineIllegal'));
            }
        }
    },
    //飞行航班：搜索机场
    renderAirport() {
        let self = this,
            value = (self.$route.params || {}).value;
        if (value) {
            let code = value.toUpperCase();
            if (code.match(/^[a-zA-Z]{3}$/)) {
                let apt = AirportJson[code];
                if (apt && apt.aptlat && apt.aptlon) {
                    self.map.panTo({lat: apt.aptlat, lng: apt.aptlon});
                    self.map.setZoom(10);
                    self.fetchBoundsPlanes();
                } else {
                    self.searchError(self.$t('m.error.airportNotFound'));
                }
            } else {
                self.searchError(self.$t('m.validate.airportIllegal'));
            }
        }
    },
    //更改搜索类型
    changeSearchType() {
        this.searchValue = '';
    },
    //回车搜索数据
    enterSearchValue() {
        let self = this,
            basePath = self.getBasePath(),
            newPath = '';
        if (!self.searchValue) {
            newPath = basePath;
        } else {
            let value = self.searchValue.toUpperCase();
            newPath = basePath + '/' + self.searchType + '/' + value;
        }
        self.$router.push(newPath);
    },
    //切换地图类型效果
    toggleMapTypeBox() {
        this.isExpandMapTypeBox = !this.isExpandMapTypeBox;
    },
    //更改地图类型
    chooseMapType(value) {
        let self = this;
        self.mapType = value;
        self.map.setMapTypeId(value);
    },
    showFlightDetailsAside(flag) {
        if (flag === 'loading') {
            this.isShowSidebar = false;
            this.isDetailLoading = true;
        }
        if (flag === 'show') {
            this.isShowSidebar = true;
            this.isDetailLoading = false;
        }
        if (flag === 'hide') {
            this.isShowSidebar = false;
            this.isDetailLoading = false;
        }
    },
    setDetailData(data) {
        this.detailData = data;
    },
    closeAsidePanel() {
        this.freeTargetPlaneMarker()
    },

    //----------------------------地面监控------------------------------//
    //地面监控：生成地面监控
    renderGroundMonitoring() {
        let self = this,
            value = (self.$route.params || {}).value;
        if (value) {
            let code = value.toUpperCase();
            if (code.match(/^[a-zA-Z]{3}$/)) {
                let apt = AirportJson[code];
                if (apt && apt.aptlat && apt.aptlon) {
                    self.chooseMapType('openStreet');
                    self.map.panTo({lat: apt.aptlat, lng: apt.aptlon});
                    self.map.setZoom(14);
                    google.maps.event.clearListeners(self.map, 'idle');
                    self.fetchGroundMonitoringFlights();
                } else {
                    self.$Message.error(self.$t('m.error.airportNotFound'));
                }
            } else {
                self.$Message.error(self.$t('m.validate.airportIllegal'));
            }
        }
    },
    changeAptAroundFlights(value) {
        let self = this;
        if (!value) {
            self.aptAroundValue = '';
            self.aptAroundFlights = [];
            return;
        }

        value = value.toUpperCase();
        self.aptAroundValue = value;
        let arrs = [];
        for (let id in self.monitorBoundsPlanes) {
            let item = self.monitorBoundsPlanes[id],
                fnum = (item.fnum || '').toUpperCase(),
                anum = (item.anum || '').toUpperCase();
            if (fnum.indexOf(value) > -1 || anum.indexOf(value) > -1) {
                // arrs.push({id: id, fnum: fnum || '-', anum: anum || '-'});
                arrs.push({
                    value: fnum + '/' + fnum + ' -' + id,
                    label: fnum + '/' + anum
                });
            }
        }
        self.aptAroundFlights = arrs.slice(0);
    },
    selectAptAroundFlights(value) {
        let self = this;
        if (!value) {
            self.clearAllCover();
            self.removeAllMonitoringLabel();
            self.renderGroundMonitoring();
            return;
        }

        let matches = value.match(/-[0-9a-zA-Z]+$/);
        if (matches) {
            let id = matches[0].replace(/-/, '');
            if (id && self.monitorBoundsPlanes[id] && self.monitorPlaneMarkers[id] && !self.monitorPlaneMarkers[id].isClick) {
                self.map.setCenter(self.monitorPlaneMarkers[id].getPosition());
                let data = self.monitorBoundsPlanes[id],
                    marker = self.monitorPlaneMarkers[id],
                    params = {
                        icaoId: id,
                        anum: data.anum,
                        fnum: data.fnum,
                        iata: (self.$route.params.value || '').toUpperCase(),
                    };
                self.activePlaneMarker(marker);
                marker.isClick = true;
                self.fetchLineOfMonitoringPlane(params, marker);
            }
        }
    },

    //----------------------------通用方法------------------------------//
    //通用方法：获取当前路由的基础路径
    getBasePath() {
        return (this.$i18n.locale === 'zh-CN' ? '/cn' : '') + '/ads-b';
    },
    //通用方法：查询错误处理函数
    searchError(err) {
        let self = this;
        self.searchValue = '';
        self.$Message.error(err);
        self.$router.push(self.getBasePath());
    },
    //通用方法：设置飞行航班的地图类型
    setFlyingMapType() {
        let self = this;
        self.chooseMapType(self.mapType);
        self.map.setZoom(5);
        self.map.setCenter({lat: 34.65128519895413, lng: 103.73291015625});
    },
    //通用方法：注册谷歌地图idle事件
    bindGoogleIdle() {
        let self = this,
            flag = null;
        return function () {
            google.maps.event.addListener(self.map, 'idle', function () {
                if (flag) {
                    clearTimeout(flag);
                }
                flag = setTimeout(function () {
                    self.fetchBoundsPlanes();
                }, 200);
            });
        };
    },
    reset() {
        let self = this;
        self.pollCount = 0;
        self.isFetchPlanes = false;
        self.isShowDropdown = false;
        self.detailEcharts = null;
    }
}, PlaneMarker, HeaderAnimation);