const fs = require('fs');
const JSZip = require('jszip');

var schema;
var pages = [];
var errors = {};
var instances = {};
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


    const outputJson = JSON.stringify(output, null, 2);

    fs.writeFile("output.json", outputJson, (err) => {
      if (err) {
        return console.log(err);
      }
    });

    //reportErrors(page.name);
  }

  return result;
}

function checkPage(pageName, artboards) {
  for (var artboard of artboards) {

    var stack = {
      page: pageName,
      layerPath: []
    }

    validateSketchObject(artboard, schema.hierarchy, stack);
  }
}

/*
 * Takes an object and compares it to an array of possible schemas.
 * When it finds a match, it continues to traverse down the tree.
 * If it doesn't find a match, an error is recorded.
 */
function validateSketchObject(obj, schemas, stack) {
  if (obj.name == 'meta') {
    return;
  }

  // Copy stack for local use
  let localStack = JSON.parse(JSON.stringify(stack));

  // If none of the schema's have a `pattern` key, don't check names
  let checkName = schemas.some((o) => {
    return 'pattern' in o;
  });
  let nameValidated = !checkName;

  // TODO: Add support for schema.pattern to be string OR list

  for (let schema of schemas) {

    // If it passes this check, the obj has the right class
    if (schema.class && obj['_class'] != schema.class) {
      continue;
    }

    // If it passes this check, the obj name matches the pattern
    if (checkName && schema.pattern) {
      let regex = new RegExp(schema.pattern, "g");
      if (regex.test(obj.name)) {
        nameValidated = true;
      } else {
        continue;
      }
    }

    //how to handle count?

    if (schema.output) {
      // Copy stack for use in output
      let objOutput = {
        page: localStack.pageName,
        layerPath: localStack.layerPath,
        name: obj.name,
        properties: parseProperties(obj, schema.output)
      }
      output.push(objOutput);
    }

    // Add the object to the stack
    if (obj['_class'] == 'artboard' && !localStack.artboard) {
      localStack['artboard'] = obj.name;
    } else {
      localStack['layerPath'].push(obj.name);
    }

    if (obj.layers && schema.layers) {
      for (let layer of obj.layers) {
        validateSketchObject(layer, schema.layers, localStack);
      }
    }
  }

  // TODO: Separate errors by page
  if (!nameValidated) {
    let patterns = [];
    for (let schema of schemas) {
      patterns.push(schema.pattern);
    }
    console.log('Incorrect ' + obj['_class'] + ' name: "' + obj.name +
        '" in artboard: "' + stack.artboard + '"');
    console.log('Expected format(s): "' + patterns.join('", "') + '"\n');
  }
}

function parseProperties(obj, properties) {
  let objOutput = {};
  for (let property of properties) {
    if (property == 'fills.color') {
      let color = obj.style.fills[0].color;
      delete color['_class'];
      objOutput[property] = obj.style.fills[0].color;
    }
  }
  return objOutput;
}

module.exports = parseSketch;
