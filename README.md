# Sketch-lint

Sketch-lint allows you to manage and enforce guidelines within your sketch files. It is built on the [Sketch 43+ open file format](http://sketchplugins.com/d/87-new-file-format-in-sketch-43).

Sometimes the Sketch file format can be a pain to scan and sift through. Sketch-lint helps you avoid the noise by giving you the ability to export a simple JSON blob to represent the exact styles you need for any artboard or layer.

The current feature support includes:

- **Validate** names of artboards, groups and layers based on a regex pattern
- **Count** the number of matches for a specified layer regex pattern
- **Assert** various layer properties
- **Output** specified style properties in a simple JSON list

Future features:

- **Export** artboards and layers with cutsomizable export parameters.

## Installation

1. Clone the repo and navigate into it
1. Run `npm install -g`

## Usage

```bash
sketch-lint -s ./schema.json -i ./design.sketch
```

- `-h, --help`            Display the usage guide
- `-s, --schema {file}`   The JSON schema to define the linting
- `-i, --input {file}`    The input .sketch file

## Schema

Sketch-lint owes it's power to the JSON schema it uses to validate artboards and layers. The schema looks like this:

```json
{
  "outputLocation": "./output.json",
  "hierarchy": [
    { ... }
  ]
}
```

### Hierarchy

The `hierarchy` is made out of identical `SchemaObjects` that can have the following optional keys. All of the keys are optional and can be included or ommitted depending on how strict you want your linting to be.

- `class {string}`: This corresponds to the class used by the sketch file format (page, artboard, group, layer, rect, etc.).
- `pattern {string}`: The regex pattern to validate the name with.
- `count {number}`: The number of instances of the specified pattern you expect (requires `pattern`).
- `assert {Object}`: An object of properties you want to enforce with specific values. For more information, see [Asserting Properties](#asserting-properties).
- `output {array<string>}`: The style properties you'd like to enforce for matched objects. For supported properties, see [Supported Output Properties](#supported-output-properties).
- `layers {array<SchemaObject>}`: If you want to enforce more guidelines on children of the matched object, you can specify more rules in the layers array.

### Example Schema

[See the example schmea](http://github.com/anicholls/sketch-lint/blob/master/schema.json.example)

## Asserting Properties

You can assert any property supported by the `output` option. Currently, only single value properties are officially supported, but it is possible to assert any object (i.e. shadows) as long as it identically matches the JSON styles from the Sketch file.

Example assertion:
```json
{
  "pattern": "foo",
  "assert": {
    "rotation": "0",
    "width": "220",
    "height": "80",
    "isVisible": "true"
  }
}
```

## Supported Output Properties

The following are properties you can specify in the `output` attribute of a `SchemaObject` with the resulting JSON.

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
