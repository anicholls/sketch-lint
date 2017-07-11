#!/usr/bin/env node

const commandLineArgs = require('command-line-args');
const getUsage = require('command-line-usage');
const handleFiles = require('./src/handleFiles');

const optionDefinitions = [
  { name: 'help', alias: 'h', type: Boolean },
  { name: 'schema', alias: 's', type: String },
  { name: 'input', alias: 'i', type: String },
]
const options = commandLineArgs(optionDefinitions);

const usage = getUsage([
  {
    header: 'Sketch Linter',
    content: 'Lint sketch files to detect naming and count irregularities.'
  },
  {
    header: 'Options',
    optionList: [
      {
        name: 'help',
        alias: 'h',
        description: 'Display this usage guide'
      },
      {
        name: 'schema',
        alias: 's',
        typeLabel: '[underline]{file}',
        description: 'The JSON schema to define the linting'
      },
      {
        name: 'input',
        alias: 'i',
        typeLabel: '[underline]{file}',
        description: 'The input .sketch file'
      }
    ]
  }
]);

if (options.help) {
  console.log(usage);
  return;
}
if (!options.schema) {
  console.log('A JSON schema is required. Use the -s, or --schema flag to indicate the file location');
  return;
}
if (!options.input) {
  console.log('An input sketch file is required. Use the -i, or --input flag to indicate the file location');
  return;
}

handleFiles(options.schema, options.input);
