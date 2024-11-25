mapboxgl.accessToken = mapkey;
console.log('mapToken');
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/streets-v12', // style URL
center: [78.4772, 17.4065], // starting position [lng, lat]
zoom: 9 // starting zoom
});