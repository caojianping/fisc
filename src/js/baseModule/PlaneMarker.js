import Urls from 'src@/js/config/urls';
import {AxiosType, ErrorType} from 'src@/js/config/enums';
import {dateFormate, decimal2, meterToKiloMeter, calculateSecond} from 'src@/js/common/utils';
import PlaneSprite from 'src@/js/baseModule/PlaneSprite';
import PlaneSize from 'src@/js/baseModule/PlaneSize';

const echarts = require('echarts');

let planesIcon = {
    'planes-y-s': require('../../images/flightadsb-y-s.png'),
    'planes-y-n': require('../../images/flightadsb-y-n.png'),
    'planes-y-l': require('../../images/flightadsb-y-l.png'),
    'planes-r-s': require('../../images/flightadsb-r-s.png'),
    'planes-r-n': require('../../images/flightadsb-r-n.png'),
    'planes-r-l': require('../../images/flightadsb-r-l.png')
};
let waterIcon = require('../../images/water_logo.png');

function Layers(latLng, text, map, planeClass) {
    this.bounds_ = new google.maps.LatLngBounds(latLng);
    this.map_ = map;
    this.className = planeClass;
    this.text_ = text;
    this.div_ = null;
    this.setMap(this.map_);
}

Layers.prototype = new google.maps.OverlayView();
Layers.prototype.onAdd = function () {
    var div = document.createElement('div'),
        panes = null,
        claName = this.className;
    div.className = claName;
    // Plane id number
    div.innerHTML = this.text_;
    div.hidden = false;
    this.div_ = div;
    panes = this.getPanes();
    panes.overlayImage.appendChild(this.div_);
};
Layers.prototype.draw = function () {
    var ov = this.getProjection(),
        sw = ov.fromLatLngToDivPixel(this.bounds_.getSouthWest()),
        ne = ov.fromLatLngToDivPixel(this.bounds_.getNorthEast()),
        div = this.div_;
    div.style.left = (sw.x - div.offsetWidth / 2) + 'px';
    div.style.top = (ne.y - (div.offsetHeight + 14)) + 'px';
};
Layers.prototype.onRemove = function () {
    if (this.div_) {
        this.div_.parentNode.removeChild(this.div_);
        this.div_ = null;
    }
};
Layers.prototype.hide = function () {
    if (this.div_) {
        this.div_.style.visibility = 'hidden';
    }
};
Layers.prototype.show = function () {
    if (this.div_) {
        this.div_.style.visibility = 'visible';
    }
};
Layers.prototype.toggle = function () {
    if (this.div_) {
        if (this.div_.style.visibility === 'hidden') {
            this.show();
        } else {
            this.hide();
        }
    }
};
Layers.prototype.move = function (latLng) {
    this.bounds_ = new google.maps.LatLngBounds(latLng);
    this.draw();
}
Layers.prototype.toggleDOM = function () {
    if (this.getMap()) {
        this.setMap(null);
    } else {
        this.setMap(this.map_);
    }
};

