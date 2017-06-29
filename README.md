# Sketch-lint

Sketch-tool allows you to manage and enforce guidelines within your sketch files. It is built on the sketch 43+ open file format.

The current feature support includes:

- Validate names of artboards, groups and layers based on a regex pattern
- Assert the count of a specified layer regex pattern
- Output specified style properties in a simple JSON list

Future features:

- Assert layer properties
- Export artboards and layers with cutsomizable export parameters.

## Schema

Sketch-tool owes it's power to the JSON schema it uses to validate artboards and layers. The schema looks like this:

```json
{
  "outputLocation": "./output.json",
  "hierarchy": [
    { ... }
  ]
}
```

### Hierarchy

The `hierarchy` is made out of identical objects that can have the following optional keys. All of the keys are optional and can be included or ommitted depending on how strict you want your linting to be.

- `class {string}`: This corresponds to the class used by the sketch file format (page, artboard, group, layer, rect, etc.).
- `pattern {array<string>|string}`: The regex pattern(s) to validate the name with.
- `count {number}`: The number of instances of the specified pattern you expect (requires `pattern`).
- `output {array<string}`: The style properties you'd like exported for matched objects.
- `layers {array<SchemaObject>}`: If you want to enforce more guidelines on children of the matched object, you can specify more rules in the layers array.

### Example schema

[See the example schmea](http://github.com/anicholls/sketch-lint/master/schema.json.example)
