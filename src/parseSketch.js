const fs = require('fs');
const JSZip = require('jszip');
const getProperties = require('./properties');

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

    writeOutput();

    //reportErrors(page.name);
  }

  return result;
}

function checkPage(pageName, artboards) {
  for (var artboard of artboards) {

    var stack = {
      page: pageName,
      layerPath: [],
      counts: {}
    }

    stack = validateSketchObject(artboard, schema.hierarchy, stack);

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

    // Need a pattern to track the count
    if (schema.pattern && schema.count) {
      if (stack.counts[schema.pattern]) {
        stack.counts[schema.pattern].value++;
      } else {
        stack.counts[schema.pattern] = {
          expected: schema.count,
          value: 1
        };
      }
    }

    if (schema.output) {
      let objOutput = {
        page: localStack.pageName,
        layerPath: localStack.layerPath,
        name: obj.name,
        properties: getProperties(obj, schema.output)
      }
      output.push(objOutput);
    }

    // Add the object to the stack
    if (obj['_class'] == 'artboard' && !localStack.artboard) {
      localStack['artboard'] = obj.name;
    } else {
      localStack['layerPath'].push(obj.name);
    }

    // If there are nested layers, validate the children
    if (obj.layers && schema.layers) {
      for (let layer of obj.layers) {
        let childStack = validateSketchObject(layer, schema.layers, localStack);

        // Get the updated count values from the recursive call and combine them into one object
        localStack.counts = Object.assign({}, localStack.counts, childStack.counts);
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

  return localStack;
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
