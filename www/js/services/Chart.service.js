angular.module('pavment.services')
.factory('Chart', function() {

  var angles = [];
  var lineData = { 
    cols: [
      {id: "sample", label: "Sample", type: "number"},
      {id: "elevation", label: "Elevation", type: "number"},
      {id: "style", type: "string", role: "style"}
    ],
    rows: []
  };
  var pieData = {
    cols: [
        {id: "steep", label: "Steepness range", type: "string"},
        {id: "no", label: "Percent", type: "number"}
    ],
    rows: [
      {
        c: [
          {v: "Uphill haul"},
          {v: 1 },
        ]},
        {c: [
          {v: "Uphill climb"},
          {v: 1 }
        ]},
        {c: [
          {v: "Flat ground"},
          {v: 1 },
        ]},
        {c: [
          {v: "Pleasant downhill"},
          {v: 1 },
        ]},
        {c: [
          {v: "Steep downhill"},
          {v: 1 },
        ]},
        {c: [
          {v: "Insane drop"},
          {v: 1 },
        ]
      }
    ]
  };

  return {
    sync: function(elevations, distance) {
      var distanceChunk = distance/elevations.length;
      var styles;
      var steep = [0, 0, 0, 0, 0, 0] // uphill > downhill
      for (var i = 0; i < elevations.length; i++) {

        if (i != 0) {
          elevationChange = (elevations[i].elevation - elevations[i-1].elevation)/distanceChunk;

          if (elevationChange > 0.03) { // UPHILL HAUL
            styles = 'color: purple; stroke-width: 3;';
            steep[0]++;
          } else if (elevationChange <= 0.03 && elevationChange > 0.005) { // UPHILL CLIMB
            styles = 'color: #2199e8; stroke-width: 3;';
            steep[1]++;
          } else if (elevationChange <= 0.005 && elevationChange >= -0.005) { // FLAT GROUND
            styles = 'color: #8b8b8b; stroke-width: 3;';
            steep[2]++;
          } else if (elevationChange < -0.005 && elevationChange >= -0.01) { // PLEASANT DOWNHILL
            styles = 'color: #3adb76; stroke-width: 3;';
            steep[3]++;
          } else if (elevationChange < -0.01 && elevationChange >= -0.03) { // MODERATE DOWNHILL
            styles = 'color: #ffae00; stroke-width: 3;';
            steep[4]++;
          } else if (elevationChange < -0.03) { // STEEP DOWNHILL
            styles = 'color: #ec5840; stroke-width: 3;';
            steep[5]++;
          };
          for (var j = 0; j < steep.length; j++) {
            pieData.rows[j].c[1].v = steep[j];
          }
          //pieData.rows[0].c[1].v;
        }
        var label = (i == 0) ? "Start" : "Point "+i;
        label = (i == elevations.length - 1) ? "Finish" : label;
        var metres = parseFloat(elevations[i].elevation.toFixed(4));
        lineData.rows[i] = {
          c: [
            {v: i, f: label},
            {v: metres, f: metres+'m' },
            {v: styles }
          ]
        };

      }
      return lineData;
    },
    get: function(type) {
      switch (type) {
        case 'line':
          return lineData;
          break;
        case 'pie':
          return pieData;
          break;
        default:
          return lineData;
          break;
      }
      return lineData;
    }
  };
});