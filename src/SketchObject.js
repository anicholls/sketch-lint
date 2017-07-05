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
   * Recursively validates the object and it's children by
   * comparing it to an array of possible schemas.
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
    let checkName = schemas.every((o) => {
      return 'pattern' in o;
    });
    let nameValidated = !checkName;

    for (let schema of schemas) {
      if (!schema.checkClass(this.class)) {
        continue;
      }

      if (checkName) {
        if (schema.checkName(this.name)) {
          nameValidated = true;
        }
        else {
          continue;
        }
      }

      this._incrementCount(schema.pattern, schema.count, localStack);

      this._output(schema.output, localStack);

      localStack = this._validateChildren(schema.layers, localStack);
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

  _incrementCount(pattern, count, stack) {
      // Need a pattern to track the count
      if (pattern && count) {
        if (stack.counts[pattern]) {
          stack.counts[pattern].value++;
        } else {
          stack.counts[pattern] = {
            expected: count,
            value: 1
          };
        }
      }
  }

  _output(outputProps, stack) {
    if (outputProps) {
      let objOutput = {
        page: stack.pageName,
        layerPath: stack.layerPath,
        name: this.name,
        properties: getProperties(this, outputProps)
      }
      this.output.push(objOutput);
    }
  }

  _validateChildren(schemas, stack) {
    // Add the object to the stack
    if (this.class == 'artboard' && !stack.artboard) {
      stack['artboard'] = this.name;
    } else {
      stack['layerPath'].push(this.name);
    }

    // If there are nested layers, validate the children
    if (this.layers && schemas.length) {
      for (let layer of this.layers) {
        let childStack = layer.validate(schemas, stack);

        // Get the updated count values from the recursive call and combine them into one object
        stack.counts = Object.assign({}, stack.counts, childStack.counts);
      }
    }

    return stack;
  }
}

module.exports = SketchObject;
