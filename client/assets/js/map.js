// Load the Visualization API and the columnchart package.
google.load('visualization', '1', {packages: ['corechart']});

var map, bikeLayer, polyline, distance;
var markers = {pointA: '', pointB: ''};
var path = [
      {lat: 36.579, lng: -118.292},  // Panama Mint Springs
      {lat: 36.24, lng: -116.832}];  // Badwater, Death Valley
var trench = {lat: 11.3499834, lng: 142.1998842};
var bikeLayerOn = false;


function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: trench,
    zoom: 12,
    styles: [{"featureType":"water","stylers":[{"color":"#19a0d8"}]},{"featureType":"administrative","elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"},{"weight":6}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#F00B42"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#efe9e4"},{"lightness":-40}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#efe9e4"},{"lightness":-20}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"lightness":100}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"lightness":-100}]},{"featureType":"road.highway","elementType":"labels.icon"},{"featureType":"landscape","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"landscape","stylers":[{"lightness":20},{"color":"#efe9e4"}]},{"featureType":"landscape.man_made","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"lightness":100}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"lightness":-100}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"hue":"#11ff00"}]},{"featureType":"poi","elementType":"labels.text.stroke","stylers":[{"lightness":100}]},{"featureType":"poi","elementType":"labels.icon","stylers":[{"hue":"#4cff00"},{"saturation":58}]},{"featureType":"poi","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#f0e4d3"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#efe9e4"},{"lightness":-25}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#efe9e4"},{"lightness":-10}]}],
    disableDefaultUI: true,
    zoomControl: true,
    scaleControl: false,
    mapTypeControl: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
      mapTypeIds: [
        google.maps.MapTypeId.ROADMAP,
        google.maps.MapTypeId.TERRAIN
      ]
    }
  });
  var elevator = new google.maps.ElevationService;
  var infowindow = new google.maps.InfoWindow({map: map});
  bikeLayer = new google.maps.BicyclingLayer();

  // Draw the path, using the Visualization API and the Elevation service.
  //displayPathElevation(path, elevator, map);

  // Add a listener for the click event. Display the elevation for the LatLng of
  // the click inside the infowindow.
  map.addListener('click', function(event) {

    if (markers.pointA == '' && markers.pointB == '') {
      path = [];
      path[0] = event.latLng;
      addPoint(event.latLng, map, 'A');
      displayLocationElevation(event.latLng, elevator, infowindow, document.getElementById('point_a_value') );

    } else if (markers.pointA != '' && markers.pointB == '') {
      path[1] = event.latLng;
      addPoint(event.latLng, map, 'B');
      distance = google.maps.geometry.spherical.computeDistanceBetween(path[0], path[1]);

      displayLocationElevation(event.latLng, elevator, infowindow, document.getElementById('point_b_value') );
      displayPathElevation(path, elevator, map);
    } else {
      polyline.setMap(null);
      markers.pointA.setMap(null);
      markers.pointB.setMap(null);
      markers.pointA = '';
      markers.pointB = '';
    }
  });
  document.getElementById("bike_layer").addEventListener("click", toggleBikeLayer);

}

function addPoint(location, map, id) {
  var image = {
    url: 'http://localhost:8000/assets/img/marker_pylon.svg',
    // This marker is 20 pixels wide by 32 pixels high.
    size: new google.maps.Size(32, 32),
    // The origin for this image is (0, 0).
    origin: new google.maps.Point(0, 0),
    // The anchor for this image is the base of the flagpole at (0, 32).
    anchor: new google.maps.Point(16, 24)
  };
  if (id == 'A') {
    markers.pointA = new google.maps.Marker({
      position: location,
      //label: id,
      icon: image,
      animation: google.maps.Animation.DROP,
      map: map
    });
  } else {
    markers.pointB = new google.maps.Marker({
      position: location,
      //label: id,
      icon: image,
      animation: google.maps.Animation.DROP,
      map: map
    });
  }
}

function locateMe(event) {
	console.log(event);
	element = event.target;
	element.style.background = '#EDEDED';
  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      map.setCenter(pos);
    }, function() {
      handleLocationError(true, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, map.getCenter());
  }
}

