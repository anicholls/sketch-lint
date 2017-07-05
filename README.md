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
- `pattern {string}`: The regex pattern to validate the name with. *Note:* names will only be tested if every sibling has a pattern.
- `count {number}`: The number of instances of the specified pattern you expect (requires `pattern`).
- `output {array<Object>}`: The style properties you'd like to enforce for matched objects. For supported properties, see [Supported Properties](#supported-properties).
- `output {array<string>}`: The style properties you'd like exported for matched objects. Any single value property is supported (i.e. `width`, `height`, `rotation`, etc.)
- `layers {array<SchemaObject>}`: If you want to enforce more guidelines on children of the matched object, you can specify more rules in the layers array.

### Example Schema

[See the example schmea](http://github.com/anicholls/sketch-lint/master/schema.json.example)

## Supported Properties

The following are properties you can specify in the `output` attribute of a SchemaObject.

### `width`
```json
{
  "width": 100
}
```

### `height`
```json
{
  "height": 100
}
```

### `x`
```json
{
  "x": 100
}
```

### `y`
```json
{
  "y": 100
}
```

### `rotation`

```json
{
  "rotation": -10
}
```

### `shadows`

```json
{
  "shadows": {
    "blurRadius": 4,
    "color": {
      "alpha": 0.5,
      "blue": 0,
      "green": 0,
      "red": 0
    },
    "offsetX": 0,
    "offsetY": 2,
    "spread": 0
  }
}
```

### `innerShadows`

```json
{
  "innerShadows": {
    "blurRadius": 3,
    "color": {
      "alpha": 0.5,
      "blue": 0,
      "green": 0,
      "red": 0
    },
    "offsetX": 0,
    "offsetY": 1,
    "spread": 0
  }
}
```

### `borders`

```json
{
  "borders": [
    {
      "color": {
        "alpha": 1,
        "blue": 0.592,
        "green": 0.592,
        "red": 0.592
      },
      "fillType": 0,
      "position": 1,
      "thickness": 1
    }
  ]
}
```

### `fills`

Note: Only gradients and solid fills supported

```json
{
  fills: [
    {
      "color": {
        "alpha": 1,
        "blue": 0.847,
        "green": 0.847,
        "red": 0.847
      },
    },
    {
      "gradient": {
        "from": "{0.5, 0}",
        "stops": [
          {
            "color": {
              "alpha": 0.5,
              "blue": 0,
              "green": 0,
              "red": 1
            },
            "position": 0
          },
          {
            "color": {
              "alpha": 0.5,
              "blue": 0,
              "green": 0,
              "red": 0
            },
            "position": 1
          }
        ],
        "to": "{0.5, 1}"
      },
    }
  ]
}
```
