require('babel-polyfill');
import getPosition from './getPosition';
import setMarker from './setMarker';

 (async function() {
  'use strict';
  const map = document.querySelector('#map');
  let markers = document.querySelector('#markers').value;
  const code    = document.querySelector('#code');


  const {coords} = await getPosition();

  const maps = new google.maps.Map(map, { //eslint-disable-line
    center: {lat: coords.latitude, lng: coords.longitude},
    zoom: 12
  });

  if(markers.length > 0){
    markers = JSON.parse(markers);
    markers.map(marker => setMarker(marker, maps));
    maps.setCenter(markers[markers.length - 1]);
    maps.setZoom(15);
    code.className="";
    code.innerHTML = `<pre>var markers = ${JSON.stringify(markers,null, 4)};</pre>`;
  }

    const aCodes = document.getElementsByTagName('pre');
    for (let i=0; i < aCodes.length; i++) {
        hljs.highlightBlock(aCodes[i]); //eslint-disable-line
    }






}());
