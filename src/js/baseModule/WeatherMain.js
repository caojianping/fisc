import GoogleMap from './GoogleMap.js';
import AirportJson from '../config/airport.js';
import Traffic from './WeatherTraffic.js';
import Radar from './WeatherRedar.js';
import Airport from './WeatherAirport.js';
import HeaderAnimation from './HeaderAnimation.js';

const aptIconURL = require("../../images/airport-marker-icon.png");
const aptIconActiveURL = require("../../images/airport-marker-icon-active.png");
const delayIconURL = require("../../images/delay.png");
const warnIconURL = require("../../images/teqing.png");

let aptIcon = {
        url: aptIconURL,
        size: new google.maps.Size(20, 20),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(10, 20)
    },
    aptIconActive = {
        url: aptIconActiveURL,
        size: new google.maps.Size(32, 32),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(16, 32)
    },
    delayIcon = {
        url: delayIconURL,
        size: new google.maps.Size(32, 32),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(16, 32)
    },
    warnIcon = {
        url: warnIconURL,
        size: new google.maps.Size(24, 31),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(12, 31)
    };

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
    div.style.top = (ne.y - (div.offsetHeight + 20)) + 'px';
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

export default Object.assign(Traffic, Radar, Airport, {
    initWeather() {
        let self = this;
        self.map = new GoogleMap('map', 5, self.initPlanes).initMap();
        self.routerController();
        self.fetchRadarList();
    },
    routerController() {
        let self = this;
        self.fetchWarnList();
        self.initWeatherDetails();
    },

    //----------------------生成机场标签---------------------//
    setAirportsMarker(isTraffic) {
        isTraffic = !!isTraffic;

        let warnList = this.warnList;
        this.clearAptMarkers();

        let activeCode = this.$route.params.apt.toUpperCase(),
            activePos = null,
            specialList = warnList.special,
            delayList = warnList.delay;
        for (let id in AirportJson) {
            let apt = AirportJson[id],
                _pos = {lat: apt.aptlat, lng: apt.aptlon},
                _icon = aptIcon,
                aptMarker = null;

            //如果是当前机场
            if (activeCode === id) {
                activePos = _pos;
                _icon = aptIconActive;
                this.renderClickedAptLabel(id, apt)
            }

            if (isTraffic) {
                //如果是特情机场
                if (Object.keys(specialList).length !== 0) {
                    for (let code in specialList) {
                        if (id === code) {
                            _icon = warnIcon;
                            //生成label标签
                            code === this.$route.params.apt.toUpperCase() && this.renderSpecialAptLabel(id, apt, specialList[code])
                        }
                    }
                }
                //如果是延误机场
                if (Object.keys(delayList).length !== 0) {
                    for (let code in delayList) {
                        if (id === code) {
                            _icon = delayIcon;
                            //如果也是特情机场 同时选中了该机场
                            if (code === this.$route.params.apt.toUpperCase()) {
                                specialList[code] ? (
                                    this.renderSpecialAndDelayAptLabel(id, apt, specialList[code])
                                ) : (
                                    this.renderDelayAptLabel(id, apt)
                                )
                            }
                        }
                    }
                }
            }

            aptMarker = new google.maps.Marker({
                icon: _icon,
                position: _pos,
                code: id,
                map: this.map
            });

            //注册marker事件
            let self = this;
            google.maps.event.addListener(aptMarker, 'click', function () {
                self.clickAptMarker(this);
            });
            google.maps.event.addListener(aptMarker, 'mouseover', function () {
                self.hoverAptMarker(this);
            });
            google.maps.event.addListener(aptMarker, 'mouseout', function () {
                self.outAptMarker(this);
            });

            activeCode === id && this.clickLayer.open(this.map, aptMarker);
            this.aptMarkers[id] = aptMarker;
        }
        activePos && this.map.setCenter(activePos);
    },
    //生成点击了的普通机场标签
    renderClickedAptLabel(id, apt) {
        let _html = '',
            _aptName = '';
        if (this.$i18n.locale === 'zh-CN') {
            _aptName = apt.aptcname
        } else {
            _aptName = apt.aptname
        }
        _html =
            `<div class="clicked-apt"><div class="label-codes"><span>${id}/${apt.apticao}</span><small>${_aptName}</small></div></div>`
        this.renderLabelLayer('click', _html)
    },
    //生成特情的机场标签
    renderSpecialAptLabel(id, apt, weather) {
        let _html = '',
            _aptName = '';
        if (this.$i18n.locale === 'zh-CN') {
            _aptName = apt.aptcname
        } else {
            _aptName = apt.aptname
        }
        //中文情况下 展示特情原因
        let _ul = ''
        if (this.$i18n.locale === 'zh-CN') {
            _ul = '<ul class="weather-apt-ul">'
            for (let i = 0; i < weather.length; i++) {
                _ul += '<li>' + weather[i] + '</li>';
            }
            _ul += '</ul>'
        }
        let _status = this.$t('m.weather.airportStatus.specialSituation')
        _html =
            `<div class="clicked-apt">
                <div class="label-codes">
                    <span>${id}/${apt.apticao}</span><small>${_aptName}</small>
                </div>
                <div class="label-status">
                    <i class="fa fa-warning"></i><span> ${_status}</span>
                </div>
            </div>`;
        _html += _ul;
        this.renderLabelLayer('click', _html)
    },
    //生成特情加延误的机场标签
    renderSpecialAndDelayAptLabel(id, apt, weather) {
        let _html = '',
            _aptName = '';
        if (this.$i18n.locale === 'zh-CN') {
            _aptName = apt.aptcname
        } else {
            _aptName = apt.aptname
        }
        //中文情况下 展示特情原因
        let _ul = ''
        if (this.$i18n.locale === 'zh-CN') {
            _ul = '<ul class="weather-apt-ul">'
            for (let i = 0; i < weather.length; i++) {
                _ul += '<li>' + weather[i] + '</li>';
            }
            _ul += '</ul>'
        }
        let _status = this.$t('m.weather.airportStatus.largeAreaDelay')
        _html =
            `<div class="clicked-apt">
                <div class="label-codes">
                    <span>${id}/${apt.apticao}</span><small>${_aptName}</small>
                </div>
                <div class="label-status">
                    <i class="fa fa-warning"></i><span> ${_status}</span>
                </div>
            </div>`;
        _html += _ul;
        this.renderLabelLayer('click', _html)
    },
    //生成延误的机场标签
    renderDelayAptLabel(id, apt) {
        let _html = '',
            _aptName = '';
        if (this.$i18n.locale === 'zh-CN') {
            _aptName = apt.aptcname
        } else {
            _aptName = apt.aptname
        }
        let _status = this.$t('m.weather.airportStatus.largeAreaDelay')
        _html =
            `<div class="clicked-apt">
                <div class="label-codes">
                    <span>${id}/${apt.apticao}</span><small>${_aptName}</small>
                </div>
                <div class="label-status">
                    <i class="fa fa-warning"></i><span> ${_status}</span>
                </div>
            </div>`;
        this.renderLabelLayer('click', _html)
    },

    //----------------------机场AptMarker---------------------//
    clickAptMarker(marker) {
        let path = this.$route.path;
        path = path.replace(/[a-zA-Z]{3}$/, marker.code);
        this.$router.push(path);
    },
    hoverAptMarker(marker) {
        let code = marker.code,
            text = '';
        if (AirportJson[code]) {
            let apt = AirportJson[code],
                _aptName = '';
            if (this.$i18n.locale === 'zh-CN') {
                _aptName = apt.aptcname
            } else {
                _aptName = apt.aptname
            }
            text = `<span>${code}/${apt.apticao}</span><small>${_aptName}</small>`
        } else {
            text = 'unKnow'
        }
        marker.code !== this.$route.params.apt.toUpperCase() && this.renderHoverLayer(marker.getPosition(), text);
    },
    outAptMarker(marker) {
        this.clearHoverLayer();
    },
    clearAptMarkers() {
        for (let id in this.aptMarkers) {
            let marker = this.aptMarkers[id];
            marker.setMap(null);
        }
        this.aptMarkers = {};
    },

    //----------------------机场LabelLayer---------------------//
    renderLabelLayer(type, html) {
        if (type === 'click') {
            this.clickLayer && this.clickLayer.close();
            this.clickLayer = new google.maps.InfoWindow({
                content: html
            });
        }
    },
    clearLabelLayer(layer) {
        if (layer) {
            layer.setMap(null);
            layer = null;
        }
    },
    renderHoverLayer(pos, text) {
        this.clearHoverLayer();
        this.hoverLayer = new Layers(pos, text, this.map, 'hover-apt')
    },
    clearHoverLayer() {
        this.hoverLayer && this.hoverLayer.setMap(null);
        this.hoverLayer = null;
    },

    //----------------------UI、Common---------------------//
    toggleTraffic() {
        this.isTraffic = !this.isTraffic;
        this.setAirportsMarker(this.isTraffic);
    },
    toggleRadar() {
        let self = this;
        self.isRadar = !self.isRadar;
        if (!self.isRadar) {
            //关闭定时回放定时器、清除天气雷达图片
            self.clearRadarTimer();
            self.removeWeatherImageLayer();
        } else {
            //重启定时回放定时器、渲染天气雷达图片
            self.playbackWeatherImage();
        }
    },
    changeAptList(value) {
        let self = this;
        if (!value) {
            self.allPlanesData = [];
            return;
        }

        let code = value.toUpperCase(),
            arrs = [];
        for (let id in AirportJson) {
            let item = AirportJson[id],
                apticao = (item.apticao || '').toUpperCase();
            if (id.toUpperCase().indexOf(code) > -1 || apticao.indexOf(code) > -1) {
                // arrs.push({
                //     code3: id,
                //     code4: item.apticao,
                //     aptName: self.$i18n.locale === 'zh-CN' ? item.aptcname : item.aptname
                // });
                let aptName = self.$i18n.locale === 'zh-CN' ? item.aptcname : item.aptname;
                arrs.push({
                    label: id + '/' + item.apticao + '(' + aptName + ')',
                    value: id
                });
            }
        }
        self.allPlanesData = arrs.slice(0, 15);
    },
    selectAptList(value) {
        if (!value) return;

        let self = this,
            routePath = (self.$i18n.locale === 'zh-CN' ? '/cn' : '') + '/weather/' + value.toUpperCase();
        self.$router.push(routePath);
    },
    toggleHistoryWeatherList() {
        this.weatherDetail.isHistoryMore = !this.weatherDetail.isHistoryMore;
    },
    toggleFutureWeatherList() {
        this.weatherDetail.isFutureMore = !this.weatherDetail.isFutureMore;
    },
    clearRadarTimer() {
        this.weatherRadarTimer && clearTimeout(this.weatherRadarTimer);
    }
}, HeaderAnimation);