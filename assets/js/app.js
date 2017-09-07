var config = {
  geojson: "./assets/lib/app.php",
  title: "Harvey Toxic Sites",
  layerName: "Sites",
  hoverProperty: "name",
  sortProperty: "name",
  sortOrder: "asc"
};

var properties = [   
   {
    value: "_updated_at",
    label: "Record Last Updated at",
    table: {
      visible: false,
      sortable: true,
      formatter: dateformatter
    },
    filter: {
      type: "datetime",
      input: "select",
      operators: ["between"],
      values: []
    }
  }, {
    value: "name",
    label: "Site Name",
    table: {
      visible: true,
      sortable: true
    },
    filter: {
      type: "string",
      input: "select",
      multiple: true,
      operators: ["equal", "not_equal", "in"],
      values: []
    }
  }, {
    value: "county",
    label: "County",
    table: {
      visible: true,
      sortable: true
    },
    filter: {
      type: "string",
      input: "select",
      multiple: true,
      operators: ["equal", "not_equal", "in"],
      values: []
    }
  }, {
    value: "category",
    label: "Category",
    table: {
      visible: true,
      sortable: true
    },
    filter: {
      type: "string",
      input: "select",
      multiple: true,
      operators: ["equal", "not_equal", "in"],
      values: []
    }
  },{
    value: "agency_source",
    label: "Source",
    table: {
      visible: true,
      sortable: true
    },
    filter: {
      type: "string",
      input: "select",
      multiple: true,
      operators: ["equal", "not_equal", "in"],
      values: []
    }
  }, {
    value: "link",
    label: "Link",
    table: {
      visible: true,
      sortable: true
    },
    filter: {
      type: "string",
      input: "select",
      multiple: true,
      operators: ["equal", "not_equal", "in"],
      values: []
    }
  }
];

// function drawCharts() {
//   // Status
//   $(function() {
//     var result = alasql("SELECT status AS label, COUNT(*) AS total FROM ? GROUP BY status", [features]);
//     var columns = $.map(result, function(status) {
//       return [[status.label, status.total]];
//     });
//     var chart = c3.generate({
//         bindto: "#status-chart",
//         data: {
//           type: "pie",
//           columns: columns
//         }
//     });
//   });

//   // Zones
//   $(function() {
//     var result = alasql("SELECT congress_park_inventory_zone AS label, COUNT(*) AS total FROM ? GROUP BY congress_park_inventory_zone", [features]);
//     var columns = $.map(result, function(zone) {
//       return [[zone.label, zone.total]];
//     });
//     var chart = c3.generate({
//         bindto: "#zone-chart",
//         data: {
//           type: "pie",
//           columns: columns
//         }
//     });
//   });

//   // Size
//   $(function() {
//     var sizes = [];
//     var regeneration = alasql("SELECT 'Regeneration (< 3\")' AS category, COUNT(*) AS total FROM ? WHERE CAST(dbh_2012_inches_diameter_at_breast_height_46 as INT) < 3", [features]);
//     var sapling = alasql("SELECT 'Sapling/poles (1-9\")' AS category, COUNT(*) AS total FROM ? WHERE CAST(dbh_2012_inches_diameter_at_breast_height_46 as INT) BETWEEN 1 AND 9", [features]);
//     var small = alasql("SELECT 'Small trees (10-14\")' AS category, COUNT(*) AS total FROM ? WHERE CAST(dbh_2012_inches_diameter_at_breast_height_46 as INT) BETWEEN 10 AND 14", [features]);
//     var medium = alasql("SELECT 'Medium trees (15-19\")' AS category, COUNT(*) AS total FROM ? WHERE CAST(dbh_2012_inches_diameter_at_breast_height_46 as INT) BETWEEN 15 AND 19", [features]);
//     var large = alasql("SELECT 'Large trees (20-29\")' AS category, COUNT(*) AS total FROM ? WHERE CAST(dbh_2012_inches_diameter_at_breast_height_46 as INT) BETWEEN 20 AND 29", [features]);
//     var giant = alasql("SELECT 'Giant trees (> 29\")' AS category, COUNT(*) AS total FROM ? WHERE CAST(dbh_2012_inches_diameter_at_breast_height_46 as INT) > 29", [features]);
//     sizes.push(regeneration, sapling, small, medium, large, giant);
//     var columns = $.map(sizes, function(size) {
//       return [[size[0].category, size[0].total]];
//     });
//     var chart = c3.generate({
//         bindto: "#size-chart",
//         data: {
//           type: "pie",
//           columns: columns
//         }
//     });
//   });

