class SchemaObject {
  constructor(json) {
    this.class = json['class'];
    this.pattern = json['pattern'];
    this.count = json['output'];

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

  checkClass(class) {
    if (!this.class) {
      return true;
    }

    return this.class === class;
  }

  checkName(name) {
    if (!this.pattern) {
      return true;
    }

    let regex = new RegExp(schema.pattern, "g");
    return regex.test(this.name);
  }
}

module.exports = SchemaObject;
