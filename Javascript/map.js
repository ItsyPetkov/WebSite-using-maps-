var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;
var searchBox;
var markers = [];
var map;

/*Code modified from Google Maps JS API Documentation: https://developers.google.com/maps/documentation/javascript/examples/places-searchbox */
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 55.8642, lng: -4.255},
        zoom: 14,
        mapTypeId: 'roadmap',
        disableDefaultUI: true
    });
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
        addMarker(event.latLng, map);
    });

    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function () {
        addPlaces(searchBox, map);
    });
}

function addMarker(location, map) {
    // Add the marker at the clicked location, and add the next-available label
    // from the array of alphabetical characters.
    var marker = new google.maps.Marker({
        position: location,
        label: labels[labelIndex++ % labels.length],
        map: map
    });
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

function addPlaces(searchBox, map   ) {
    var places = searchBox.getPlaces();
    console.log(places);
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
                '<input id="chooseDestination" type="submit" value="Travel here by bike" >' +
                '</div>';

            var infowindow = new google.maps.InfoWindow({
                content: contentString
            });

            markers.push(newMarker);
            infowindow.open(map, newMarker);

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

                var contentString = '<div id="content">' +
                    '<h1 id="firstHeading" class="firstHeading">' + place.name + '</h1>' +
                    '</div>' +
                    '<div id="bodyContent">' +
                    '<input id="chooseDestination" type="submit" value="Travel here by bike" >' +
                    '</div>';

                var infowindow = new google.maps.InfoWindow({
                    content: contentString
                });

                infowindow.open(map, newMarker);
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

