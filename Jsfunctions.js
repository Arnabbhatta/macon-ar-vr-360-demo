mapboxgl.accessToken = 'pk.eyJ1IjoiZHVzaHlhbnRndXJ1IiwiYSI6ImNqdXVwY3BzZTA4ZWY0Zm55NmhlbWExZm0ifQ.Es5kCBI0Rxb9DANHkIApKQ';
const status = document.querySelector('#status');
var UserMarker,end,markerPos,nearestPoint;
var points =[];
var popup;
// GEOJSON files to get bus stop information and rout , coordinates, name, link, etc
var BusStop = {
    "type": "FeatureCollection","features": [
      {
        "type": "Feature",
        "properties": {
          "Name": "Just Tap'd Macon",
          "Link": "https://goo.gl/maps/Fpx9oUHj7Ne99Yo7A"
        },
        "geometry": {
          "coordinates": [
            -83.631208,
            32.8363
          ],
          "type": "Point"
        },
        "id": "8c447edfeafa0f6920782ccd9e2f17e7"
      },
  {
    "type": "Feature",
    "properties": {
      "Name": "Macon Gov. Center(City+Council)",
      "Link": "https://goo.gl/maps/F5cv9keiuyCnuHr6A"
    },
    "geometry": {
      "coordinates": [
        -83.632122,
        32.835971
      ],
      "type": "Point"
    },
    "id": "0f12c3cc771bd7e8958c062c07e84520"
  },
  {
    "type": "Feature",
    "properties": {
      "Name": "Macon Junction",
      "Link": "https://goo.gl/maps/qxmeX1997SptCYC76"
    },
    "geometry": {
      "coordinates": [
        -83.624511,
        32.833316
      ],
      "type": "Point"
    },
    "id": "75e3675cca7f3683d57e9b03c13f83b8"
  },
  {
    "type": "Feature",
    "properties": {
      "Name": "Rosa Parks Square",
      "Link": "https://goo.gl/maps/t6rhToC3wMLK8zddA"
    },
    "geometry": {
      "coordinates": [
        -83.631769,
        32.836662
      ],
      "type": "Point"
    },
    "id": "3b2e83d88e507cea0e5e4beffc81d571"
  },

  

  {
    "type": "Feature",
    "properties": {
      "Name": "St Joseph Catholic Church",
      "Link": "https://goo.gl/maps/1pak4CphTWtitGoA9"
    },
    "geometry": {
      "coordinates": [
        -83.633738,
        32.836911
      ],
      "type": "Point"
    },
    "id": "40c3cd65b7def8814991747d35d05f2c"
  },
    ]
};

var mapDirections = new MapboxDirections({
    accessToken: mapboxgl.accessToken,
    controls: {
        inputs: true
    },
    styles: [{
        'id': 'directions-route-line',
        'type': 'line',
        'source': 'directions',
        'layout': {
            'line-cap': 'round',
            'line-join': 'round'
        },
        'paint': {
            'line-color': '#8AB3F0',
            'line-width': 3
        },
        'filter': [
            'all',
            ['in', '$type', 'LineString'],
            ['in', 'route', 'selected']
        ]
    },{
        'id': 'directions-origin-point',
        'type': 'circle',
        'source': 'directions',
        'paint': {
            "circle-radius": 18,
            "circle-color": "#3bb2d0"
        },
        'filter': [
            'all',
            ['in', '$type', 'Point'],
            ['in', 'marker-symbol', '']
        ]
    },{
        'id': 'directions-destination-point',
        'type': 'circle',
        'source': 'directions',
        'paint': {
            "circle-radius": 18,
            "circle-color": "#8a8bc9"
        },
        'filter': [
            'all',
            ['in', '$type', 'Point'],
            ['in', 'marker-symbol', '']
        ]
    }]
});

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/dushyantguru/ck3pd9bgb47na1cqpgd4vd4hg',
    center: [-83.624511,32.833316],
    zoom: 18,
    pitch: 35
});
var points = turf.featureCollection(BusStop.features); 

var directions = new MapboxDirections({
		 accessToken: mapboxgl.accessToken
		});

var geoSuccess = function(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    status.textContent = latitude + '@' + longitude;
    console.log(latitude + '. poss .' + longitude);
	  map.flyTo({center: [latitude,longitude],zoom:18});
    setTimeout(function() {f12(status.textContent);}, 500);
};
// initialize the map canvas to interact with later
navigator.geolocation.getCurrentPosition(geoSuccess);



//Function to set marker on current location 
function f12(p1) {
        arra = p1.split("@", 2);     
        UserMarker = new mapboxgl.Marker({
                draggable: false, // to drag marker - true, else false
            })
                 .setLngLat([arra[1],arra[0]])  // .setLngLat([-83.624511,32.833316]) //
            .addTo(map);
            UserMarker.on('dragend', onDragEnd);
			
           	       mapDirections.setOrigin([arra[1],arra[0]]); // mapDirections.setOrigin([-83.624511,32.833316]) //
                  onDragEnd();
    }