//   // Species
//   $(function() {
//     var result = alasql("SELECT species_sim AS label, COUNT(*) AS total FROM ? GROUP BY species_sim ORDER BY label ASC", [features]);
//     var chart = c3.generate({
//         bindto: "#species-chart",
//         size: {
//           height: 2000
//         },
//         data: {
//           json: result,
//           keys: {
//             x: "label",
//             value: ["total"]
//           },
//           type: "bar"
//         },
//         axis: {
//           rotated: true,
//           x: {
//             type: "category"
//           }
//         },
//         legend: {
//           show: false
//         }
//     });
//   });
// }

$(function() {
  $(".title").html(config.title);
  $("#layer-name").html(config.layerName+'<br>&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-circle" style="color: red" aria-hidden="true"></i> Sites');
});

function buildConfig() {
  filters = [];
  table = [{
    field: "action",
    title: "<i class='fa fa-gear'></i>&nbsp;Action",
    align: "center",
    valign: "middle",
    width: "75px",
    cardVisible: false,
    switchable: false,
    formatter: function(value, row, index) {
      return [
        '<a class="zoom" href="javascript:void(0)" title="Zoom" style="margin-right: 10px;">',
          '<i class="fa fa-search-plus"></i>',
        '</a>',
        '<a class="identify" href="javascript:void(0)" title="Identify">',
          '<i class="fa fa-info-circle"></i>',
        '</a>'
      ].join("");
    },
    events: {
      "click .zoom": function (e, value, row, index) {
        map.fitBounds(featureLayer.getLayer(row.leaflet_stamp).getBounds());
        highlightLayer.clearLayers();
        highlightLayer.addData(featureLayer.getLayer(row.leaflet_stamp).toGeoJSON());
      },
      "click .identify": function (e, value, row, index) {
        identifyFeature(row.leaflet_stamp);
        highlightLayer.clearLayers();
        highlightLayer.addData(featureLayer.getLayer(row.leaflet_stamp).toGeoJSON());
      }
    }
}];



  $.each(properties, function(index, value) {
    // Filter config
    if (value.filter) {
      var id;
      if (value.filter.type == "integer") {
        id = "cast(properties->"+ value.value +" as int)";
      }
      else if (value.filter.type == "double") {
        id = "cast(properties->"+ value.value +" as double)";
      }
      else {
        id = "properties->" + value.value;
      }
      filters.push({
        id: id,
        label: value.label
      });
      $.each(value.filter, function(key, val) {
        if (filters[index]) {
          // If values array is empty, fetch all distinct values
          if (key == "values" && val.length === 0) {
            alasql("SELECT DISTINCT(properties->"+value.value+") AS field FROM ? ORDER BY field ASC", [geojson.features], function(results){
              distinctValues = [];
              $.each(results, function(index, value) {
                distinctValues.push(value.field);
              });
            });
            filters[index].values = distinctValues;
          } else {
            filters[index][key] = val;
          }
        }
      });
    }
    // Table config
    if (value.table) {
      table.push({
        field: value.value,
        title: value.label
      });
      $.each(value.table, function(key, val) {
        if (table[index+1]) {
          table[index+1][key] = val;
        }
      });
    }
  });

  buildFilters();
  buildTable();
}

// Basemap Layers
var api_key = 'pk.eyJ1IjoiZGlnaXRhbGdsb2JlIiwiYSI6ImNqNzk3bnF2dzBlYTUycXJ0OGtnaWJzeGEifQ.FJqlX53V0kOEmgZB_Fv0fA';

