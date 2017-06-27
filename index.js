const fs          = require('fs');
const sketch2json = require('sketch2json');
const parseSketch = require('./src/parseSketch');
const SKETCH_FILE = '/system-icons.sketch';

var schema;

fs.readFile('schema.json', (err, data) => {
  if (err) throw err;

  schema = JSON.parse(data);
});

fs.readFile(__dirname + SKETCH_FILE, (error, data) => {
  console.log('Linting file: "' + 'system-icons.sketch' + '"\n');

  sketch2json(data)
    .then(parseSketch.bind(this, schema))
    .then(exportJson)
    .catch(err => {
      console.log(err);
    });
});

function exportJson(result) {
  const jsonStr = JSON.stringify(result, null, 2);

  fs.writeFile("sketch.json", jsonStr, (err) => {
    if (err) {
      return console.log(err);
    }
  });
}