function handleLocationError(browserHasGeolocation, pos) {
  alert(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
}

function toggleBikeLayer() {
  if (bikeLayerOn === false) {
    bikeLayer.setMap(map);
    bikeLayerOn = true;
  } else {
    bikeLayer.setMap(null);
    bikeLayerOn = false;
  }
}

function displayLocationElevation(location, elevator, infowindow, displayElement) {
  // Initiate the location request
  elevator.getElevationForLocations({
    'locations': [location]
  }, function(results, status) {
    if (status === google.maps.ElevationStatus.OK) {
      // Retrieve the first result
      if (results[0]) {
        // Open the infowindow indicating the elevation at the clicked position.
        displayElement.value = parseFloat( (results[0].elevation/1000).toFixed(4) ) + 'm';
      } else {
      infowindow.setPosition(location);
        infowindow.setContent('No results found');
      }
    } else {

    infowindow.setPosition(location);
      infowindow.setContent('Elevation service failed: ' + status);
    }
  });
}

function displayPathElevation(path, elevator, map) {

  var lineSymbol = {
    path: 'M 0,-1 0,1',
    strokeOpacity: 1,
    scale: 5
  };
  // Display a polyline of the elevation path.
  polyline = new google.maps.Polyline({
    path: path,
    strokeColor: '#ffffff',
    strokeOpacity: 0,
    icons: [{
      icon: lineSymbol,
      offset: '0',
      repeat: '20px'
    }],
    map: map
  });

  // Create a PathElevationRequest object using this array.
  // Ask for 256 samples along that path.
  // Initiate the path request.
  elevator.getElevationAlongPath({
    'path': path,
    'samples': 100
  }, plotElevation);
}

// Takes an array of ElevationResult objects, draws the path on the map
// and plots the elevation profile on a Visualization API ColumnChart.
function plotElevation(elevations, status) {
  var chartDiv = document.getElementById('elevation_chart');
  if (status !== google.maps.ElevationStatus.OK) {
    // Show the error code inside the chartDiv.
    chartDiv.innerHTML = 'Cannot show elevation: request failed because ' +
        status;
    return;
  }
  // Create a new chart in the elevation_chart DIV.
  var chart = new google.visualization.LineChart(chartDiv);

  // Extract the data from which to populate the chart.
  // Because the samples are equidistant, the 'Sample'
  // column here does double duty as distance along the
  // X axis.
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Sample');
  data.addColumn('number', 'Elevation');
  data.addColumn({type:'string', role:'style'});
  data.addColumn({type:'string', role:'tooltip'});

  var distanceChunk = distance/elevations.length;
  //console.log(distanceChunk);
  var angles = [];
  var steep = false;
  var climb = false;
  var styles = '';
  for (var i = 0; i < elevations.length; i++) {
    if (i != 0) {
      elevationChange = (elevations[i].elevation - elevations[i-1].elevation)/distanceChunk;
      if (elevationChange > 0.03) { // UPHILL HAUL
        styles = 'color: #333333; stroke-width: 3;';
      } else if (elevationChange <= 0.03 && elevationChange > 0.005) { // UPHILL CLIMB
        climb = true;
        styles = 'color: #2199e8; stroke-width: 3;';
      } else if (elevationChange <= 0.005 && elevationChange >= -0.005) { // FLAT GROUND
        styles = 'color: #8b8b8b; stroke-width: 3;';
      } else if (elevationChange < -0.005 && elevationChange >= -0.01) { // PLEASANT DOWNHILL
        styles = 'color: #3adb76; stroke-width: 3;';
      } else if (elevationChange < -0.01 && elevationChange >= -0.03) { // MODERATE DOWNHILL
        styles = 'color: #ffae00; stroke-width: 3;';
      } else if (elevationChange < -0.03) { // STEEP DOWNHILL
        steep = true;
        styles = 'color: #ec5840; stroke-width: 3;';
      }
      //elevationChanges.push(elevationChange);
      angle = elevationChange*45;
      angles.push(angle);

      data.addRow([
        '',
        elevations[i].elevation,
        styles,
        'Elevation: '+parseFloat(elevations[i].elevation.toFixed(4))+'m\nAngle: '+parseFloat(angle.toFixed(2))+'º'
      ]);
    }
  }
  //console.log(elevationChanges);

  var sum = angles.reduce(function(a, b) { return a + b; });
  var avg = sum / angles.length;
  //alert("Average elevation change:\n" + avg + "m/m\n\nTotal elevation change:\n" + (elevations[99].elevation - elevations[0].elevation) + "m\n\nDistance:\n" + distance + "m\n\nContains steep sections?\n" + steep + "\n\nContains uphill climbs?\n" + climb);

  document.getElementById('total_distance').value = parseFloat(distance.toFixed(4) ) + 'm';
  document.getElementById('avg_incline').value = parseFloat(avg.toFixed(2) ) + 'º';

      // Draw the chart using the data within its DIV.
      chart.draw(data, {
        //height: 150,
        legend: 'none',
        titleY: 'Elevation (m)',
        backgroundColor: 'transparent',
        vAxis : {
        	gridlines: { color: '#ffffff' }
        },
        animation: {
          duration: 1000,
          easing: 'inAndOut',
          startup: true
        }
      });
}



