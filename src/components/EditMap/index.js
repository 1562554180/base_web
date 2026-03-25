import React from 'react';
import { connect } from 'dva';
import config from 'utils/config';
import _ from 'lodash';
import PointMarker from 'assets/normal_router.png';

function BigeMap() {};
const google = window.google;
const centerLng = config.map && config.map.lng ? config.map.lng : 30.54024807;
const centerLat = config.map && config.map.lat ? config.map.lat : 103.06966686;
let markers = [];
const markerArray = {};
const lineArray = {};

export default class CitySearch extends Map {
  constructor(props){
    super(props);
    this.state={
      isSearch: true,
      id: 'mac_map',
      markerFormVisible: false,
      polylineFormVisible: false,
    };
  }

  componentDidMount() {
    super.componentDidMount();
    window.removeMarker = this.removeMarker;
    const googleMap = new BigeMap();
    const myOptions = {
      center: new google.maps.LatLng(centerLng, centerLat),
      zoom: 6,
      panControl:true,
      signInControl:false,
      rotateControl:true,
      streetViewControl:false,
      mapTypeControl:false,
      zoomControl:true,
      zoomControlOptions:{
        position:google.maps.ControlPosition.RIGHT_CENTER,
      },
    };
    const map = new google.maps.Map(document.getElementById('mac_map'), myOptions);
    this.map = map;
    map.mapTypes.set('google', googleMap);
    map.setMapTypeId('google');
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.data, this.props.data)) {
      this.addMarkers(this.map, nextProps.data);
    }
  }

  addMarkers = (map, markersData) => {
    if(!markersData || markersData.length === 0) return;
    if(!map && !this.map) return;
    if(markers.length > 0) {
      markers.forEach(item => {
        item.setMap(null);
        item = null;
      });
      markers = [];
    }
    this.createMarker(map, markersData);
  }

  createMarker = (map, markersData) => {
    const path = [];
    markersData.forEach((item) => {
      const lat = item.lat * 1 || item.latitude * 1;
      const lng = item.lng * 1 || item.longitude * 1;
      path.push({lat, lng})
      const markerParams = {
        icon: PointMarker,
        position: new google.maps.LatLng(lat, lng),
        map: map || this.map,
        uid: item.mac,
        opacity: 1,
      }
      const marker = new google.maps.Marker(markerParams);
      markers.push(marker)
    })
  }

  updateDrawPolyline = (item) => {
    if(item.color && this.drawPolyline) {
      const path = this.drawPolyline.getPath()
      const strokeColor = item.color;
      const lineSymbol = {
        path: 'M 0,-1 0,1',
        strokeOpacity: 1,
        scale: 2,
        offset: 0,
        strokeColor,
      };
      const icons = [
        {
          icon: lineSymbol,
          offset: 0,
          repeat: '1px',
        },
      ];

      const edgeline = new google.maps.Polyline({
        path: path.getArray(),
        strokeWeight: 2,
        strokeOpacity: 1,
        icons,
      });
      edgeline.setMap(this.map);
      this.drawPolyline.setMap(null);
      this.drawPolyline = false;
    }
  }

  clearMap = () => {
    for(const i in markerArray) {
      if(markerArray[i]) {
        markerArray[i].setMap(null);
        delete markerArray[i]
      }
    }

    for(const i in lineArray) {
      if(lineArray[i]) {
        lineArray[i].setMap(null);
        delete lineArray[i]
      }
    }
  }

  drawedges = (edges, nodes) => {
    edges.forEach(item => {
      const strokeColor = 'black';

      const lineSymbol = {
        path: 'M 0,-1 0,1',
        strokeOpacity: 1,
        scale: 2,
        offset: 0,
        strokeColor,
      };

      const linePath = [];
      const snode = nodes[item.source]
      const tnode = nodes[item.target]
      if(nodes[item.source]) {
        linePath.push({lng: snode.lng, lat: snode.lat})
      }
      if(nodes[item.source]) {
        linePath.push({lng: tnode.lng, lat: tnode.lat})
      }
      const icons = [
        {
          icon: lineSymbol,
          offset: 0,
          repeat: '1px',
        },
      ];
      const id = `line${item.source}_${item.target}`;
      if(linePath.length > 1) {
        if(!lineArray[id]) {
          const edgeline = new google.maps.Polyline({
            path: linePath,
            strokeWeight: 2,
            strokeOpacity: 1,
            icons,
          });
          edgeline.setMap(this.map);
          lineArray[id] = edgeline;
        }
      }
    })
  }

  render() {
    return (
      <div id='mac_map' />
    )
  }
}
