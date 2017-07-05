const fs = require('fs');
const JSZip = require('jszip');
const SketchObject = require('./SketchObject');
const SchemaObject = require('./SchemaObject');

var schema;
var errors = {};
var output = [];

function parseSketch(schemaJson, result) {
  schema = schemaJson;

  let pages = result.pages;
  for (var id in pages) {
    let page = pages[id];

    if (page.name == 'Symbols') {
      continue;
    }

    errors[page.name] = [];

    checkPage(page.name, page.layers);

    writeOutput();

    //reportErrors(page.name);
  }

  return result;
}

function checkPage(pageName, artboards) {
  for (var artboard of artboards) {

    // TODO: Move stack initialization to SketchObject constructor
    // so we don't have to pass it in on validate
    var stack = {
      page: pageName,
      layerPath: [],
      counts: {}
    }

    obj = new SketchObject(artboard, output);

    // Recursively validate all objects in the artboard
    stack = obj.validate(schema.hierarchy, stack);

    for (let pattern in stack.counts) {
      let count = stack.counts[pattern];
      if (count.value != count.expected) {
        console.log('Invalid count for: "' + pattern + '" in artboard: "' + artboard.name + '"');
        console.log('Found: ' + count.value);
        console.log('Expected: ' + count.expected + '\n');
      }
    }
  }
}


function writeOutput() {
  if (output && !schema.outputLocation) {
    console.log('Output location required in schema to output (i.e. "outputLocation": "./output.json"');
  }

  const outputJson = JSON.stringify(output, null, 2);

  fs.writeFile(schema.outputLocation, outputJson, (err) => {
    if (err) {
      return console.log(err);
    }
    else {
      console.log('Style property output saved to "' + schema.outputLocation + '"');
    }
  });
}

module.exports = parseSketch;
