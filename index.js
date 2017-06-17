const fs = require('fs');
const JSZip = require('jszip');

var schema;
var errors = [];
var instances = {};

fs.readFile('schema.json', (err, data) => {
  if (err) throw err;

  schema = JSON.parse(data);
});

fs.readFile('sketch-file.sketch', (err, data) => {
  if (err) throw err;
  JSZip.loadAsync(data).then(zip => {

    // read the top level page
    // hardcoding page because im lazy ;)
    const pagePath = Object.keys(zip.files)[1];

    zip.file(pagePath)
      .async('string')
      .then(str => {
        const json = JSON.parse(str);
        const jsonStr = JSON.stringify(json, null, 2);

        checkPage(json.layers);

        fs.writeFile("sketch.json", jsonStr, (err) => {
          if (err) {
            return console.log(err);
          }
        });

        reportErrors();
      })
      .catch(err => {
        console.log(err);
      });
  });
});

function checkPage(artboards) {
  for (var artboard of artboards) {

    if (!validateArtboard(schema.artboard, artboard.name)) {
      errors.push({
        class: 'artboard',
        type: 'name',
        artboard: artboard.name
      });
    }

    for (var layer of artboard.layers) {
      if (!validateLayer(layer)) {
        errors.push({
          class: 'layer',
          type: 'name',
          artboard: artboard.name,
          name: layer.name
        });
      }
    }

    for (var layerSchema of schema.layers) {
      let count = instances[layerSchema.pattern].length || 0;

      if (layerSchema.count &&
          layerSchema.count != count) {
        errors.push({
          class: 'layer',
          type: 'count',
          artboard: artboard.name,
          name: layerSchema.pattern,
          expectedCount: layerSchema.count,
          count: count,
        });
      }
    }
  }
}

function validateArtboard(patterns, name) {
  let validated = false;

  for (var pattern of patterns) {
    var regex = new RegExp(pattern, "g");
    if (regex.test(name)) {
      validated = true;
    }
  }

  return validated;
}

function validateLayer(layer) {
  let validated = false;

  for (var layerSchema of schema.layers) {
    var pattern = new RegExp(layerSchema.pattern, "g");

    if (pattern.test(layer.name)) {
      validated = true;

      if (instances[pattern]) {
        instances[layerSchema.pattern].push(layer.name);
      }
      else {
        instances[layerSchema.pattern] = [layer.name];
      }
    }
  }

  return validated;
}

function reportErrors() {
  console.log('There were a total of ' + errors.length + ' errors:\n');

  let layerPatterns = [];
  for (var layerSchema of schema.layers) {
    layerPatterns.push(layerSchema.pattern);
  }

  // TODO: Sort by type before printing. For layer errors, sort by artboard

  for (var error of errors) {
    let schemaClass;

    if (error.class == 'layer') {
      schemaClass = schema.layers;
    }

    if (error.class == 'artboard' && error.type == 'name') {
      console.log('Incorrect artboard name: "' + error.artboard + '"');
      console.log('Expected format(s): "' + schema.artboard.join('", "') + '"\n');
    }
    else if (error.class == 'layer' && error.type == 'name') {
      console.log('Incorrect layer name: "' + error.name + '" in artboard: "' + error.artboard + '"');
      console.log('Expected format(s): "' + layerPatterns.join('", "') + '"\n');
    }
    else if (error.type == 'count') {
      console.log('The count of the pattern "' + error.name + '" did not match the spec.');
      console.log('Found: ' + error.count);
      console.log('Expected: ' + error.expectedCount + '\n');
    }
  }
}