export default {
    //----------------------------飞行航班------------------------------//
    buildFetchDetailsParamsData(id) {
        let self = this,
            item = self.boundsPlanes[id] || {};
        return {
            fnum: item.fnum || '',
            anum: item.anum || '',
            querydate: dateFormate(new Date(), 'yyyy-MM-dd')
        };
    },
    getBoundsOfMap() {
        let self = this,
            bounds = self.map.getBounds();
        return {
            longsw: bounds.getSouthWest().lng(),
            latsw: bounds.getSouthWest().lat(),
            longne: bounds.getNorthEast().lng(),
            latne: bounds.getNorthEast().lat()
        }
    },
    fetchBoundsPlanes() {
        // console.log('轮询飞行航班！');
        let self = this;
        if (self.isFetchPlanes || !self.isADSBPath() || self.isGroundMonitor) return;

        self.clearTimer();
        self.isFetchPlanes = true;
        let bounds = self.getBoundsOfMap();
        self.$caxios({
            url: Urls.fetchRealtimePlanesOfMapUrl,
            method: 'get',
            params: {
                longleftdown: bounds.longsw,
                latleftdown: bounds.latsw,
                longrightup: bounds.longne,
                latrightup: bounds.latne,
                timerange: 50
            }
        }, self.pollCount === 0 ? AxiosType.TokenLoading : AxiosType.Token)
            .then(data => self.fetchBoundsPlanesSuccess(data))
            .catch(err => self.fetchBoundsPlanesError(err));
    },
    fetchBoundsPlanesSuccess(data) {
        let self = this;
        self.pollCount += 1;
        if (self.errorCount > 0) {
            self.errorCount = 0;
        }
        self.renderBoundsPlanes(data);//生成marker
        self.isFetchPlanes = false;
        self.pollBoundsPlanes();//间隔5s再次获取数据
    },
    fetchBoundsPlanesError(err) {
        let self = this;
        self.isFetchPlanes = false;
        self.errorCount += 1;
        if (self.errorCount >= 3) {
            self.clearAllMarkers(false);
            self.clearAllMarkers(true);
        } else {
            self.pollBoundsPlanes();
        }
    },
    pollBoundsPlanes() {
        let self = this;
        self.timer = setTimeout(() => {
            self.fetchBoundsPlanes();
        }, self.interval);
    },
    filterBoundsPlanes(data) {
        let self = this,
            params = self.$route.params || {};
        if (params.type === 'airline') {
            let _code = params.value;
            if (_code.match(/^[a-zA-Z]{2}$/)) {//二字码
                let result = {};
                for (let id in data) {
                    let _obj = data[id];
                    if (_obj.fnum2 && _obj.fnum2.startsWith(_code)) {
                        result[id] = _obj;
                    }
                }
                return result;
            } else if (_code.match(/^[a-zA-Z]{3}$/)) {//三字码
                let result = {};
                for (let id in data) {
                    let _obj = data[id]
                    if (_obj.fnum && _obj.fnum.startsWith(_code)) {
                        result[id] = _obj;
                    }
                }
                return result;
            } else {
                return {};
            }
        }
        return data;
    },
    renderBoundsPlanes(data) {
        let self = this,
            renderDOM = () => {
                for (let id in self.boundsPlanes) {
                    if (self.planeMarkers && self.planeMarkers[id]) {
                        //更新飞机标记
                        self.updateBoundsPlaneMarker(id);
                        //更新详情数据（如果此id的飞机marker为选中状态）
                        let paramsData = self.buildFetchDetailsParamsData(id);
                        self.planeMarkers[id] && self.planeMarkers[id].isClick && self.fetchDetailsInfo(paramsData, 'update');
                    } else {//新增飞机标记
                        self.addBoundsPlaneMarker(id);
                    }
                }
                for (let id in self.planeMarkers) {
                    if (!self.boundsPlanes[id]) {//删除飞机标记
                        self.removePlaneMarker(id);
                    }
                }
            };
        // if (self.pollCount === 1) {
        //     setTimeout(() => {
        //         self.boundsPlanes = self.filterBoundsPlanes(data);
        //         renderDOM();
        //     }, 500);
        // } else {
        //     self.boundsPlanes = self.filterBoundsPlanes(data);
        //     renderDOM();
        // }
        self.clearAllMarkers(true);
        self.removeAllMonitoringLabel();
        self.boundsPlanes = self.filterBoundsPlanes(data);
        renderDOM();
    },

    //----------------------------PlaneMarker------------------------------//
    addBoundsPlaneMarker(id) {
        let self = this,
            option = self.buildPlaneMarkerOptions(id);
        self.planeMarkers[id] = self.addPlaneMarker(option);
    },
    updateBoundsPlaneMarker(id, isMonitor) {
        //更新可视区域内的飞机marker
        isMonitor = !!isMonitor;
        let self = this,
            markers = !isMonitor ? self.planeMarkers : self.monitorPlaneMarkers,
            marker = markers[id];
        if (marker) {
            let options = self.buildPlaneMarkerOptions(id, isMonitor);
            self.updatePlanesMarker(options, marker);
        }
    },
    buildPlaneMarkerOptions(id, isMonitor) {
        isMonitor = !!isMonitor;
        let self = this,
            data = !isMonitor ? self.boundsPlanes[id] : self.monitorBoundsPlanes[id],
            position = data.position || {},
            aType = data.atype || '',
            angle = isNaN(Number(data.angle)) ? 0 : Number(data.angle),
            height = isNaN(Number(data.height)) ? 0 : Number(data.height);
        return {
            id: id,
            map: self.map,
            position: {lat: position.lat || 0, lng: position.long || 0},
            icon: self.getPlanesIcon('y', angle, aType),
            zIndex: self.heightToZIndex(height),
            aType: aType,
            angle: angle,
            height: height
        };
    },
    addPlaneMarker(markerOption) {
        let self = this,
            marker = new google.maps.Marker(markerOption);
        marker.isClick = false;
        marker.isHover = false;
        google.maps.event.addListener(marker, 'click', function () {
            self.clickPlaneMarker(this);
        });
        google.maps.event.addListener(marker, 'mouseover', function () {
            self.hoverPlaneMarker(this);
        });
        google.maps.event.addListener(marker, 'mouseout', function () {
            self.outPlaneMarker(this);
        });
        return marker;
    },
    updatePlanesMarker(option, marker) {
        //更新飞机marker
        let self = this,
            iconColor = marker.isClick ? 'r' : 'y';
        marker.setIcon(self.getPlanesIcon(iconColor, marker.angle, marker.aType));
        marker.setPosition(option.position);
        marker.angle = option.angle;
        marker.aType = option.aType;
        marker.height = option.height;
        if (marker.isClick) {
            self.clickPlaneLabel && self.clickPlaneLabel.move(marker.getPosition());
        }
        self.moveTargetMonitoringLabel(marker.id, marker.position)
    },
    removePlaneMarker(id, isMonitor) {
        isMonitor = !!isMonitor;
        let self = this,
            marker = !isMonitor ? self.planeMarkers[id] : self.monitorPlaneMarkers[id],
            time = Date.now(),
            min = 6e4;//一分钟
        if (marker) {
            marker.isClick || self.clearPlaneMarker(id, isMonitor);
            //选择的飞机大于一分钟时间内没有更新数据 释放该marker
            if (marker.isClick && !isNaN(Number(marker.updatetime)) && (Number(time) - Number(marker.updatetime) * 1e3) > min) {
                self.clearPlaneMarker(id, isMonitor);
                self.freePlaneMarker(marker);//每次loop时如果 大于1分钟 释放marker
            }
            self.removeTargetMonitoringLabel(marker.id);
        }
    },
    clearPlaneMarker(id, isMonitor) {//清除飞机marker
        isMonitor = !!isMonitor;
        let self = this,
            marker = !isMonitor ? self.planeMarkers[id] : self.monitorPlaneMarkers[id];
        marker.setMap(null);
        marker = null;
        if (!isMonitor) {
            delete self.planeMarkers[id];
        } else {
            delete self.monitorPlaneMarkers[id];
        }
    },
    freePlaneMarker(marker) {
        //释放选中的飞机marker
        this.defaultPlaneMarker(marker);//使marker变成默认状态下的颜色和高度
        this.showFlightDetailsAside('hide');
        this.clearLabelLayer('click');
        this.clearFlightPolyline();
    },
    activePlaneMarker(marker) {
        //选中的飞机marker
        marker.setIcon(this.getPlanesIcon('r', marker.angle, marker.aType));
        marker.setZIndex(9999);
    },
    defaultPlaneMarker(marker) {
        //默认状态下的飞机marker
        marker.isClick = false;
        marker.isHover = false;
        marker.setIcon(this.getPlanesIcon('y', marker.angle, marker.aType));
        marker.setZIndex(this.heightToZIndex(marker.height));
    },
    clickPlaneMarker(marker) {
        //点击飞机marker
        marker.isHover = false;
        marker.isClick = !marker.isClick;
        if (marker.isClick) {
            for (let id in this.planeMarkers) {
                let _marker = this.planeMarkers[id]
                if (_marker.isClick && marker.id !== _marker.id) {
                    this.freePlaneMarker(_marker);//点击一个marker后 释放以前选中的marker
                }
            }
            //点击选中marker
            this.activePlaneMarker(marker);
            //生成飞机标签
            this.clearLabelLayer('hover')
            let text = this.getPlaneLabelText(marker.id)
            this.renderLableLayer('click', marker.getPosition(), text);
            //获取详细信息
            let data = this.buildFetchDetailsParamsData(marker.id);
            this.fetchDetailsInfo(data)
        } else {
            this.freePlaneMarker(marker);//点击航班标志释放marker
        }
    },
    hoverPlaneMarker(marker) {
        let self = this;
        if (!marker.isClick) {
            marker.isHover = true;
            self.activePlaneMarker(marker);
            let text = self.getPlaneLabelText(marker.id);
            self.renderLableLayer('hover', marker.getPosition(), text);
        }
    },
    outPlaneMarker(marker) {
        if (!marker.isClick) {
            marker.isHover = false;
            this.defaultPlaneMarker(marker);
        }
        this.clearLabelLayer('hover');
    },

    //----------------------------LabelLayer------------------------------//
    clearLabelLayer(type) {
        let self = this;
        if (type === 'click') {
            if (self.clickPlaneLabel) {
                self.clickPlaneLabel.setMap(null);
                self.clickPlaneLabel = null;
            }
        } else if (type === 'hover') {
            if (self.hoverPlaneLabel) {
                self.hoverPlaneLabel.setMap(null);
                self.hoverPlaneLabel = null;
            }
        }
    },
    renderLableLayer(type, position, text) {
        let self = this;
        if (type === 'click') {
            self.clickPlaneLabel = new Layers(position, text, self.map, 'plane-label');
        } else if (type === 'hover') {
            self.hoverPlaneLabel = new Layers(position, text, self.map, 'plane-label');
        }
    },
    getPlaneLabelText(id) {
        let self = this,
            text = '';
        for (let key in self.boundsPlanes) {
            if (id === key) {
                let item = self.boundsPlanes[key];
                text = item.fnum ? item.fnum : item.anum ? item.anum : 'unKnow';
            }
        }
        return text;
    },
    freeTargetPlaneMarker() {
        let self = this;
        for (let id in self.planeMarkers) {
            let marker = self.planeMarkers[id];
            if (marker.isClick) {
                self.freePlaneMarker(marker);
            }
        }
    },


    //----------------------------地面监控------------------------------//
    fetchGroundMonitoringFlights() {
        // console.log('轮询地面监控！');
        let self = this;
        if (!self.isADSBPath() || !self.isGroundMonitor) return;

        let value = (self.$route.params || {}).value;
        if (!value) return;

        self.clearTimer();
        self.$caxios({
            url: Urls.fetchGroundMonitoringPlanesUrl,
            method: 'get',
            params: {
                iata: value.toUpperCase(),
                timeRange: 50
            }
        }, self.pollCount === 0 ? AxiosType.TokenLoading : AxiosType.Token)
            .then(data => self.fetchGroundMonitoringSuccess(data.data))
            .catch(err => self.fetchGroundMonitoringError(err));
    },
    fetchGroundMonitoringSuccess(data) {
        let self = this;
        self.pollCount += 1;
        if (self.errorCount > 0) {
            self.errorCount = 0;
        }
        self.renderMonitoringPlanes(data.aircrafts);
        self.pollMonitoringPlanes();
    },
    fetchGroundMonitoringError(err) {
        let self = this;
        self.errorCount += 1;
        if (self.errorCount >= 3) {
            self.clearAllMarkers(true);
            self.clearAllMarkers(false);
            self.$Message.error(err);
        } else {
            self.pollMonitoringPlanes();
        }
    },
    pollMonitoringPlanes() {
        let self = this;
        this.timer = setTimeout(() => {
            self.fetchGroundMonitoringFlights();
        }, self.interval);
    },
    renderMonitoringPlanes(aircrafts) {
        let self = this,
            renderDOM = () => {
                for (let id in self.monitorBoundsPlanes) {
                    if (self.monitorPlaneMarkers && self.monitorPlaneMarkers[id]) {
                        //更新飞机标记
                        self.updateBoundsPlaneMarker(id, true);
                        //更新详情数据（如果此id的飞机marker为选中状态）
                        let data = self.monitorBoundsPlanes[id],
                            marker = self.monitorPlaneMarkers[id];
                        marker && marker.isClick && self.fetchLineOfMonitoringPlane({
                            icaoId: id,
                            anum: data.anum,
                            fnum: data.fnum,
                            iata: (self.$route.params.value || '').toUpperCase()
                        }, marker);
                    } else {//新增飞机标记
                        self.addMonitoringPlaneMarker(id, true);
                    }
                }
                for (let id in self.monitorPlaneMarkers) {
                    if (!self.monitorBoundsPlanes[id]) {
                        //新获取的数据没有这个id, 删除这个航班
                        self.removePlaneMarker(id, true);
                    }
                }
            };
        // if (self.pollCount === 1) {
        //     setTimeout(() => {
        //         self.monitorBoundsPlanes = aircrafts;
        //         renderDOM();
        //     }, 500);
        // } else {
        //     self.monitorBoundsPlanes = aircrafts;
        //     renderDOM();
        // }
        self.clearAllMarkers(false);
        self.monitorBoundsPlanes = aircrafts;
        renderDOM();
    },
    addMonitoringPlaneMarker(id, isMonitor) {
        isMonitor = !!isMonitor;
        let self = this,
            options = self.buildPlaneMarkerOptions(id, isMonitor);
        self.monitorPlaneMarkers[id] = self.addMonitoringMarker(options);
    },
    fetchLineOfMonitoringPlane(params, marker) {
        let self = this;
        self.$caxios({
            url: Urls.fetchDetailsOfGroundMonitoringUrl,
            method: 'get',
            params: params
        }, AxiosType.Token).then(data => {
            self.clearFlightPolyline();
            self.aptAroundFlights = [];

            let lines = data.data.line,
                lastPos = null;
            for (let index = 0, leng = lines.length; index < leng - 1; index++) {
                let item = lines[index],
                    itemNext = lines[index + 1],
                    time = item.updatetime,
                    timeNext = itemNext.updatetime,
                    position = !!item.position ? item.position : {lat: 0, long: 0},
                    positionNext = !!itemNext.position ? itemNext.position : {lat: 0, long: 0},
                    pos_ = {lat: Number(position.lat), lng: Number(position.long)},
                    posNext_ = {lat: Number(positionNext.lat), lng: Number(positionNext.long)},
                    path = [pos_, posNext_];
                if (index === leng - 2) {
                    lastPos = posNext_
                }
                if (timeNext - time > 30) {
                    self.addPrePolyline(path);
                } else {
                    self.addMonitorPolyline(path);
                }
            }
            // self.addPrePolyline([lastPos, marker.getPosition()]);
        }).catch(err => {
            self.clearFlightPolyline();
            self.aptAroundFlights = [];
            self.$Message.error(self.$t('m.error.straceNotFound'));
            self.defaultPlaneMarker(marker);
        });
    },

    //----------------------------地面监控Marker------------------------------//
    addMonitoringMarker(markerOption) {
        let self = this,
            marker = new google.maps.Marker(markerOption);
        marker.isClick = false;
        marker.isHover = false;
        //设置marker
        self.addMonitoringLabelLayer(markerOption);
        //注册事件
        google.maps.event.addListener(marker, 'click', function () {
            self.clickMonitorPlaneMarker(this);
        });
        google.maps.event.addListener(marker, 'mouseover', function () {
            self.hoverMonitorPlaneMarker(this);
        });
        google.maps.event.addListener(marker, 'mouseout', function () {
            self.outMonitorPlaneMarker(this);
        });
        return marker;
    },
    clickMonitorPlaneMarker(marker) {
        let self = this;
        if (marker.isClick) {
            //如果是选中状态，那么取消选中状态
            self.defaultPlaneMarker(marker);
            marker.isClick = false;
            self.clearFlightPolyline();
        } else {
            for (let id in self.monitorPlaneMarkers) {
                let marker = self.monitorPlaneMarkers[id];
                if (marker.isClick) {
                    self.defaultPlaneMarker(marker);
                    marker.isClick = false;
                }
            }
            self.activePlaneMarker(marker);
            marker.isClick = true;

            let id = marker.id,
                item = self.monitorBoundsPlanes[id];
            if (item) {
                self.fetchLineOfMonitoringPlane({
                    icaoId: id,
                    anum: item.anum,
                    fnum: item.fnum,
                    iata: (self.$route.params.value || '').toUpperCase()
                }, marker);
            }
        }
    },
    hoverMonitorPlaneMarker(marker) {
        if (!marker.isClick) {
            this.activePlaneMarker(marker);
        }
    },
    outMonitorPlaneMarker(marker) {
        if (!marker.isClick) {
            this.defaultPlaneMarker(marker);
        }
    },

    //----------------------------地面监控LabelLayer------------------------------//
    addMonitoringLabelLayer(option) {
        let layer = null;
        layer = new Layers(option.position, this.getMonitoringText(option.id), this.map, 'monitoring-label');
        this.monitorPlaneLabel[option.id] = layer;
    },
    getMonitoringText(id) {
        let _data = this.monitorBoundsPlanes[id],
            forg = !!_data.forg ? _data.forg : '-',
            fdst = !!_data.fdst ? _data.fdst : '-',
            forgAndFdst = forg + ' - ' + fdst,
            anum = !!_data.anum ? _data.anum : '-',
            fnum = !!_data.fnum ? _data.fnum : '-';
        return fnum + ' / ' + anum + '<br/>' + forgAndFdst;
    },
    moveTargetMonitoringLabel(id, position) {
        if (this.$route.params &&
            this.$route.params.type &&
            this.$route.params.type === 'ground-monitoring' &&
            this.monitorPlaneLabel[id]) {
            this.monitorPlaneLabel[id].move(position);
        }
    },
    removeTargetMonitoringLabel(id) {
        if (this.monitorPlaneLabel[id]) {
            this.monitorPlaneLabel[id].setMap(null);
            delete this.monitorPlaneLabel[id];
        }
    },
    removeAllMonitoringLabel() {
        for (let id in this.monitorPlaneLabel) {
            this.removeTargetMonitoringLabel(id);
        }
        this.monitorPlaneLabel = {};
    },


    //----------------------------获取航班详细信息------------------------------//
    fetchDetailsInfo(params, type) {
        let self = this;
        type === 'update' || self.showFlightDetailsAside('loading');
        self.$caxios({
            url: Urls.fetchDetailsInfoUrl,
            method: 'get',
            params: params
        }, AxiosType.Token)
            .then(data => self.fetchDetailsInfoSuccess(data.data))
            .catch(err => self.fetchDetailsInfoError(err));
    },
    fetchDetailsInfoSuccess(data) {
        let self = this;
        self.showFlightDetailsAside('show');
        //服务数据
        let obj = {},
            aircraftList = data.aircraft,
            flyDataList = data.fly_data,
            flyTraceList = data.fly_trace || [],
            fnumList = data.fnum;
        //配置数据
        let xAxisData = [],
            heightName = 'Height(m)',
            heightData = [],
            speedName = 'Speed(km/h)',
            speedData = [];
        if (aircraftList.length !== 0) {
            obj.angle = aircraftList.angle ? aircraftList.angle + '°' : '-';
            obj.anum = aircraftList.anum ? aircraftList.anum : '-';
            obj.aType = aircraftList.atype ? aircraftList.atype : '-';
            obj.aTypeName = aircraftList.atypename ? aircraftList.atypename : '-';
            obj.type = obj.aTypeName + '(' + obj.aType + ')';
            obj.height = aircraftList.height ? decimal2(aircraftList.height) + ' m' : '-';
            obj.speed = aircraftList.speed ? decimal2(aircraftList.speed) + ' km/h' : '-';
            obj.id = aircraftList._id ? aircraftList._id : '-';
            let position = aircraftList.position.length === 0 ? {lat: 0, long: 0} : aircraftList.position;
            obj.lat = position.lat;
            obj.long = position.long;
        }
        if (flyDataList.length !== 0) {
            let _agoList = flyDataList.ago,
                _total = flyDataList.total;
            if (_agoList.length !== 0) {
                obj.distance = _agoList.distance ? meterToKiloMeter(_agoList.distance) + 'KM' : '0';
                obj.time = _agoList.time ? calculateSecond(_agoList.time) : '-';
            }
            if (_total.length !== 0) {
                obj.totalDistance = _total.distance ? meterToKiloMeter(_total.distance) + 'KM' : '0';
                obj.duration = _total.time ? calculateSecond(_total.time) : '-';
            }
            let __percent = Number(_agoList.distance) * 100 / Number(_total.distance);
            __percent = __percent <= 100 && __percent >= 0 ? __percent : 0;
            obj.processPrecent = __percent + '%';
        }
        if (fnumList.length !== 0) {
            obj.airline = fnumList.airname ? fnumList.airname : '-';
            obj.code3 = fnumList.fnum3 ? fnumList.fnum3 : '-';
            obj.code2 = fnumList.fnum2 ? fnumList.fnum2 : '-';
            obj.forg = fnumList.forg ? fnumList.forg : '-';
            obj.forgName = fnumList.forg_aptname ? fnumList.forg_aptname : '-';
            obj.fdst = fnumList.fdst ? fnumList.fdst : '-';
            obj.fdstName = fnumList.fdst_aptname ? fnumList.fdst_aptname : '-';
            let arrList = fnumList.arr, depList = fnumList.dep;
            if (arrList && arrList.length !== 0) {
                obj.STA = arrList.scheduled_arrtime ? arrList.scheduled_arrtime : '-';
                obj.ETA = arrList.estimated_arrtime ? arrList.estimated_arrtime : '-';
            }
            if (depList && depList.length !== 0) {
                obj.STD = depList.scheduled_deptime ? depList.scheduled_deptime : '-';
                obj.ATD = depList.actual_deptime ? depList.actual_deptime : '-';
            }
        }
        self.renderPolyline(flyTraceList);
        self.setDetailData(obj);
        self.$nextTick(() => {
            //生成图表数据
            if (flyTraceList && flyTraceList.length !== 0) {
                for (let index = 0; index < flyTraceList.length; index++) {
                    let item = flyTraceList[index],
                        updatetime = item.updatetime || Math.ceil(Date.now() / 1000),
                        height = item.height || 0,
                        speed = item.speed || 0;
                    xAxisData.push(dateFormate(new Date(updatetime * 1000), 'yyyy-MM-dd hh:mm'));
                    heightData.push(Number(height));
                    speedData.push(Number(speed).toFixed(2));
                }
            }
            self.initEchartsLine(xAxisData, heightName, heightData, speedName, speedData);
        });
    },
    fetchDetailsInfoError(err) {//ok
        let self = this;
        self.showFlightDetailsAside('hide');
        self.$Message.error(self.$t('m.error.flightNONotFound'));
    },
    setEcharts(options) {
        let self = this;
        if (!self.detailEcharts) {
            self.detailEcharts = echarts.init(document.getElementById('speed-height-chart'));
        } else {
            self.detailEcharts.clear();
        }
        self.detailEcharts.setOption(options);
    },
    initEchartsLine(xAxisData, seriesName, seriesData, seriesName2, seriesData2) {
        let self = this,
            options = {
                color: ['#64BCEC', '#F8BD23'],
                legend: {
                    data: ['Height(m)', 'Speed(km/h)'],
                    x: 'right',
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: function (params) {
                        return params[0].name + '<br />' + params[0].seriesName + ': ' + params[0].value + ' KM<br />' + params[1].seriesName + ': ' + params[1].value + ' km/h';
                    },
                    position: function (point, params, dom, rect, size) {
                        return [16, point[1]]
                    }
                },
                grid: {
                    top: 20,
                    bottom: 40,
                    left: 5,
                    right: 5
                },
                backgroundColor: '#fff',
                graphic: [
                    {
                        type: 'image',
                        id: 'logo',
                        left: 'center',
                        top: 'center',
                        z: 10,
                        bounding: 'raw',
                        style: {
                            image: waterIcon,
                            width: 150,
                            height: 55,
                            opacity: 0.6
                        }
                    }, {
                        type: 'text',
                        z: 100,
                        left: 0,
                        bottom: 10,
                        style: {
                            fill: '#333',
                            text: 'SOURCE: VariFlight',
                            font: '10px arial'
                        }
                    }, {
                        type: 'text',
                        z: 100,
                        right: 0,
                        bottom: 10,
                        style: {
                            fill: '#333',
                            text: 'FISC.VariFlight.com',
                            font: '10px arial'
                        }
                    }
                ],
                xAxis: [
                    {
                        splitLine: {show: false},//去除网格线
                        type: 'category',
                        boundaryGap: false,
                        data: xAxisData,
                        axisLabel: {
                            show: false
                        }
                    }
                ],
                yAxis: [
                    {
                        splitLine: {show: false},//去除网格线
                        type: 'value',
                        axisLabel: {
                            show: false
                        }
                    },
                    {
                        splitLine: {show: false},//去除网格线
                        type: 'value',
                        axisLabel: {
                            show: false
                        }
                    }
                ],
                series: [
                    {
                        name: seriesName,
                        type: 'line',
                        data: seriesData,
                        yAxisIndex: 0,
                        xAxisIndex: 0
                    },
                    {
                        name: seriesName2,
                        type: 'line',
                        data: seriesData2,
                        yAxisIndex: 1,
                        xAxisIndex: 0
                    }
                ]
            };
        self.setEcharts(options);
    },

    //----------------------------搜索航班信息------------------------------//
    buildSearchFnumParams(searchCode) {
        return {
            fnum: searchCode,
            querydate: dateFormate((new Date()), 'yyyy-MM-dd')
        }
    },
    isEmptyFnumData(data) {
        return !data || !data.fnum || !data.fnum.fnum2;
        // if (!data || !data.fnum || !data.fnum.fnum2) return true;
        // let aircraft = data.aircraft;
        // for (let key in aircraft) {
        //     let value = aircraft[key];
        //     if (key === 'position') {
        //         if (value.length > 0) return false;
        //     } else {
        //         if (value) return false;
        //     }
        // }
        // return (data.fly_data || []).length === 0 &&
        //     (data.forest_fly_trace || []).length === 0;
    },
    fetchSearchFnumData(params) {
        // console.log('轮询单个航班！');
        let self = this;
        if (self.isFetchPlanes || !self.isADSBPath() || self.isGroundMonitor) return;

        self.clearTimer();
        self.isFetchPlanes = true;
        self.$caxios({
            url: Urls.fetchDetailsInfoUrl,
            method: 'get',
            params: params
        }, AxiosType.Token)
            .then(data => self.fetchSearchFnumSuccess(data))
            .catch(err => self.fetchSearchFnumError(err));
    },
    fetchSearchFnumSuccess(data) {
        let self = this;
        self.isFetchPlanes = false;
        self.pollCount += 1;
        if (self.errorCount > 0) {
            self.errorCount = 0;
        }

        let rdata = data.data,
            isEmpty = self.isEmptyFnumData(rdata);
        if (isEmpty) {
            self.searchError(self.$t('m.error.straceNotFound'));
            return false;
        }

        self.detailInfo = rdata;
        let flyTrace = rdata.fly_trace || [],
            lastFlyTrace = flyTrace[flyTrace.length - 1] || {},
            lastPosition = lastFlyTrace.position || {lat: 0, long: 0},
            markerPosition = {lat: lastPosition.lat, lng: lastPosition.long},
            aType = 'A306',
            angle = isNaN(Number(lastFlyTrace.angle)) ? 0 : Number(lastFlyTrace.angle),
            height = isNaN(Number(lastFlyTrace.height)) ? 0 : Number(lastFlyTrace.height);
        self.map.panTo(markerPosition);
        if (self.planeMarkers['searchFlight']) {
            let marker = self.planeMarkers['searchFlight'],
                color = marker.isClick ? 'r' : 'y';
            marker.setPosition(markerPosition);
            marker.setIcon(self.getPlanesIcon(color, angle, aType));
            marker.setZIndex(self.heightToZIndex(height));
            marker.angle = angle;
            marker.aType = aType;
            marker.height = height;
            //生成飞机轨迹, 打开左侧信息栏
            if (marker.isClick) {
                self.renderPolyline(flyTrace);
                self.fetchDetailsInfoSuccess(self.detailInfo);
                self.clickPlaneLabel && self.clickPlaneLabel.move(markerPosition);
            }
        } else {
            //生成飞机marker，并设置选中状态；取消选中状态时，隐藏飞行轨迹和左侧信息栏
            self.generateSearchTargetPlaneMarker({
                position: markerPosition,
                icon: self.getPlanesIcon('y', angle, aType),
                zIndex: self.heightToZIndex(height),
                id: 'searchFlight',
                angle: angle,
                aType: aType,
                height: height,
                map: self.map,
                isClick: false,
                isHover: false
            });
        }
        self.pollFnumData();
    },
    fetchSearchFnumError(err) {
        let self = this;
        self.isFetchPlanes = false;
        self.errorCount += 1;
        if (self.errorCount >= 3) {
            self.searchError(err);
        } else {
            self.pollFnumData();
        }
    },
    pollFnumData() {
        let self = this,
            code = (self.$route.params || {}).value;
        if (!code) return false;

        self.timer = setTimeout(() => {
            let dparams = self.buildSearchFnumParams(code.toUpperCase());
            self.fetchSearchFnumData(dparams);
        }, self.interval);
    },
    generateSearchTargetPlaneMarker(markerOption) {
        let self = this,
            marker = new google.maps.Marker(markerOption);
        google.maps.event.addListener(marker, 'click', function () {
            self.clickSearchTargetMarker(this);
        });
        google.maps.event.addListener(marker, 'mouseover', function () {
            self.mouseoverSearchTargetMarker(this);
        });
        google.maps.event.addListener(marker, 'mouseout', function () {
            self.mouseoutSearchTargetMarker(this);
        });
        self.clickSearchTargetMarker(marker);
        self.planeMarkers['searchFlight'] = marker;
    },
    clickSearchTargetMarker(marker) {
        let status = marker.isClick;
        if (status) {
            //已经是选中状态，取消选中
            this.freeTargetPlaneMarker()
        } else {
            marker.isClick = true;
            //选中
            let angle = marker.angle,
                aType = marker.aType;
            marker.setIcon(this.getPlanesIcon('r', angle, aType))
            //生成飞机轨迹, 打开左侧信息栏, 生成飞机标签
            this.clickPlaneLabel = new Layers(marker.getPosition(), this.$route.params.value.toUpperCase(), this.map, 'plane-label')
            this.renderPolyline(this.detailInfo.fly_trace);
            this.fetchDetailsInfoSuccess(this.detailInfo)
        }
    },
    mouseoverSearchTargetMarker(marker) {
        if (!marker.isClick) {
            let angle = marker.angle,
                aType = marker.aType;
            marker.setIcon(this.getPlanesIcon('r', angle, aType));
        }
    },
    mouseoutSearchTargetMarker(marker) {
        if (!marker.isClick) {
            let angle = marker.angle,
                aType = marker.aType;
            marker.setIcon(this.getPlanesIcon('y', angle, aType))
        }
    },

    //----------------------------航线Polyline------------------------------//
    renderPolyline(data) {
        this.clearFlightPolyline();
        if (data.length !== 0) {
            let lastPos = null,
                count = data.length;
            for (let i = 0; i < count - 1; i++) {
                let item = data[i],
                    itemNext = data[i + 1],
                    pos = item.position || {lat: 0, long: 0},
                    posNext = itemNext.position || {lat: 0, long: 0},
                    _pos = {lat: pos.lat, lng: pos.long},
                    _posNext = {lat: posNext.lat, lng: posNext.long},
                    path = [_pos, _posNext],
                    height = item.height,
                    colorVal = this.getColorByHeight(height);
                if (i === count - 2) {
                    lastPos = _posNext
                }
                this.flightPolyline.push(this.addPolyline(path, colorVal));
            }
            let marker = null;
            for (let id in this.planeMarkers) {
                let _marker = this.planeMarkers[id];
                if (_marker.isClick) {
                    marker = _marker
                }
            }
            if (marker) {
                let lastPath = [lastPos, marker.getPosition()],
                    lastColor = marker.height ? this.getColorByHeight(marker.height) : '#ffffff';
                this.flightPolyline.push(this.addPolyline(lastPath, lastColor));
            }
        }
    },
    addPolyline(path, colorVal) {
        let self = this;
        return new google.maps.Polyline({
            path: path,
            strokeWeight: 3,
            strokeOpacity: .6,
            strokeColor: colorVal,
            map: self.map
        });
    },
    clearFlightPolyline() {
        if (this.flightPolyline.length !== 0) {
            this.flightPolyline.forEach(item => {
                item.setMap(null);
                item = null;
            });
            this.flightPolyline = [];
        }
    },
    addMonitorPolyline(path) {
        let self = this,
            lineObj = new google.maps.Polyline({
                path: path,
                strokeWeight: 4,
                strokeOpacity: 1,
                strokeColor: '#222'
            });
        lineObj.setMap(self.map);
        self.flightPolyline.push(lineObj);
    },
    addPrePolyline(path) {
        let self = this,
            preLineObj = new google.maps.Polyline({
                path: path,
                strokeOpacity: 0,
                icons: [{
                    icon: {
                        path: 'M 0,-1 0,1',
                        strokeOpacity: 1,
                        strokeWeight: 1,
                        scale: 4,
                        strokeColor: "#000"
                    },
                    offset: '0',
                    repeat: '20px'
                }]
            });
        preLineObj.setMap(self.map);
        self.flightPolyline.push(preLineObj);
    },

    //----------------------------通用方法------------------------------//
    //通用方法：清除定时器
    clearTimer() {
        let self = this;
        if (self.timer) {
            clearTimeout(self.timer);
            // console.log('轮询clearTimer:', this.timer);
        }
    },
    //通用方法：清空marker
    clearAllMarkers(isMonitor) {
        isMonitor = !!isMonitor;
        let self = this;
        if (!isMonitor) {//飞行航班
            if (Object.keys(self.planeMarkers).length > 0) {
                for (let id in self.planeMarkers) {
                    let marker = self.planeMarkers[id];
                    marker.setMap(null);
                    marker = null;
                }
                self.planeMarkers = {};
            }
            if (Object.keys(self.boundsPlanes).length > 0) {
                self.boundsPlanes = {};
            }
        } else {//地面监控
            if (Object.keys(self.monitorPlaneMarkers).length > 0) {
                for (let id in self.monitorPlaneMarkers) {
                    let marker = self.monitorPlaneMarkers[id];
                    marker.setMap(null);
                    marker = null;
                }
                self.monitorPlaneMarkers = {};
            }
            if (Object.keys(self.monitorBoundsPlanes).length > 0) {
                self.monitorBoundsPlanes = {};
            }
        }
    },
    //通用方法：清空覆盖物
    clearAllCover() {
        this.clearTimer();
        this.clearAllMarkers(false);
        this.clearAllMarkers(true);
        this.clearFlightPolyline();
        this.showFlightDetailsAside('hide');
        this.removeAllMonitoringLabel();
        this.clearLabelLayer('click');
        this.clearLabelLayer('hover');
    },
    //通用方法：获取飞机图标
    getPlanesIcon(type, angle, atype) {
        let t = Number(this.round_to_15(angle)),
            zoom = this.map.getZoom(),
            n = '',
            _size = PlaneSize[atype] || 'M';
        switch (zoom) {
            case 18:
            case 17:
            case 16:
            case 15:
            case 14:
            case 13:
            case 12:
            case 11:
            case 10:
            case 9:
            case 8:
                n = "l";
                break;
            case 7:
            case 6:
            case 5:
                n = "n";
                break;
            case 4:
            case 3:
            case 2:
            case 1:
                n = "s";
                break;
            default:
                n = "n"
        }
        let s = PlaneSprite[n][_size][t];
        return {
            url: planesIcon['planes-' + type + '-' + n],
            size: new google.maps.Size(s[0], s[1]),
            origin: new google.maps.Point(s[2], s[3]),
            anchor: new google.maps.Point(s[4], s[5])
        };
    },
    //通用方法：根据高度获取颜色
    getColorByHeight(height) {
        let hei = Number(height),
            str = '',
            colArr = ['white', '#ffe800', '#f2ff00', '#ceff00', '#cfff00', '#47ff00', '#00ff30', '#00ff6d', '#00ff97', '#00ffcc', '#00ffde', '#00f0ff', '#00c4ff', '#00aeff', '#0098ff', '#007dff', '#0058ff', '#0022ff', '#0003ff', '#3500ff', '#9700ff'];
        if (hei) {
            switch (true) {
                case hei >= 0 && hei <= 500:
                    str = colArr[0];
                    break;
                case hei >= 501 && hei <= 1000:
                    str = colArr[1];
                    break;
                case hei >= 1001 && hei <= 1500:
                    str = colArr[2];
                    break;
                case hei >= 1501 && hei <= 2000:
                    str = colArr[3];
                    break;
                case hei >= 2001 && hei <= 2500:
                    str = colArr[4];
                    break;
                case hei >= 2501 && hei <= 3000:
                    str = colArr[5];
                    break;
                case hei >= 3001 && hei <= 3500:
                    str = colArr[6];
                    break;
                case hei >= 3501 && hei <= 4000:
                    str = colArr[7];
                    break;
                case hei >= 4001 && hei <= 4500:
                    str = colArr[8];
                    break;
                case hei >= 4501 && hei <= 5000:
                    str = colArr[9];
                    break;
                case hei >= 5001 && hei <= 5500:
                    str = colArr[10];
                    break;
                case hei >= 5501 && hei <= 6000:
                    str = colArr[11];
                    break;
                case hei >= 6001 && hei <= 6500:
                    str = colArr[12];
                    break;
                case hei >= 6501 && hei <= 7000:
                    str = colArr[13];
                    break;
                case hei >= 7001 && hei <= 7500:
                    str = colArr[14];
                    break;
                case hei >= 7501 && hei <= 8000:
                    str = colArr[15];
                    break;
                case hei >= 8001 && hei <= 8500:
                    str = colArr[16];
                    break;
                case hei >= 8501 && hei <= 9000:
                    str = colArr[17];
                    break;
                case hei >= 9001 && hei <= 9500:
                    str = colArr[18];
                    break;
                case hei >= 9501 && hei <= 10000:
                    str = colArr[19];
                    break;
                case hei >= 10001:
                    str = colArr[20];
                    break;
                default:
                    str = colArr[0]; // Empty implementation..
            }
        } else {
            str = colArr[0];
        }
        return str;
    },
    //通用方法：高度转换层叠数
    heightToZIndex(height) {
        return Math.ceil(height * .1)
    },
    //通用方法：计算
    round_to_15(e) {
        if (0 == e) return "0";
        switch (e = 10 * Math.round(e / 10)) {
            case 0:
                return 0;
            case 10:
            case 20:
                return 15;
            case 30:
                return 30;
            case 40:
            case 50:
                return 45;
            case 60:
                return 60;
            case 70:
            case 80:
                return 75;
            case 90:
                return 90;
            case 100:
            case 110:
                return 105;
            case 120:
                return 120;
            case 130:
            case 140:
                return 135;
            case 150:
                return 150;
            case 160:
            case 170:
                return 165;
            case 180:
                return 180;
            case 190:
            case 200:
                return 195;
            case 210:
                return 210;
            case 220:
            case 230:
                return 225;
            case 240:
                return 240;
            case 250:
            case 260:
                return 255;
            case 270:
                return 270;
            case 280:
            case 290:
                return 285;
            case 300:
                return 300;
            case 310:
            case 320:
                return 315;
            case 330:
                return 330;
            case 340:
            case 350:
                return 345;
            case 360:
                return 0;
            default:
                return 0
        }
    },
    //通用方法：判断是否为ADSB
    isADSBPath() {
        if (this.$route.path.indexOf('ads-b') < 0) {
            this.clearTimer();
            return false;
        }
        return true;
    },
    //通用方法：解决异步请求的BUG
    resolveAsyncBug() {
        // 开始清除飞机marker
        // PS：此处清除功能是为了解决一个BUG而写的。
        // BUG发生场景：页面切换至地面监控时，会出现飞机marker是飞行航班的情况（小概率事件）！！！
        // BUG产生原因：页面切换时，轮询飞行航班定时器已经取消，但是其Success回调函数（平均耗时2秒左右）还在渲染处理中，
        //              那么在轮询地面监控数据接口返回数据前，渲染处理可能刚结束，此时planeMarkers变量就会有数据；再当轮询地面监控数据接口返回数据后，
        //              会出现之后的地面监控渲染都是update、remove操作，这时页面显示的就有飞行航班marker！！！
        // BUG解决方案：地面监控第一次获取数据时，先清一次数据，或者说延迟一次数据再渲染。
        // 结束清除飞机marker
        let self = this;
        if (self.pollCount === 1) {
            self.clearAllCover();
            self.removeAllMonitoringLabel();
        }
    }
}