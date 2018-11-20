#! /usr/bin/env node
'use strict';
var WebpackageReadmeGenerator = require('../lib/cubx-generate-webpackage-readme-file');
var commandLineArgs = require('command-line-args');

var optionDefinitions = [
  { name: 'webpackagePath', type: String, defaultOption: true, alias: 'p' },
  { name: 'storeName', type: String, alias: 's' },
  { name: 'includeSample', type: Boolean },
  { name: 'includeInit', type: Boolean },
  { name: 'sampleArtifactId', type: String },
  { name: 'sampleSlotName', type: String },
  { name: 'sampleSlotValue', type: String }
];

var options = commandLineArgs(optionDefinitions);
var generator = new WebpackageReadmeGenerator(options.webpackagePath);
generator.setTemplateValues(options);
generator.generateReadmeFile();
