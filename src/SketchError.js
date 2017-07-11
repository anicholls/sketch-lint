class SketchError {
  constructor(descriptor, type, value, expected) {
    this.descriptor = descriptor;
    this.type = type;
    this.value = value;
    this.expected = expected;

    // TODO: Assert the above are defined as expected depending on type^^
    // TODO: Add support for artboard and page
  }

  setContext(layer, artboard, page) {
    this.layer = layer;
    this.artboard = artboard;
    this.page = page;
  }

  getMessage() {
    let msg = '---------------------\n'
    let expected = (typeof this.expected ==  Array) ?
        this.expected.join('", "') : this.expected;

    msg += 'SketchError (' + this.type + '):\n';

    if (this.type == 'name') {
      msg += 'Incorrect ' + this.class + ' name: "' + this.value + '"\n';
      msg += 'Expected format(s): "' + this.expected + '"';
    }

    else if (this.type == 'count') {
      msg += 'The count of the pattern "' + this.name + '" did not match the spec.';
      msg += 'Found: ' + this.value + '\n';
      msg += 'Expected: ' + this.expected;
    }

    else if (this.type == 'property') {
      msg += 'Incorrect "' + this.objClass + '" property';
      if (this.layer) {
        msg += ' for layer: "' + this.layer + '"';
      }
      msg += '\nFound: ' + this.value + '\n';
      msg += 'Expected: ' + this.expected;
    }

    return msg;
  }
}

// TODO: Add enums for type

module.exports = SketchError;
