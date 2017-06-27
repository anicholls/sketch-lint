const commandLineArgs = require('command-line-args');
const handleFiles = require('./src/handleFiles');

const optionDefinitions = [
  { name: 'schema', alias: 's', type: String },
  { name: 'input', alias: 'i', type: String },
]
const options = commandLineArgs(optionDefinitions);

if (!options.schema) {
  console.log('A JSON schema is required. Use the -s, or --schema flag to indicate the file location');
  return;
}
if (!options.input) {
  console.log('An input sketch file is required. Use the -i, or --input flag to indicate the file location');
  return;
}

handleFiles(options.schema, options.input);
