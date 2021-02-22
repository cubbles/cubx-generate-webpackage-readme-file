#! /usr/bin/env node
'use strict';
const WebpackageReadmeGenerator = require('../lib/cubx-generate-webpackage-readme-file');
const commandLineArgs = require('command-line-args');

const optionDefinitions = [
  { name: 'webpackagePath', type: String, defaultOption: true, alias: 'p' },
  { name: 'storeName', type: String, alias: 's' },
  { name: 'includeSample', type: Boolean },
  { name: 'includeInit', type: Boolean },
  { name: 'sampleArtifactId', type: String },
  { name: 'sampleSlotName', type: String },
  { name: 'sampleSlotValue', type: String }
];

const options = commandLineArgs(optionDefinitions);
const generator = new WebpackageReadmeGenerator(options.webpackagePath);
generator.setTemplateValues(options);
generator.generateReadmeFile();
