$(function() {
  // initialize tooltips
  $.fn.qtip.defaults.style.classes = 'ui-tooltip-bootstrap';
  $.fn.qtip.defaults.style.def = false;
  var map = kartograph.map('#map');
  map.loadMap('svg/DE.svg', function() {
    map.addLayer('context', {
      styles: {
        stroke: '#aaa',
        fill: '#f6f4f2'
      }
    });
    map.addLayer('regions', {
      id: 'bg',
      styles: {
        stroke: '#d8d6d4',
        'stroke-width': 10,
        'stroke-linejoin': 'round'
      }
    });
    map.addLayer('regions', {
      title: function(d) { return d.name },
      styles: {
        stroke: '#333',
        fill: '#fff'
      }
    });

    $.ajax({
      url: 'data/cities.json',
      dataType: 'json',
      success: function(cities) {
        var scale = kartograph.scale.sqrt(cities.concat([{ nb_visits: 0 }]), 'nb_visits').range([0, 60]);
        map.addSymbols({
          type: kartograph.Bubble,
          data: cities,
          location: function(city) {
            return [city.long, city.lat];
          },
          radius: function(city) {
            return scale(city.nb_visits);
          },
          tooltip: function(city) {
            return '<h3>'+city.city_name+'</h3>'+city.nb_visits+' visits';
          },
          sortBy: 'radius desc',
          style: 'fill:#800; stroke: #fff; fill-opacity: 0.5;',
        });
      }
    });

  }, { padding: -5 });
});
