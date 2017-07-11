var colors = require('colors');

colors.setTheme({
  value: 'yellow',
  context: 'cyan',
  desc: 'italic'
});

class SketchError {
  setContext(page, artboard, layer) {
    this.page = page;
    this.artboard = artboard;
    this.layer = layer;
  }

  getContextOutput() {
    let context = '';

    if (this.page) {
      context += 'Page: ' + colors.context(this.page) + '\n';
    }
    if (this.artboard) {
      context += 'Artboard: ' + colors.context(this.artboard) + '\n';
    }
    if (this.layer) {
      context += 'Layer: ' + colors.context(this.layer) + '\n';
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
    let msg = colors.desc('Incorrect ' + this.class + ' name\n\n');
    msg += this.getContextOutput();
    msg += 'Found: "' + colors.value(this.value) + '"\n';
    msg += 'Expected format(s): "' + colors.value(this.expected) + '"';

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
    let msg = colors.desc('Incorrect count of pattern\n\n');
    msg += this.getContextOutput();
    msg += 'Pattern: "' +  colors.value(this.pattern) + '"\n';
    msg += 'Found: ' + colors.value(this.value) + '\n';
    msg += 'Expected: ' + colors.value(this.expected);

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
    let msg = colors.desc('Incorrect property value\n\n');
    msg += this.getContextOutput();
    msg += 'Property: "' + colors.value(this.property) + '"\n';
    msg += 'Found: ' + colors.value(this.value) + '\n';
    msg += 'Expected: ' + colors.value(this.expected);

    return msg;
  }
}

module.exports = { NameError, CountError, PropertyError }
