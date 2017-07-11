const getProperties = require('./properties');

class SchemaObject {
  constructor(json) {
    this.class = json['class'];
    this.pattern = json['pattern'];
    this.count = json['count'];
    this.assert = json['assert'];

    let layers = [];
    if (json['layers']) {
      for (let layer of json['layers']) {
        layers.push(new SchemaObject(layer));
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

  checkAssert(object) {
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
        console.log('Incorrect "' + property + '" property for layer: "' + object.name + '"');
        console.log('Found: ' + value);
        console.log('Expected: ' + expectedValue + '\n');
        pass = false;
      }
    }

    return pass;
  }
}

module.exports = SchemaObject;
