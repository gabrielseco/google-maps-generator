export default function setMarker(position, map){

  const marker = new google.maps.Marker({//eslint-disable-line
   position: position,
   map: map
 });
}
