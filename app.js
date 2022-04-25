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

function randomFlt(min, max, decimal) {
    const str = (Math.random() * (max - min) + min).toFixed(decimal);

    return parseFloat(str);
}

function randomInt(min, max) {
    const str = (Math.random() * (max - min) + min);

    return parseInt(str);
}

let coords;

function chooseLoc() {

  let lng;

  let lat;

  let loc;

  let lngTokyo = randomFlt(139.715538, 139.799824, 6);

  let latTokyo = randomFlt(35.652554, 35.704705, 6);
  
  let lngBangkok = randomFlt(100.478725, 100.537176, 6);
  
  let latBangkok = randomFlt(13.734216, 13.782653, 6);
  
  let lngBombay = randomFlt(72.800131, 72.838840, 6);
  
  let latBombay = randomFlt(18.930888, 18.958328, 6);
  
  let lngParis = randomFlt(2.279663, 2.324209, 6);
  
  let latParis = randomFlt(48.851727, 48.873579, 6);
  
  let lngRome = randomFlt(12.471156, 12.513041, 6);
  
  let latRome = randomFlt(41.880457, 41.900584, 6);
  
  let lngLondon = randomFlt(-0.136213, -0.102911, 6);
  
  let latLondon = randomFlt(51.491377, 51.509597, 6);

  let x = randomInt(1,6)

  if (x === 1) {
    lng = lngTokyo;
    lat = latTokyo;
    loc = "Tokyo";
  } else if (x === 2) {
    lng = lngBangkok;
    lat = latBangkok;
    loc = "Bangkok";
  } else if (x === 3) {
    lng = lngBombay;
    lat = latBombay;
    loc = "Bombay";
  } else if (x === 4) {
    lng = lngParis;
    lat = latParis;
    loc = "Paris";
  } else if (x === 5) {
    lng = lngRome;
    lat = latRome;
    loc = "Rome";
  } else if (x === 6) {
    lng = lngLondon;
    lat = latLondon;
    loc = "London";
  }

  return [lng, lat, loc];

}

coords = chooseLoc()

let startBearing = randomInt(0, 360);

let speed  = 0;

let heading = 180;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/sidmaplytix/cl0lkv9ue000h14nuavg94syc', // style URL
    center: [coords[0], coords[1]], // starting position [lng, lat]
    zoom: 16, // starting zoom
    pitch: 80,
    bearing: startBearing,
    antialias: true // create the gl context with MSAA antialiasing, so custom layers are antialiased
    });

const deltaDistance = 100; // pixels map pans when key down

const deltaDegrees = 25; // degrees map rotates when key down

function easing(t) {

  return t * (2 - t);

}

let lastKey;

const keys = {
  a: {
      pressed: false
  },
  d: {
      pressed: false
  },
  w: {
      pressed: false
  },
  s: {
      pressed: false
  }
}

function animate() {
  window.requestAnimationFrame(animate);
  if (keys.w.pressed && lastKey === 'w') {
    // forward
    speed = 0.00005
  } else if (keys.s.pressed && lastKey === 's') {
    // back
    speed = -0.00005
  } else if (keys.a.pressed && lastKey === 'a') {
    // left turn
    heading -=0.5;
  } else if (keys.d.pressed && lastKey === 'd') {
    // right turn
    heading +=0.5;
  }

  var rad = heading * Math.PI / 180;
  coords[0] += Math.sin(rad) * speed;
  coords[1] += Math.cos(rad) * speed;
  map.setBearing(heading);
  map.setCenter([coords[0], coords[1]])    

}

map.on('load', () => {

  map.getCanvas().focus();

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

  document.getElementById("location").innerText = coords[2];

  map.getCanvas().addEventListener('keydown', (event) => {
    switch (event.key) {
      case 'w':
        keys.w.pressed = true;
        lastKey = 'w';
        break;
      case 'a':
        keys.a.pressed = true;
        lastKey = 'a';
        break;
      case 's':
        keys.s.pressed = true;
        lastKey = 's';
        break;
      case 'd':
        keys.d.pressed = true;
        lastKey = 'd';
    };
  });

  map.getCanvas().addEventListener('keyup', (event) => {
    switch (event.key) {
      case 'w':
        keys.w.pressed = false;
        break;
      case 'a':
        keys.a.pressed = false;
        break;
      case 's':
        keys.s.pressed = false;
        break;
      case 'd':
        keys.d.pressed = false;
    };
  });

  animate();

});
