//   getMessage() {
//     let msg = '---------------------\n'
//     let expected = (typeof this.expected ==  Array) ?
//         this.expected.join('", "') : this.expected;

//     let order = {
//       'Layer Name': this.layer,
//       'Artboard Name': this.artboard,
//       'Page Name': this.page,
//       'Descriptor': this.descriptor,
//       'Value': this.value,
//       'Expected': this.expected
//     }

//     msg += 'SketchError (' + this.type + '):\n';

//     for (let param in order) {
//       if (order[param]) {
//         msg += param + ': ' + order[param] + '\n';
//       }
//     }

class SketchError {
  setContext(page, artboard, layer) {
    this.page = page;
    this.artboard = artboard;
    this.layer = layer;
  }

  getContextOutput() {
    let context = '';

    if (this.page) {
      context += 'Page: ' + this.page + '\n';
    }
    if (this.artboard) {
      context += 'Artboard: ' + this.artboard + '\n';
    }
    if (this.layer) {
      context += 'Layer: ' + this.layer + '\n';
    }

    return context;
  }
}

class NameError extends SketchError {
  constructor(objClass, value, expected) {
    super();
    this.class = objClass;
    this.value = value;
    this.expected = (typeof expected ==  Array) ? expected.join('", "') : expected;
  }

  getMessage() {
    let msg = this.getContextOutput();
    msg += 'Incorrect ' + this.class + ' name: "' + this.value + '"\n';
    msg += 'Expected format(s): "' + this.expected + '"';

    return msg;
  }
}

class CountError extends SketchError {
  constructor(pattern, value, expected) {
    super();
    this.pattern = pattern;
    this.value = value;
    this.expected = expected;
  }

  getMessage() {
    let msg = this.getContextOutput();
    msg += 'The count of the pattern "' + this.name + '" did not match the spec.\n';
    msg += 'Found: ' + this.value + '\n';
    msg += 'Expected: ' + this.expected;

    return msg;
  }
}

class PropertyError extends SketchError {
  constructor(property, value, expected) {
    super();
    this.property = property;
    this.value = value;
    this.expected = expected;
  }

  getMessage() {
    let msg = this.getContextOutput();
    msg += 'Incorrect "' + this.property + '" property\n';
    msg += 'Found: ' + this.value + '\n';
    msg += 'Expected: ' + this.expected;

    return msg;
  }
}

module.exports = { NameError, CountError, PropertyError }
