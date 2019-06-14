//The latest significant earthquake Urls
//var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson";
//var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";
//var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson";

// Perform a JSON request on the query URL
d3.json(queryUrl, function(data) {
  // Call createFeatures function passing the response from the earthquake URL
  createFeatures(data.features);
});

function chooseColor(magnitudex) {
  if (magnitudex <= 12) {
     return "#FB451F"
  }
  else if(magnitudex > 12 && magnitudex <= 18) {
    return "#D63C1B"
  }
  else if(magnitudex > 18 && magnitudex <= 24) {
    return "#B43418"
  }
  else if(magnitudex > 24 && magnitudex <= 30) {
    return "#922A14"
  }
  else if(magnitudex > 30 && magnitudex <= 36) {
    return "#712110"
  }
  else if(magnitudex > 36 && magnitudex <= 42) {
    return "#5B1B0D"
  }
  else
    return "#41130A"
}

function createFeatures(earthquakeData) {

  // Function to run once for each feature in the list of features from earthquakeData
  // Add popup to each feature describing the place and magnitude of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.mag + " magnitude, " + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  // Create a GeoJSON layer containing the features from earthquakeData object
  // Run onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
      var geojsonMarkerOptions = {
        radius: 6*feature.properties.mag,
        fillColor: chooseColor(6*feature.properties.mag)
      };
      return L.circleMarker(latlng, geojsonMarkerOptions);
    }

  });

  // Send the resulting earthquakes layer containing features and add them to the Map
  createMap(earthquakes);

}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery � <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery � <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  var legendMaps = {
    position: "bottomright"
  };

  // Now, create the map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Finally, create a layer control
  // Pass in the baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // Create a legend to display information about the map
  var info = L.control({
    position: "bottomright"
  });

  // When the layer control is added, insert a div with the class of "legend"
  info.onAdd = function(myMap) {
    var div = L.DomUtil.create("div", "legend");

    div.innerHTML='<h2>Legends</h2>';
    div.innerHTML+='<hr>';
    div.innerHTML+='<div style="color:#FB451F"><b>Less than 2 Magnitude</b></div';
    div.innerHTML+='<div style="color:#D63C1B"><b>Magnitude between 2 and 3</b></div';
    div.innerHTML+='<div style="color:#B43418"><b>Magnitude between 3 and 4</b></div';
    div.innerHTML+='<div style="color:#922A14"><b>Magnitude between 4 and 5</b></div';
    div.innerHTML+='<div style="color:#712110"><b>Magnitude between 5 and 6</b></div';
    div.innerHTML+='<div style="color:#5B1B0D"><b>Magnitude between 6 and 7</b></div';
    div.innerHTML+='<div style="color:#41130A"><b>Magnitude greater than 7</b></div';

    return div;
  };

  // Add the info legend to the map
  info.addTo(myMap);

}
