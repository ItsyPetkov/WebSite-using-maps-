var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;
var searchBox;
var markers = [];
var travelHereMarker = [];
var map;
var bikeLoc1 = {lat: 55.861456, lng: -4.250709};
var bikeLoc2 = {lat: 55.865984, lng: -4.268251};
var bikeLoc3 = {lat: 55.859925, lng: -4.256963};
var marker = [];
var goalStation;
var infoWindow;

var directionsService;
var directionsDisplay;

/*Code modified from Google Maps JS API Documentation: https://developers.google.com/maps/documentation/javascript/examples/places-searchbox */
function initMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            currentPos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            map = new google.maps.Map(document.getElementById('map'), {
                center: {lat: position.coords.latitude, lng: position.coords.longitude},
                zoom: 14,
                mapTypeId: 'roadmap',
                disableDefaultUI: true
            });
            directionsService = new google.maps.DirectionsService;
            directionsDisplay = new google.maps.DirectionsRenderer;
            setInterval(moveStickMan, 3000);
            directionsDisplay.setMap(map);
            var bikeImage = 'images/bike.png';


            var bike1 = new google.maps.Marker({position: bikeLoc1, map: map, icon: bikeImage});
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
        });
    }
}

function addMarker(location, map, marker) {
    travelHereLocation(location, map, marker);
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
        window.location.reload();

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
    var geocoder = new google.maps.Geocoder;
    geocoder.geocode({'location': location}, function (results, status) {
        if (status === 'OK') {
            if (results[0]) {
                console.log(results[0]);
                travelHerePlace(results[0], map, marker);
            } else {
                window.alert('No results found');
            }
        } else {
            window.alert('Geocoder failed due to: ' + status);
        }
    });
}
function setGoal() {
    infoWindow.close();

}
function travelHerePlace(place, map, marker) {
    if (marker[0] != null)
        marker[0].setMap(null);

    var icon_ = place.icon === undefined ? 'images/bike.png' : place.icon;
    console.log(place);
    var icon = {
        url: icon_,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
    };

    // Create a marker for each place.
    var newMarker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });
    travelHere();
    var contentString = '<div id="content">' +
        '<h1 id="firstHeading" class="firstHeading">' + (place.name === undefined ? place.formatted_address : place.name) + '</h1>' +
        '</div>' +
        '<div id="bodyContent">' +
        '<input id="chooseDestination" type="button" value="Confirm" onclick="setGoal()" >' +
        '</div>';

     infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    marker[0] = newMarker;

    infowindow.open(map, newMarker);
}

function moveStickMan() {
    var stickmanIcon = 'images/stickman.png';
    navigator.geolocation.getCurrentPosition(function (position) {
        currentPos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        if(goalStation !== undefined && google.maps.geometry.spherical.computeDistanceBetween(currentPos, goalStation) <= 10){
            //an alert :D;
        }

        var icon = {
            url: stickmanIcon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
        };

        // Create a marker for each place.
        if (marker[0] != null)
            marker[0].setMap(null);
        marker[0] = new google.maps.Marker({
            map: map,
            icon: icon,
            position: currentPos
        });
    });
}

function travelHere() {
    var currentPos;
    var latlang1 = new google.maps.LatLng(bikeLoc1.lat, bikeLoc1.lng);
    var latlang2 = new google.maps.LatLng(bikeLoc2.lat, bikeLoc2.lng);
    var latlang3 = new google.maps.LatLng(bikeLoc3.lat, bikeLoc3.lng);
    console.log(latlang1);
    console.log(latlang2);
    console.log(latlang3);
    var bikeStation = [];

    navigator.geolocation.getCurrentPosition(function (position) {
        currentPos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        var dist1 = google.maps.geometry.spherical.computeDistanceBetween(currentPos, latlang1);
        var dist2 = google.maps.geometry.spherical.computeDistanceBetween(currentPos, latlang2);
        var dist3 = google.maps.geometry.spherical.computeDistanceBetween(currentPos, latlang3);
        if (dist1 <= dist2) {
            if (dist1 <= dist3) {
                bikeStation.push({
                    location: latlang1,
                    stopover: true
                })
            } else {
                bikeStation.push({
                    location: latlang3,
                    stopover: true
                });
            }
        } else {
            if (dist2 <= dist3) {
                bikeStation.push({
                    location: latlang2,
                    stopover: true
                });
            } else {
                bikeStation.push({
                    location: latlang3,
                    stopover: true
                });
            }
        }
        console.log(bikeStation);

        directionsService.route({
            origin: currentPos,
            waypoints: bikeStation,
            destination: travelHereMarker[0].position,
            travelMode: 'BICYCLING'
        }, function (response, status) {
            if (status === 'OK') {
                directionsDisplay.setDirections(response);
            }
        });
    });
}