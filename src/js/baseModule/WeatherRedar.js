import Urls from 'src@/js/config/urls';
import {AxiosType} from '../config/enums';

function ImageOverlay(bounds, image, map) {
    this.bounds_ = bounds;
    this.image_ = image;
    this.map_ = map;
    this.div_ = null;
    this.setMap(map);
}

ImageOverlay.prototype = new google.maps.OverlayView();

ImageOverlay.prototype.onAdd = function () {
    let div = document.createElement('div');
    div.style.borderStyle = 'none';
    div.style.borderWidth = '0px';
    div.style.position = 'absolute';

    // Create the img element and attach it to the div.
    let img = document.createElement('img');
    img.src = this.image_;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.position = 'absolute';
    div.appendChild(img);

    this.div_ = div;

    // Add the element to the 'overlayLayer' pane.
    let panes = this.getPanes();
    panes.overlayLayer.appendChild(div);
};

ImageOverlay.prototype.draw = function () {
    let overlayProjection = this.getProjection();
    let sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
    let ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());

    // Resize the image's div to fit the indicated dimensions.
    let div = this.div_;
    div.style.left = sw.x + 'px';
    div.style.top = ne.y + 'px';
    div.style.width = (ne.x - sw.x) + 'px';
    div.style.height = (sw.y - ne.y) + 'px';
};

ImageOverlay.prototype.onRemove = function () {
    if (this.div_) {
        this.div_.parentNode.removeChild(this.div_);
        this.div_ = null;
    }
};

export default {
    //获取天气雷达列表
    fetchRadarList() {
        let self = this;
        self.$caxios({
            url: Urls.weather.fetchRadar,
            method: 'get'
        }, AxiosType.Token)
            .then(data => {
                self.radarWeatherList = data;
                self.playbackWeatherImage();
            })
            .catch(err => self.radarWeatherList = []);
    },

    //回放天气图片
    playbackWeatherImage() {
        let self = this;
        self.autoPlayback(self.weatherRadarIndex);
    },

    //定时回放
    autoPlayback(i) {
        let self = this,
            count = self.radarWeatherList.length,
            latLngs = self.radarWeatherList[i][2],
            imageUrl = self.radarWeatherList[i][0],
            bounds = new google.maps.LatLngBounds(
                {lat: latLngs[0], lng: latLngs[1]},
                {lat: latLngs[2], lng: latLngs[3]}
            );
        self.renderWeatherImage(imageUrl, bounds);

        self.weatherRadarTimer = setTimeout(() => {
            if (self.weatherRadarIndex === count) {
                self.weatherRadarIndex = 0;
            }
            self.autoPlayback(self.weatherRadarIndex++);
        }, 1000);
    },

    //渲染图片
    renderWeatherImage(imageUrl, bounds) {
        let self = this;
        self.removeWeatherImageLayer();
        self.weatherImageLayer = new ImageOverlay(bounds, imageUrl, self.map);
    },

    //清除图片
    removeWeatherImageLayer() {
        let self = this;
        if (self.weatherImageLayer) {
            self.weatherImageLayer.setMap(null);
            self.weatherImageLayer = null;
        }
    }
}