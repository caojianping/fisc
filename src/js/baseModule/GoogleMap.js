import GoogleMapStyles from './GoogleMapStyles.js';

export default class GoogleMap {
    constructor(el, zoom) {
        this.el = el;
        this.zoom = zoom;
    }

    initMap() {
        let mapTypeList = [],
            mapTypeId = google.maps.MapTypeId;
        for (let key in mapTypeId) {
            mapTypeList.push(mapTypeId[key]);
        }
        mapTypeList.push('openStreet');
        mapTypeList.push('mapbox');

        let map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 34.65128519895413, lng: 103.73291015625},
            zoom: this.zoom,
            maxZoom: 18,
            minZoom: 3,
            styles: GoogleMapStyles,
            backgroundColor: "#EEEEEE",
            mapTypeId: mapTypeList[2],
            streetViewControl: false,
            fullscreenControl: true,
            scaleControl: false,
            mapTypeControl: true,
            mapTypeControlOptions: {
                mapTypeIds: mapTypeList
            }
        });
        map.mapTypes.set('openStreet', new google.maps.ImageMapType({
            getTileUrl: function (coord, zoom) {
                return "http://tile.openstreetmap.org/" + zoom + "/" + coord.x + "/" + coord.y + ".png";
            },
            tileSize: new google.maps.Size(256, 256),
            name: "OpenStreetMap",
            maxZoom: 18
        }));
        map.mapTypes.set('mapbox', GoogleMapStyles);
        map.setMapTypeId('mapbox');
        return map;
    }
}