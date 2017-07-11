const getProperties = require('./properties');
const { PropertyError } = require('./SketchError');

class SchemaObject {
  constructor(json, errorHandler) {
    this.class = json['class'];
    this.pattern = json['pattern'];
    this.count = json['count'];
    this.assert = json['assert'];
    this.errorHandler = errorHandler;

    let layers = [];
    if (json['layers']) {
      for (let layer of json['layers']) {
        layers.push(new SchemaObject(layer, errorHandler));
      }
    }
    this.layers = layers;

    /* TODO:
     * - Check there are no other keys
     * - Check pattern if count
     * - Add support for pattern to be string OR list
     */
  }

  checkClass(cls) {
    if (!this.cls) {
      return true;
    }

    return this.class === cls;
  }

  checkName(name) {
    if (!this.pattern) {
      return true;
    }

    let regex = new RegExp(this.pattern, "g");
    return regex.test(name);
  }

  checkAssert(object, stack) {
    if (!this.assert) {
      return true;
    }
    let assertedProps = Object.keys(this.assert);

    let properties = getProperties(object, assertedProps);

    let pass = true;

    for (let property in this.assert) {
      let expectedValue = this.assert[property];
      let value = properties[property];

      // Rotations are backwards
      if (property == 'rotation') {
        value = value * -1;
      }

      // Some values are unset if they are zero (i.e. rotation)
      if (expectedValue == 0 && value == undefined) {
        continue;
      }

      if (expectedValue != value) {
        let error = new PropertyError(property, value, expectedValue)
        error.setContext(stack.page, stack.artboard, object.name);
        this.errorHandler.addError(error);

        pass = false;
      }
    }

    return pass;
  }
}

module.exports = SchemaObject;
