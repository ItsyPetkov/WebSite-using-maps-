var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;
var searchBox;
var markers = [];
var travelHereMarker = [];
var map;

var directionsService;
var directionsDisplay;

/*Code modified from Google Maps JS API Documentation: https://developers.google.com/maps/documentation/javascript/examples/places-searchbox */
function initMap() {
    directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer;
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 55.8642, lng: -4.255},
        zoom: 14,
        mapTypeId: 'roadmap',
        disableDefaultUI: true
    });

    directionsDisplay.setMap(map);
    //image doesn't exist
    var bikeImage = 'bike.png';

    var bikeLoc1 = {lat: 55.861456, lng: -4.250709};
    var bikeLoc2 = {lat: 55.865984, lng: -4.268251};
    var bikeLoc3 = {lat: 55.859925, lng: -4.256963};

    var bike1 = new google.maps.Marker({position: bikeLoc1, map: map, title: 'Bike 1', icon: bikeImage});
    var bike2 = new google.maps.Marker({position: bikeLoc2, map: map, icon: bikeImage});
    var bike3 = new google.maps.Marker({position: bikeLoc3, map: map, icon: bikeImage});

    var input = document.getElementById('pac-input');
    searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
    });

    google.maps.event.addListener(map, 'click', function (event) {
        addMarker(event.latLng, map, travelHereMarker);
    });

    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function () {
        addPlaces(searchBox, map);
    });
}

function addMarker(location, map, marker) {
    travelHereLocation(location, map, marker);
}

function addLocationMarker() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            infoWindow.open(map);
            map.setCenter(pos);
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }

    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
    }
}

function addPlaces(searchBox, map) {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
        return;
    }

    // Clear out the old markers.
    markers.forEach(function (marker) {
        marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();

    if (places.length == 1) {
        places.forEach(function (place) {
            travelHerePlace(place, map, travelHereMarker);

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        })
    }
    else if (places.length > 1) {
        alert("Please select the correct destination or search again");

        places.forEach(function (place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            var newMarker = new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            });

            newMarker.addListener('click', function () {
                travelHerePlace(place, map, travelHereMarker);
            });


            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }

            markers.push(newMarker)
        })
    }

    map.fitBounds(bounds);
}

function travelHereLocation(location, map, marker) {
    if (marker[0] != null)
        marker[0].setMap(null);

    var newMarker = new google.maps.Marker({
        position: location,
        label: "",
        map: map
    });

    var contentString = '<div id="content">' +
        '<h1 id="firstHeading" class="firstHeading">' + '</h1>' +
        '</div>' +
        '<div id="bodyContent">' +
        '<input id="chooseDestination" type="button" value="Travel here by bike" onclick="travelHere()" >' +
        '</div>';

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    marker[0] = newMarker;
    infowindow.open(map, newMarker);
}

function travelHerePlace(place, map, marker) {
    if (marker[0] != null)
        marker[0].setMap(null);

    var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
    };

    // Create a marker for each place.
    var newMarker = new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
    });

    var contentString = '<div id="content">' +
        '<h1 id="firstHeading" class="firstHeading">' + place.name + '</h1>' +
        '</div>' +
        '<div id="bodyContent">' +
        '<input id="chooseDestination" type="button" value="Travel here by bike" onclick="travelHere()" >' +
        '</div>';

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    marker[0] = newMarker;

    infowindow.open(map, newMarker);
}

function travelHere() {
    if (navigator.geolocation) {
        var currentPos;

        navigator.geolocation.getCurrentPosition(function (position) {
            currentPos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            directionsService.route({
                origin: currentPos,
                destination: travelHereMarker[0].position,
                travelMode: 'BICYCLING'
            }, function (response, status) {
                if (status === 'OK') {
                    directionsDisplay.setDirections(response);
                } else {
                    window.alert('Directions request failed due to ' + status);
                }
            });
        });
    }
}