require('babel-polyfill');
import getPosition from './getPosition';
import setMarker from './setMarker';

 (async function() {
  'use strict';
  const map = document.querySelector('#map');
  let markers = document.querySelector('#markers').value;
  const code  = document.querySelector('#code');

  const {coords} = await getPosition();

  document.getElementById('local').value = JSON.stringify({lat: coords.latitude, lng: coords.longitude});

  const maps = new google.maps.Map(map, { //eslint-disable-line
    center: {lat: coords.latitude, lng: coords.longitude},
    zoom: 12
  });

  if(markers.length > 0){
    markers = JSON.parse(markers);
    const markersOnMap = markers.map(marker => setMarker(marker, maps));

    let bounds = new google.maps.LatLngBounds();//eslint-disable-line
    markersOnMap.map(marker => bounds.extend(marker.getPosition()));

    maps.fitBounds(bounds);

    code.className="";
    code.innerHTML = `<pre>var markers = ${JSON.stringify(markers,null, 4)};</pre>`;
  }

    const aCodes = document.getElementsByTagName('pre');
    for (let i=0; i < aCodes.length; i++) {
        hljs.highlightBlock(aCodes[i]); //eslint-disable-line
    }






}());
