function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}


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
/*
svg.append("path")
    .datum(graticule.outline)
    .attr("class", "graticule outline")
    .attr("d", path);
*/

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
/*
  svg.insert("path", ".graticule")
      .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
      .attr("class", "boundary")
      .attr("d", path)
*/
});

svg.append('svg:circle')
  .attr("transform", function(d) {
    return "translate(" + projection([-3.7038, 40.4168]) + ")";
  })
  .attr('r', 5)
  .attr('fill', "#ff0000")

d3.select(self.frameElement).style("height", height + "px");
