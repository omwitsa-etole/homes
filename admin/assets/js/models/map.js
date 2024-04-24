var curLat = null; //user location
var curLon = null;
const position = { lat: curLat, lng: curLon }
let marker 
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
        window.alert("no location");
    }
}
function showPosition(position) {
    curLat = position.coords.latitude;
    curLon = position.coords.longitude;
	position.lat= curLat
	position.lng=curLon 
	initMap()
}



async function initMap(loc,id) {
 
  if (position.lat === null){
    position.lat= -1.315926
	position.lng= 36.8255 
  }
  if(loc){
	  console.log("locations")
  }
  const zoom = 11
  const locations = [
	position,
  ]
  // Request needed libraries.
  //@ts-ignore
  const { Map, InfoWindow } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");
  var geocoder = new google.maps.Geocoder();
  
  const infoWindow = new google.maps.InfoWindow({
    content: "",
    disableAutoPan: true,
  });

  // The map, centered at Uluru
  const map = new Map(
    document.getElementById(id),
    {
      zoom: zoom,
      center: position,
      mapId: 'DEMO_MAP_ID',
	  styles: [{
		featureType: 'poi',
		stylers: [{ visibility: 'off' }]  // Turn off POI.
	  },
	  {
		featureType: 'transit.station',
		stylers: [{ visibility: 'off' }]  // Turn off bus, train stations etc.
	  }],
	  disableDoubleClickZoom: true,
	  streetViewControl: false,
    }
  );
  
  const locationButton = document.createElement("button");

  locationButton.textContent = "Current Location";
  locationButton.classList.add("custom-map-control-button");
  locationButton.classList.add("button-6")

  map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(locationButton);

  locationButton.addEventListener("click", () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position)=>{
			const pos = {
				lat: position.coords.latitude,
				lng: position.coords.longitude,
			  };
			map.setCenter(pos);
	  });
    } else {
      // Browser doesn't support Geolocation
      alert(false);
    }
  });
  
	const label = "N"//labels[i % labels.length];
	const pinGlyph = new google.maps.marker.PinElement({
	  glyph: label,
	  glyphColor: "white",
	})
	marker = new google.maps.marker.AdvancedMarkerElement({
	  map: map,
	  draggable: true,
	  position:position,
	  content: pinGlyph.element,
	});
	marker.addListener("click", () => {
      infoWindow.setContent("NEW LOCATION<br>"+position.lat + ", " + position.lng);
      infoWindow.open(map, marker);
    });
	map.addListener('click', function(e) {
	  const data = {}
	  data.lat = e.latLng.lat();
	  data.lng = e.latLng.lng();
	  //document.getElementsByName()
	  marker.position = data
	  geocoder.geocode({ location: data })
      .then((response) => {
		  if (response.results[0]) {
			map.setZoom(11);

			infowindow.setContent(response.results[0].formatted_address);
			infowindow.open(map, marker);
		  } else {
			window.alert("No results found");
		  }
		})
		.catch((e) => window.alert("Geocoder failed due to: " + e));
	  
	  if(document.getElementById("select-address"))document.getElementById("select-address").value = data.lat+ ":" + data.lng
	  if(document.getElementById("accountlocation"))document.getElementById("accountlocation").innerText = data.lat+ ":" + data.lng
	});


}