// if drag marker will get the nearest point from current location 
    var Nearest_Place;
    function onDragEnd() {
         markerPos = UserMarker.getLngLat();
         mapDirections.setOrigin([markerPos.lng,markerPos.lat])
        console.log(markerPos.lat + '. markerPos from end.' + markerPos.lng+'..');
        var from = turf.point([markerPos.lng, markerPos.lat]);
        var options = {units: 'metres'};
        var nearest = turf.nearestPoint(from, points);
        var distance = turf.distance(from, nearest, options);
        nearestPoint = nearest.geometry.coordinates;
        Nearest_Place = nearest.properties.Name;

        mapDirections.setDestination(nearestPoint);
        console.log(nearestPoint +' Nearest stop: '+nearest.properties.Name + '... Distance: '+distance);
    }


    // get selected value from drop down 
    function GetSelectedValue()
    {
        if(popup != null)
        popup.remove();
        	mapDirections.removeDestination();
        var e = document.getElementById("bus-stop-list");
        var strUser = e.options[e.selectedIndex].value;
        var StopN = e.options[e.selectedIndex].id;
        nearestPoint = strUser;
        arra = nearestPoint.toString().split(",", 2);
        map.flyTo({center: [arra[0],arra[1]],zoom:18});
       SetFlyPopup(nearestPoint,StopN);
	 
	
    }

    // set bus stop icon and value to drop down menu 
    BusStop.features.forEach(function(marker) {
        // create a DOM element for the marker
        var el = document.createElement('div');
        el.className = 'marker';
        el.layer = 'MaconData';
        el.style.backgroundImage = 'url(img/BusStop1.png)';
        el.style.width = 1 + 'px';
        el.style.height = 1 + 'px';
      
        $('<option id="'+ marker.properties.Name +'"  value="'+ marker.geometry.coordinates +'">' + marker.properties.Name + '</option>').appendTo('#bus-stop-list');
        new mapboxgl.Marker(el)
            .setLngLat(marker.geometry.coordinates)
            .addTo(map);
       
    });

    map.on('click', function(e) {
if(popup != null)
popup.remove();

var features = map.queryRenderedFeatures(e.point, {
    layers: ['MaconData'] 
}); 
if (features.length == 0) {
    return;
}
var feature = features[0];
Nearest_Place = feature.properties.Name;
nearestPoint = feature.geometry.coordinates;
var popup = new mapboxgl.Popup({
        offset: [0, -230]
    })
    .setLngLat(feature.geometry.coordinates)
.setHTML('<div id="container"> <div class="box1" ><img src="img/BusStop.png"/></div><div class="box1" style="font-size:20px;"><p>'+feature.properties.Name+'</p></div>'+
'<div class="box1" id="redbox"><a id="link" target="_blank" onclick = "openLink()"><img src="img/360View.png" style="width:50px;height:50px;" /></a></div>'+
'<div class="box1" ><button class="btn success" onclick = "ClickOnRouteMe()" >Route Me</button></div></div>'+
'<label id="NameLink" style="font-size:0px;width:0px;">' + feature.properties.Link + '</label>')
    .setLngLat(feature.geometry.coordinates)
    .addTo(map);          

});

 //function to click on 360 button open another link in new tab
 function openLink()
    {
        document.getElementById("link").href = document.getElementById('NameLink').innerText;
        if(popup != null)
        popup.remove();
    }
     // Add geolocate control to the map. becon of the top right side 
     map.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true
    }), 'top-right');
    
    
  map.addControl(directions, 'top-left');
    
	 
  // change curser to pointer on laptop view 
    map.on('mouseenter', 'MaconData', function() {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'MaconData', function() {
        map.getCanvas().style.cursor = '';
    });


    function ClickOnRouteMe() {
    if(popup != null)
    popup.remove();
    mapDirections.setDestination(nearestPoint)
    }

    function SetFlyPopup(a1,s1)
{
    if(popup != null)
    popup.remove();

    arra = a1.toString().split(",", 2);
    //console.log("set fly called"+ s1);
    BusStop.features.forEach(function(marker) {       
      if(s1 == marker.properties.Name)
      {
        Nearest_Place = s1;
          if(popup != null)
            popup.remove();
        popup = new mapboxgl.Popup({
            offset: [0, -230]
        })
        .setLngLat(marker.geometry.coordinates)
        .setHTML('<div id="container"> <div class="box1" ><img src="img/BusStop.png"/></div><div class="box1" style="font-size:20px;"><p>'+marker.properties.Name+'</p></div>'+
'<div class="box1" id="redbox"><a id="link" target="_blank" onclick = "openLink()"><img src="img/360View.png" style="width:50px;height:50px;" /></a></div>'+
'<div class="box1" ><button class="btn success" onclick = "ClickOnRouteMe()" >Route Me</button></div></div>'+
'<label id="NameLink" style="font-size:0px;width:0px;">' + marker.properties.Link + '</label>')
       // .setLngLat(marker.geometry.coordinates)
        .addTo(map);    
    
      }
    });
}


