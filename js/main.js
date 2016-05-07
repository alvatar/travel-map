var cityCoords = {
  "Assafora": [-9.4056, 38.8611],
  "Atenas": [23.7294, 37.9839],
  "Denver": [-104.9903, 39.7392],
  "Isle of Wight": [-1.1488, 50.6608],
  "Los Angeles": [-118.2437, 34.0522],
  "Madrid": [-3.7038, 40.4168],
  "Montreal": [-73.5673, 45.5017],
  "Poros": [23.4717, 37.5206],
  "Quebec": [-71.2080, 46.8139],
  "Tbilisi": [44.8271, 41.7151]
}

var trips = [
  {route: ["Madrid", "Isle of Wight"], date: "Agosto 2013"},
  {route: ["Madrid", "Montreal", "Quebec"], date: "Agosto 2014"},
  {route: ["Madrid", "Assafora"], date: "Agosto 2014"},
  {route: ["Madrid", "Los Angeles", "Denver"], date: "Julio 2015"},
  {route: ["Madrid", "Poros", "Atenas"], date: "Agosto 2015"},
  {route: ["Madrid", "Tbilisi"], date: "Marzo 2016"},
]


var width = 1500,
    height = 1500;

var projection = d3.geo.peirceQuincuncial()
    .rotate([-70, -90, 45])
    .scale(315)
    .translate([width / 2, height / 2])
    .precision(.1);

var color = d3.scale.category20c();

var path = d3.geo.path()
    .projection(projection);

var graticule = d3.geo.graticule();

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

svg.append("path")
    .datum(graticule)
    .attr("class", "graticule")
    .attr("d", path);

d3.json("data/world-50m.json", function(error, world) {
  var countries = topojson.feature(world, world.objects.countries).features,
      neighbors = topojson.neighbors(world.objects.countries.geometries);
  if (error) throw error;

  svg.insert("path", ".graticule")
      .datum(topojson.feature(world, world.objects.land))
      .attr("class", "land")
      .attr("d", path)

  colors = ["#3182bd", "#6baed6", "#9ecae1", "#c6dbef", "#1f77b4", "#91D5FA", "#A5E5FA", "#64BBD9"]
  color = function(i) {return colors[i]}

  svg.selectAll(".country")
    .data(countries)
    .enter().insert("path", ".graticule")
    .attr("class", "country")
    .attr("d", path)
    .style("fill", function(d, i) { return color(d.color = d3.max(neighbors[i], function(n) { return countries[n].color; }) + 1 | 0); });
});

// Draw cities
_(cityCoords).forEach(function(coords, city) {
  svg.append('svg:circle')
    .attr("transform", function(d) { return "translate(" + projection(coords) + ")"; })
    .attr('r', 3)
    .attr('class', "city")
    .on('mouseover', function(d, i){
      if (document.getElementById(city)) { return }
      svg.append("text")
        .attr("id", city)
        .attr("class", "place-label")
        .attr("transform", function(d) { return "translate(" + projection(coords) + ")"; })
        .attr("dy", ".35em")
        .attr("dx", ".55em")
        .text(city)
    })
})

_(trips).forEach(function(trip) {
  var points = _.map(trip.route, function(val) {
    var p = projection(cityCoords[val])
    return {"x": p[0], "y": p[1]}
  })

  var lineFunction = d3.svg.line()
      .x(function(d) { return d.x; })
      .y(function(d) { return d.y; })
      .interpolate("linear");

  svg.append("path")
    .attr("d", lineFunction(points))
    .attr("class", "route")
})

d3.select(self.frameElement).style("height", height + "px");