var streets = new L.tileLayer('https://{s}.tiles.mapbox.com/v4/digitalglobe.nako6329/{z}/{x}/{y}.png?access_token=' + api_key, {
    minZoom: 1,
    maxZoom: 21,
    attribution: '(c) OpenStreetMap, (c) Mapbox'
});

var terrain = new L.tileLayer('https://{s}.tiles.mapbox.com/v4/digitalglobe.nako1fhg/{z}/{x}/{y}.png?access_token=' + api_key, {
    minZoom: 1,
    maxZoom: 21,
    attribution: '(c) OpenStreetMap, (c) Mapbox'
});

var recent = new L.tileLayer('https://{s}.tiles.mapbox.com/v4/digitalglobe.nal0g75k,digitalglobe.nakolk5j/{z}/{x}/{y}.png?access_token=' + api_key, {
    minZoom: 1,
    maxZoom: 21,
    attribution: '(c) <a href="https://platform.digitalglobe.com/maps-api">DigitalGlobe</a>'
});

var aug27a_ob = new L.tileLayer('https://stormscdn.ngs.noaa.gov/20170827-rgb/{z}/{x}/{y}.png', {
    minZoom: 1,
    maxZoom: 19,
    attribution: '(c) <a href="https://platform.digitalglobe.com/maps-api">DigitalGlobe</a>'
});

