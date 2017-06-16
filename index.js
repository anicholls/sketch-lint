const fs = require('fs');
const JSZip = require('jszip');

var schema;
var errors = [];

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

    if (!validateFormat(schema.artboard, artboard.name)) {
      errors.push({
        type: 'artboard',
        name: artboard.name
      });
    }

    for (var layer of artboard.layers) {
      if (!validateFormat(schema.layer, layer.name)) {
        errors.push({
          type: 'layer',
          name: layer.name
        });
      }
    }
  }
}

function validateFormat(formats, name) {
  let validated = false;

  for (var format of formats) {
    var pattern = new RegExp(format, "g");
    if (pattern.test(name)) {
      validated = true;
    }
  }

  return validated;
}

function reportErrors() {
  console.log('There were a total of ' + errors.length + ' errors:\n');

  for (var error of errors) {
    let typeSchema;

    if (error.type == 'artboard') {
      typeSchema = schema.artboard;
    }
    if (error.type == 'layer') {
      typeSchema = schema.layer;
    }

    console.log('Incorrect ' + error.type + ' name: "' + error.name + '"');
    console.log('Expected format(s): "' + typeSchema.join('", "') + '"\n');
  }
}
