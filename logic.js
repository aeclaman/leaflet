// Creating map object
var map = L.map("map", {
  center: [37.09, -95.71],
  zoom: 4
});

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
}).addTo(map);

// var link = "http://data.beta.nyc//dataset/0ff93d2d-90ba-457c-9f7e-39e47bf2ac5f/resource/" +
// "35dd04fb-81b3-479b-a074-a27a37888ce7/download/d085e2f8d0b54d4590b1e7d1f35594c1pediacitiesnycneighborhoods.geojson";
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";//all..past week

var colors = ["chartreuse", "gold", "orange", "darkorange", "orangered", "firebrick"];

// Function that will determine the color of a earthquake sight based on the magnitude
function chooseColor(magnitude) {
  return colors[Math.ceil(magnitude)-1];
}

var geojson;

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
     return ("<h5>" + layer.feature.properties.place + "</h5><hr><h5>Magnitude: " + layer.feature.properties.mag + "</h5>");
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
      list_elements.push("<li><i>Amy Claman </i></li>")
      div.innerHTML += "<ul>" + list_elements.join("") + "</ul>";
      return div;
  }
legend.addTo(map);