var highlightLayer = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng, {
      radius: 5,
      color: "#FFF",
      weight: 2,
      opacity: 1,
      fillColor: "#00FFFF",
      fillOpacity: 1,
      clickable: false
    });
  },
  style: function (feature) {
    return {
      color: "#00FFFF",
      weight: 2,
      opacity: 1,
      fillColor: "#00FFFF",
      fillOpacity: 0.5,
      clickable: false
    };
  }
});
var featureLayer = L.geoJson(null, {
  filter: function(feature, layer) {
    return feature.geometry.coordinates[0] !== 0 && feature.geometry.coordinates[1] !== 0;
  },
  /*style: function (feature) {
    return {
      color: feature.properties.color
    };
  },*/
  pointToLayer: function (feature, latlng) {
    var fColor = "#FF0000";
    var lColor = "#968E8E";
    // if(feature.properties._status == "Incomplete"){
    //   fColor = "#FF0000";
    //   lColor = "#949494";
    // }else if(feature.properties._status == "Complete"){
    //   fColor = "#0FE20F";
    //   lColor = "#029100";
    // }
    return L.circleMarker(latlng, {
      radius: 5,
      weight: 2,
      fillColor: fColor,
      color: lColor,
      opacity: 1,
      fillOpacity: 0.5
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      layer.on({
        click: function(e) {
          identifyFeature(L.stamp(layer));
          highlightLayer.clearLayers();
          highlightLayer.addData(featureLayer.getLayer(L.stamp(layer)).toGeoJSON());
        },
        mouseover: function (e) {
          if (config.hoverProperty) {
            $(".info-control").html(feature.properties[config.hoverProperty]);
            $(".info-control").show();
          }
        },
        mouseout: function (e) {
          $(".info-control").hide();
        }
      });
    }
  }
});

  $.getJSON(config.geojson, function (data) {
    geojson = data;
    features = $.map(geojson.features, function(feature) {
      return feature.properties;
    });
    featureLayer.addData(data);
    buildConfig();
  $("#loading-mask").hide();
  });
// });

var map = L.map("map", {
  layers: [streets, featureLayer, highlightLayer]
}).fitWorld();

// ESRI geocoder
var searchControl = L.esri.Geocoding.Controls.geosearch({
  useMapBounds: 17
}).addTo(map);

// Info control
var info = L.control({
  position: "bottomleft"
});

// Custom info hover control
info.onAdd = function (map) {
  this._div = L.DomUtil.create("div", "info-control");
  this.update();
  return this._div;
};
info.update = function (props) {
  this._div.innerHTML = "";
};
info.addTo(map);
$(".info-control").hide();

// Larger screens get expanded layer control
if (document.body.clientWidth <= 767) {
  isCollapsed = true;
} else {
  isCollapsed = false;
}
var baseLayers = {
  "Streets": streets,
  "Terrain": terrain,
  "Streets/Aerial": recent
  // "August 27th Aerial": aug27
};
var overlayLayers = {
  "<span id='layer-name'>GeoJSON Layer</span>": featureLayer
    // "August 27 2017" : aug27a_ob
  // "August 28 2017 Flight 1" : aug28a_ob,
  // "August 28 2017 Flight 2" : aug28b_ob,
  // "August 29 2017 oblique" : aug29a_ob,
  // "August 29 2017 nadir" : aug29b_ob,
  // "August 30 2017" : aug30a_ob,
  // "August 31 2017 Flight 1" : aug31a_ob,
  // "August 31 2017 Flight 2" : aug31b_ob,
  // "September 01 2017 Flight 1" : sept01a_ob,
  // "September 01 2017 Flight 2" : sept01b_ob,
  // "September 01 2017 Flight 3" : sept01c_ob,
  // "September 02 2017 Flight 1" : sept02a_ob,
  // "September 02 2017 Flight 2" : sept02b_ob,
  // "September 02 2017 Flight 3" : sept02c_ob,
  // "September 03 2017" : sept03a_ob
};
var layerControl = L.control.layers(baseLayers, overlayLayers, {
  collapsed: isCollapsed
}).addTo(map);

// Filter table to only show features in current map bounds
map.on("moveend", function (e) {
  syncTable();
});

map.on("click", function(e) {
  highlightLayer.clearLayers();
});

// Table formatter to make links clickable
function urlFormatter (value, row, index) {
  if (typeof value == "string" && (value.indexOf("http") === 0 || value.indexOf("https") === 0)) {
    return "<a href='"+value+"' target='_blank'>"+value+"</a>";
  }
}
var photoPackage = [];
function photoFormatter(value) {
  var photos = [];
  if (value !== null) {
    $.each(value, function(i, v) {
      var photo_in = {
        src: v,
        type: 'image'
      };
      photos.push(photo_in);
    });
    photoPackage.push(photos);
    var renum = photoPackage.length - 1;
    return '<a href="#" onClick="dispPhotos(' + renum + ');"><i class="fa fa-camera-retro fa-2x" aria-hidden="true"></i></a>';
  }
}
function dateformatter(value) {
  if (value) {
    var m = moment.utc(value).toDate();
    return moment(m).format('ddd, MMMM Do YYYY, h:mm a');
  } else {
    return "";
  }
}
function dispPhotos(p) {
  $.fancybox.open(photoPackage[p]);
}
function buildFilters() {
  $("#query-builder").queryBuilder({
    allow_empty: true,
    filters: filters
  });
}

function applyFilter() {
  var query = "SELECT * FROM ?";
  var sql = $("#query-builder").queryBuilder("getSQL", false, false).sql;
  if (sql.length > 0) {
    query += " WHERE " + sql;
  }
  alasql(query, [geojson.features], function(features){
		featureLayer.clearLayers();
		featureLayer.addData(features);
		syncTable();
	});
}

function buildTable() {
  $("#table").bootstrapTable({
    cache: false,
    height: $("#table-container").height(),
    undefinedText: "-",
    striped: false,
    pagination: false,
    minimumCountColumns: 1,
    sortName: config.sortProperty,
    sortOrder: config.sortOrder,
    toolbar: "#toolbar",
    search: true,
    trimOnSearch: false,
    showColumns: true,
    showToggle: true,
    columns: table,
    onClickRow: function (row) {
      // do something!
    },
    onDblClickRow: function (row) {
      // do something!
    }
  });

  map.fitBounds(featureLayer.getBounds());

  $(window).resize(function () {
    $("#table").bootstrapTable("resetView", {
      height: $("#table-container").height()
    });
  });
}

function syncTable() {
  tableFeatures = [];
  featureLayer.eachLayer(function (layer) {
    layer.feature.properties.leaflet_stamp = L.stamp(layer);
    if (map.hasLayer(featureLayer)) {
      if (map.getBounds().contains(layer.getBounds())) {
        tableFeatures.push(layer.feature.properties);
      }
    }
  });
  $("#table").bootstrapTable("load", JSON.parse(JSON.stringify(tableFeatures)));
  var featureCount = $("#table").bootstrapTable("getData").length;
  if (featureCount == 1) {
    $("#feature-count").html($("#table").bootstrapTable("getData").length + " visible feature");
  } else {
    $("#feature-count").html($("#table").bootstrapTable("getData").length + " visible features");
  }
}

function identifyFeature(id) {
  var featureProperties = featureLayer.getLayer(id).feature.properties;
  var content = "<table class='table table-striped table-bordered table-condensed'>";
  $.each(featureProperties, function(key, value) {
    if (!value) {
      value = "";
    }
    if (typeof value == "string" && (value.indexOf("http") === 0 || value.indexOf("https") === 0)) {
      value = "<a href='" + value + "' target='_blank'>" + value + "</a>";
    }
    $.each(properties, function(index, property) {
      if (key == property.value) {
        if (property.info !== false) {
          if(key =="photos_url" && value.length != 0){
                    content += "<tr><th>" + property.label + "</th><td>" + photoFormatter(value) + "</td></tr>";}else{
                    content += "<tr><th>" + property.label + "</th><td>" + value + "</td></tr>";
                  }
        }
      }
    });
  });
  content += "<table>";
  $("#feature-info").html(content);
  $("#featureModal").modal("show");
}

function switchView(view) {
  if (view == "split") {
    $("#view").html("Split View");
    location.hash = "#split";
    $("#table-container").show();
    $("#table-container").css("height", "55%");
    $("#map-container").show();
    $("#map-container").css("height", "45%");
    $(window).resize();
    if (map) {
      map.invalidateSize();
    }
  } else if (view == "map") {
    $("#view").html("Map View");
    location.hash = "#map";
    $("#map-container").show();
    $("#map-container").css("height", "100%");
    $("#table-container").hide();
    if (map) {
      map.invalidateSize();
    }
  } else if (view == "table") {
    $("#view").html("Table View");
    location.hash = "#table";
    $("#table-container").show();
    $("#table-container").css("height", "100%");
    $("#map-container").hide();
    $(window).resize();
  }
}

$("[name='view']").click(function() {
  $(".in,.open").removeClass("in open");
  if (this.id === "map-graph") {
    switchView("split");
    return false;
  } else if (this.id === "map-only") {
    switchView("map");
    return false;
  } else if (this.id === "graph-only") {
    switchView("table");
    return false;
  }
});

$("#about-btn").click(function() {
  $("#aboutModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#filter-btn").click(function() {
  $("#filterModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#chart-btn").click(function() {
  $("#chartModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#view-sql-btn").click(function() {
  alert($("#query-builder").queryBuilder("getSQL", false, false).sql);
});

$("#apply-filter-btn").click(function() {
  applyFilter();
});

$("#reset-filter-btn").click(function() {
  $("#query-builder").queryBuilder("reset");
  applyFilter();
});

$("#extent-btn").click(function() {
  map.fitBounds(featureLayer.getBounds());
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#download-csv-btn").click(function() {
  $("#table").tableExport({
    type: "csv",
    ignoreColumn: [0],
    fileName: "data"
  });
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#download-excel-btn").click(function() {
  $("#table").tableExport({
    type: "excel",
    ignoreColumn: [0],
    fileName: "data"
  });
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#download-pdf-btn").click(function() {
  $("#table").tableExport({
    type: "pdf",
    ignoreColumn: [0],
    fileName: "data",
    jspdf: {
      format: "bestfit",
      margins: {
        left: 20,
        right: 10,
        top: 20,
        bottom: 20
      },
      autotable: {
        extendWidth: false,
        overflow: "linebreak"
      }
    }
  });
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#chartModal").on("shown.bs.modal", function (e) {
  drawCharts();
});
