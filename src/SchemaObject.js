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
     */
  }
}

module.exports = SchemaObject;
