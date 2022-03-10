mapboxgl.accessToken = 'pk.eyJ1Ijoic2lkbWFwbHl0aXgiLCJhIjoiY2t1Mnk3N2gyMTN2azJydDlzZGR0czk3cSJ9.i3TnmC90i4BjU1q1Fv07CA';

// mapbox://styles/mapbox/satellite-v9 Mapbox Satellite
// mapbox://styles/mapbox/satellite-streets-v11 Mapbox Satellite Streets
// mapbox://styles/mapbox/streets-v11 Mapbox Streets
// mapbox://styles/mapbox/outdoors-v11 Mapbox Outdoors
// mapbox://styles/mapbox/light-v10 Mapbox Light
// mapbox://styles/mapbox/dark-v10 Mapbox Dark
// mapbox://styles/mapbox/navigation-day-v1 Mapbox Navigation Day
// mapbox://styles/mapbox/navigation-night-v1 Mapbox Navigation Night
// mapbox://styles/sidmaplytix/ckug26u3d457g18rz7ytk85tz Satellite Buildings
// mapbox://styles/sidmaplytix/cl0lkv9ue000h14nuavg94syc Satellite Street Buildings

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/sidmaplytix/cl0lkv9ue000h14nuavg94syc', // style URL
    center: [-0.123340113695852, 51.500917433778056], // starting position [lng, lat]
    zoom: 16, // starting zoom
    pitch: 80,
    bearing: 0,
    antialias: true // create the gl context with MSAA antialiasing, so custom layers are antialiased
    });

const deltaDistance = 100; // pixels map pans when key down

const deltaDegrees = 25; // degrees map rotates when key down

const popup = new mapboxgl.Popup({closeOnClick: false})
    .setLngLat([-0.123340113695852, 51.500917433778056])
    .setHTML('<p>WASD keys for flight navigation control</p>')
    .addTo(map)

function easing(t) {

  return t * (2 - t);

}

map.on('load', () => {

    map.getCanvas().focus();

    map.getCanvas().addEventListener(

      'keydown',
      (e) => {
        e.preventDefault();
        if (e.which === 87) {
          // forward / up
          map.panBy([0, -deltaDistance], {
            easing: easing
          });
        } else if (e.which === 83) {
          // backward / down
          map.panBy([0, deltaDistance], {
            easing: easing
          });
        } else if (e.which === 65) {
          // left
          map.easeTo({
            bearing: map.getBearing() - deltaDegrees,
            easing: easing
          });
        } else if (e.which === 68) {
          // right
          map.easeTo({
            bearing: map.getBearing() + deltaDegrees,
            easing: easing
          });          
        }
      },
      true
    );

    map.addSource('mapbox-dem',{
        'type': 'raster-dem',
        'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
        'tileSize': 512,
        'maxZoom': 14
    });
    map.setTerrain({
        'source': 'mapbox-dem',
        'exaggeration': 0.8
    });
    map.addLayer({
        'id': 'sky',
        'type': 'sky',
        'paint': {
            'sky-opacity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                0,
                0,
                5,
                0.3,
                8,
                1
            ],
            'sky-type': 'atmosphere',
            'sky-atmosphere-sun': [0.0, 0.0],
            'sky-atmosphere-sun-intensity': 5
        }
    });

    map.addControl(new mapboxgl.NavigationControl());

});