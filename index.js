let geoFire;
let map;
let markers = [];
let infoWindow;
let db;
let center = { lat: 50.4501, lng: 30.5234 };

// The following example creates a map, where we will put nearby venues around lat: 50.4501, lng: 30.5234.
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center
  });
  infoWindow = new google.maps.InfoWindow();

  initFirebase();
  query(center);
}

function initFirebase() {
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyDQC4B_wD3oMu3a_P9qEsXywReMMZ-C7tQ",
    authDomain: "composting-app.firebaseapp.com",
    databaseURL: "https://composting-app-default-rtdb.firebaseio.com",
    projectId: "composting-app",
    storageBucket: "composting-app.appspot.com",
    messagingSenderId: "1062496151273",
    appId: "1:1062496151273:web:85a6f658110da646cef278",
    measurementId: "G-Y9GQCZQC8G"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  // Create a Firebase reference where GeoFire will store its information
  const firebaseRef = firebase.database().ref('/composting-app');
  geoFire = new geofire.GeoFire(firebaseRef);
  db = firebase.firestore();
}

function query(point) {
  const geoQuery = geoFire.query({
    center: [point.lat, point.lng],
    radius: 1
  });

  geoQuery.on('key_entered', function (key, location, distance) {
    addMarker({
      lat: location[0],
      lng: location[1],
      key
    });
  });
}

function addMarker(location) {
  const marker = new google.maps.Marker({
    position: location,
    map: map
  });

  // Show infoWindow with venue's details from Firestore
  marker.addListener('click', () => {
    var venueRef = db.collection(`compostingSites`).doc(location.key);
    venueRef.get().then((venueData) => {
      const venue = venueData.data();
      infoWindow.close();
      infoWindow.setContent(
        `<h3>${venue.name}</h3>
        <p>${venue.category} <b>${venue.rating}</b></p>`
      );
      infoWindow.open(marker.getMap(), marker);
    });
  });
  markers.push(marker);
}