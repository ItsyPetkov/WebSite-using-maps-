var searchBox;
var markers = [];
var travelHereMarker = [];
var map;
var bikeLoc = [];
var bikeLocations = [];
var goals = [];
var marker = [];
var infoWindow_;
var globalBoolean = false;
var finalPrice;

var directionsService;
var directionsDisplay;
var contentString;

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

            bikeLoc.push({lat: 55.861456, lng: -4.250709});
            bikeLoc.push({lat: 55.865984, lng: -4.268251});
            bikeLoc.push({lat: 55.859925, lng: -4.256963});

            var bikes = [];

            bikeLoc.forEach(function (bike) {
                bikes.push(new google.maps.Marker({position: bike, map: map, icon: bikeImage}))
            });

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
    if (!globalBoolean) {
        var geocoder = new google.maps.Geocoder;
        geocoder.geocode({'location': location}, function (results, status) {
            if (status === 'OK')
                if (results[0]) {
                    console.log(results[0]);
                    travelHerePlace(results[0], map, marker);
                }
        });
    }
}

function setGoal() {
    infoWindow_.close();
    if (!globalBoolean) {
        goals.push(bikeLocations[0]);
        goals.push(travelHereMarker[0].position);
        globalBoolean = true;
    } else {
        recreateRoute();
    }
}

function travelHerePlace(place, map, marker) {
    if (marker[0] != null)
        marker[0].setMap(null);

    var icon_ = place.icon === undefined ? 'images/bike.png' : place.icon;

    travelHere(map, (place.name === undefined ? place.formatted_address : place.name), marker);

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
    marker[0] = newMarker;

}

function moveStickMan() {
    navigator.geolocation.getCurrentPosition(function (position) {
        currentPos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        if (goals.length !== 0 && google.maps.geometry.spherical.computeDistanceBetween(currentPos, goals[0]) <= 100) {
            if (goals.length === 1) {
                globalBoolean = false;
                finalWindowBruv(map, marker[0]);
            } else {
                var object = calcCost(currentPos, travelHereMarker[0].position);
                infoWindow(map, "", marker[0], object, "Rental");
            }
            goals.shift();
        }

        var stickmanIcon = goals.length === 1 ? 'images/cyclist-location.png' : 'images/stickman.png' ;

        var icon = {
            url: stickmanIcon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
        };

        // Create a marker for each place.
        if (marker[0] == null)
            marker[0] = new google.maps.Marker({
                map: map,
                icon: icon,
                position: currentPos
            });
        else
            marker[0].setPosition(currentPos);
    });
}

function travelHere(map, name, marker) {
    var currentPos;
    var latlang = [];
    bikeLoc.forEach(function (bike) {
        latlang.push(new google.maps.LatLng(bike.lat, bike.lng));
    });

    var bikeStation = [];

    navigator.geolocation.getCurrentPosition(function (position) {
        currentPos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        bikeLocations = [];
        var distance;
        var location;
        latlang.forEach(function (latlng) {
            var dist_ = google.maps.geometry.spherical.computeDistanceBetween(currentPos, latlng);
            if (distance === undefined || dist_ < distance) {
                distance = dist_;
                location = latlng;
            }

        });
        bikeLocations.push(location);
        bikeStation.push({location: location, stopover: true});

        directionsService.route({
            origin: currentPos,
            waypoints: bikeStation,
            destination: travelHereMarker[0].position,
            travelMode: 'BICYCLING'
        }, function (response, status) {
            if (status === 'OK') {
                var object = calcCost(bikeStation[0].location, travelHereMarker[0].position);
                infoWindow(map, name, marker[0], object, "Route");
                directionsDisplay.setDirections(response);


            }
        });
    });
}

function infoWindow(map, name, marker, object, confirm) {
    contentString = '<div id="content">' +
        '<h1 id="firstHeading" class="firstHeading">' + name + '</h1>' +
        '</div>' +
        '<div id="bodyContent">' +
        '<p>' + 'Rate: £' + object.rate + ' / 30 mins</p>' +
        '<p>' + 'Estimated time: ' + object.avgt + ' min(s)</p>' +
        '<p>' + 'Estimated cost: £' + object.avgc + '</p>' +
        '<input id="chooseDestination" type="button" value="Confirm ' + confirm + ' " onclick="setGoal()" >' +
        '</div>';
    infoWindow_ = new google.maps.InfoWindow({
        content: contentString
    });
    infoWindow_.open(map, marker);
}

function calcCost(bikeLoc, destLoc) {
    var distance = google.maps.geometry.spherical.computeDistanceBetween(bikeLoc, destLoc) / 1000;
    var estTime = ((distance / 15) * 60);
    var baseCost = 1.0;
    if (distance > 0 && distance <= 1) {
        costMultiplier = 1;
    } else if (distance > 1 && distance <= 2) {
        costMultiplier = 0.9;
    } else if (distance > 2 && distance <= 5) {
        costMultiplier = 0.7;
    } else if (distance > 5) {
        costMultiplier = 0.5;
    }
    var rate = baseCost * costMultiplier;
    var avgCost = (Math.ceil(estTime / 30)) * rate;
    finalPrice = avgCost;
    var avgTime = Math.round(estTime, 2);
    return {
        rate: rate,
        avgc: avgCost,
        avgt: avgTime
    };
}

function recreateRoute() {
    var currentPos;
    navigator.geolocation.getCurrentPosition(function (position) {
        currentPos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        directionsService.route({
            origin: currentPos,
            destination: goals[0],
            travelMode: 'BICYCLING'
        }, function (response, status) {
            if (status === 'OK') {
                directionsDisplay.setDirections(response);
            }
        });
    });
}

function finalWindowBruv(map, marker) {
    contentString = '<div id="content">' +
        '<h1 id="firstHeading" class="firstHeading">Congratulations</h1>' +
        '</div>' +
        '<div id="bodyContent">' +
        '<p>' + 'Cost: £' + finalPrice + '</p>' +
        '<input id="chooseDestination" type="button" value="Plan another trip" onclick="newFunction()" >' +
        '</div>';
    infoWindow_ = new google.maps.InfoWindow({
        content: contentString
    });
    infoWindow_.open(map, marker);
}

function newFunction() {
    infoWindow_.setMap(null);
    directionsDisplay.setMap(null);
    directionsDisplay = new google.maps.DirectionsRenderer;
    directionsDisplay.setMap(map);
}