class SchemaObject {
  constructor(json) {
    this.class = json['class'];
    this.pattern = json['pattern'];
    this.count = json['count'];

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
}

module.exports = SchemaObject;
