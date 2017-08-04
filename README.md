# cubx-generate-webpackage-readme-file

[![Build Status](https://travis-ci.org/cubbles/cubx-generate-webpackage-readme-file.svg?branch=master)](https://travis-ci.org/cubbles/cubx-generate-webpackage-readme-file)

Module for generating the readme file of a webpackage.

## Usage: 
### Command line: 

```
ubx-generate-webpackage-readme-file -p <...> -s <...> [--includeSample <...> --sampleArtifactId <...> includeInit: <...> sampleSlotName: <...> sampleSlotValue: <...>] 
```

### Other npm modules

```javascript

var optionDefinitions = [
  { name: 'webpackagePath', type: String, defaultOption: true, alias: 'p' },
  { name: 'storeName', type: String, alias: 's' },
  { name: 'includeSample', type: Boolean },
  { name: 'includeInit', type: Boolean },
  { name: 'sampleArtifactId', type: String },
  { name: 'sampleSlotName', type: String },
  { name: 'sampleSlotValue', type: String }
];
var WebpackageReadmeGenerator = require('cubx-generate-webpackage-readme-file');



var webpackagePath = ...;

var options = {
    storeName: ..., 
    includeSample: ...,
    sampleArtifactId: ...,
    includeInit: ...,
    sampleSlotName: ...,
    sampleSlotValue: ...
};

var generator = new WebpackageReadmeGenerator(webpackagePath);
generator.setTemplateValues(options);
generator.generateReadmeFile();
```
### Parameters
* **webpackagePath** or **-p**: _(string, required)_ path of the webpackage.
* **storeName** or **-s**: _(string, required)_ Name of the store where the webpackage is hosted. To be used for the links associated to each artifact.
* **includeSample**: _(boolean)_ indicates whether an example using a component should be include.
* **sampleArtifactId**: _(string, required if `includeSample === true`)_ It is the artifactId of the component to be used as example.
* **includeInit**: _(boolean)_ indicates whether a demo of how to initialise the example component should be include.
* **sampleSlotName**: _(string, required if `includeInit === true`)_ It is the slotId of the slot to be used for the initialisation demo.
* **sampleSlotValue**: _(any, required if `includeInit === true`)_ It is the value of the slot to be used for the initialisation demo. It should be JSON valid.
