const getProperties = require('./properties');

class SketchObject {
  constructor(json, output) {
    this.name = json['name'];
    this.class = json['_class'];
    this.style = json['style'];
    this.frame = json['frame'];
    this.output = output;

    let layers = [];
    if (json['layers']) {
      for (let layer of json['layers']) {
        layers.push(new SketchObject(layer, output));
      }
    }
    this.layers = layers;

    /* TODO:
     * - Assert necessary vars exist
     */
  }

  /*
   * Takes an object and compares it to an array of possible schemas.
   * When it finds a match, it continues to traverse down the tree.
   * If it doesn't find a match, an error is recorded.
   */
  validate(schemas, stack) {
    if (this.name == 'meta') {
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
      if (schema.class && this.class != schema.class) {
        continue;
      }

      // If it passes this check, the obj name matches the pattern
      if (checkName && schema.pattern) {
        let regex = new RegExp(schema.pattern, "g");
        if (regex.test(this.name)) {
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
          name: this.name,
          properties: getProperties(this, schema.output)
        }
        this.output.push(objOutput);
      }

      // Add the object to the stack
      if (this.class == 'artboard' && !localStack.artboard) {
        localStack['artboard'] = this.name;
      } else {
        localStack['layerPath'].push(this.name);
      }

      // If there are nested layers, validate the children
      if (this.layers && schema.layers) {
        for (let layer of this.layers) {
          let childStack = layer.validate(schema.layers, localStack);

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
      console.log('Incorrect ' + this.class + ' name: "' + this.name +
          '" in artboard: "' + stack.artboard + '"');
      console.log('Expected format(s): "' + patterns.join('", "') + '"\n');
    }

    return localStack;
  }
}

module.exports = SketchObject;
