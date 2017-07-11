const fs = require('fs');
const JSZip = require('jszip');
const ErrorHandler = require('./ErrorHandler');
const SketchObject = require('./SketchObject');
const SchemaObject = require('./SchemaObject');
const { CountError } = require('./SketchError');

var options;
var output = [];
var errorHandler = new ErrorHandler();

function parseSketch(optionsJson, result) {
  options = optionsJson;
  let schemas = [];

  for (let schema of options.hierarchy) {
    schemas.push(new SchemaObject(schema, errorHandler));
  }

  let pages = result.pages;
  for (var id in pages) {
    let page = pages[id];

    if (page.name == 'Symbols') {
      continue;
    }

    checkPage(schemas, page.name, page.layers);

    errorHandler.output();

    writeOutput();
  }

  return result;
}

function checkPage(schemas, pageName, artboards) {
  for (var artboard of artboards) {

    // TODO: Move stack initialization to SketchObject constructor
    // so we don't have to pass it in on validate
    var stack = {
      page: pageName,
      layerPath: [],
      counts: {}
    }

    obj = new SketchObject(artboard, output, errorHandler);

    // Recursively validate all objects in the artboard
    stack = obj.validate(schemas, stack);

    for (let pattern in stack.counts) {
      let count = stack.counts[pattern];
      if (count.value != count.expected) {

        let error = new CountError(pattern, count.value, count.expected);
        error.setContext(pageName, artboard.name);
        errorHandler.addError(error);
      }
    }
  }
}


function writeOutput() {
  if (output && !options.outputLocation) {
    console.log('Output location required in schema to output (i.e. "outputLocation": "./output.json"');
  }

  const outputJson = JSON.stringify(output, null, 2);

  fs.writeFile(options.outputLocation, outputJson, (err) => {
    if (err) {
      return console.log(err);
    }
    else {
      console.log('Style property output saved to "' + options.outputLocation + '"');
    }
  });
}

module.exports = parseSketch;
