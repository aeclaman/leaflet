// Creating map object
var map = L.map("map", {
  center: [37.09, -95.71],
  zoom: 4
});

// Adding tile layers
var greyscale = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
}).addTo(map);

var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets-satellite",
  accessToken: API_KEY
});

var basic = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.run-bike-hike",
  accessToken: API_KEY
});

var baseMaps = {
  Greyscale: greyscale,
  Satellite: satellite,
  Basic: basic
};

// Link to earthquate coordinate data
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"; //all..last 30 days

var colors = ["chartreuse", "gold", "orange", "darkorange", "orangered", "firebrick"];

// Function that will determine the color of a earthquake sight based on the magnitude
function chooseColor(magnitude) {
  return colors[Math.ceil(magnitude)-1];
}

var geojson;
var dateTime;

// Grabbing our GeoJSON data
d3.json(link, function(data) {
  // Creating a geoJSON layer with the retrieved data
  geojson = L.geoJson(data, {
    style: function(feature) {
      return {
        radius: feature.properties.mag * 5,
        color: "white",
        fillColor: chooseColor(feature.properties.mag),
        fillOpacity: 0.75,
        weight: 1.5
      };
    },
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    }
  }).bindPopup(function (layer) {
      dateTime = new Date(layer.feature.properties.time);
      return ("<h5>" + layer.feature.properties.place + "</h5><hr><h5>Magnitude: " + layer.feature.properties.mag + "</h5><h5>Occured: " + dateTime.toLocaleDateString("en-US") + "</h5>");
  }).addTo(map);
});

  // Set up the legend
  var legend = L.control({position: 'bottomright'});
  legend.onAdd=function(map){
      var div=L.DomUtil.create('div','legend');

      var labels=["0-1","1-2","2-3","3-4","4-5","5+"];
      var list_elements = [];

      for (var i = 0; i < labels.length; i++) {
        list_elements.push("<li style=\"background-color: " + colors[i] + "\"></li>  " + labels[i] + "<br>");
      }
      list_elements.push("<li><i>Amy Claman </i></li>")//Add name to html per hw instructions
      div.innerHTML += "<ul>" + list_elements.join("") + "</ul>";
      return div;
  }
legend.addTo(map);

// Add the layer control to the map
L.control.layers(baseMaps).addTo(map);
