/* global __dirname */

(function () {
  'use strict';

  const fs = require('fs-extra');
  const path = require('path');
  const mustache = require('mustache');

  /**
   * The WebpackageReadmeGenerator can be used to generate the readme file of a webpackage
   * @class WebpackageReadmeGenerator
   * @global
   * @constructor
   * @param {string} webpackagePath - path of the webpackage to release
   */
  const WebpackageReadmeGenerator = function (webpackagePath) {
    if (!webpackagePath) {
      this._logAndThrowError('webpackagePath parameter is missing.',
        'Missed webpackagePath parameter');
    }
    if (!path.isAbsolute(webpackagePath)) {
      this._webpackagePath = path.join(process.cwd(), webpackagePath);
    } else {
      this._webpackagePath = webpackagePath;
    }
    this.manifestPath = path.resolve(this._webpackagePath, 'manifest.webpackage');
    this.templateValues = {};
  };

  /**
   * Validate and set the values of the template
   * @param {object} values - Object containing template values, it has following structure:
   * {
   *    storeName: ...,
   *    [includeSample]: ...,
   *    [includeInit]: ...,
   *    [sampleArtifactId]: ...,
   *    [sampleSlotName]: ...,
   *    [sampleSlotValue]: ...
   * }
   */
  WebpackageReadmeGenerator.prototype.setTemplateValues = function (values) {
    if (!values.storeName) {
      this._logAndThrowError('Missed storeName option', 'storeName option is missing.');
    }
    if (typeof values.storeName !== 'string') {
      this._logAndThrowError('Invalid storeName value', 'storeName should be a string.');
    }
    if (values.includeSample && !values.sampleArtifactId) {
      this._logAndThrowError('Missed sampleArtifactId option',
        'To include a use sample the sampleArtifactId should be provided.');
    }
    if (values.includeInit && !values.sampleSlotName) {
      this._logAndThrowError('Missed sampleSlotName option',
        'To include a initialisation sample the sampleSlotName option should be provided.');
    }
    if (values.includeInit && !values.sampleSlotValue) {
      this._logAndThrowError('Missed sampleSlotValue option',
        'To include a initialisation sample the sampleSlotValue option should be provided.');
    }
    this.templateValues = values;
  };

  /**
   * Log the 'errorMessage' through the console and throws a 'errorName' Error
   * @param {string} errorName - Name of the error to be thrown
   * @param {string} errorMessage - Message to be log
   * @private
   */
  WebpackageReadmeGenerator.prototype._logAndThrowError = function (errorName, errorMessage) {
    if (errorMessage) {
      console.error('WebpackageReadmeGenerator: ' + errorMessage);
    }
    if (errorName) {
      throw new Error(errorName);
    }
  };

  /**
   * Update (write) the manifest with the version new
   */
  WebpackageReadmeGenerator.prototype.generateReadmeFile = function () {
    this.manifest = this._loadManifest();
    this.templateValues.wpName = this.manifest.name;
    this.templateValues.wpVersion = this.manifest.version;
    this.templateValues.artifacts = [];

    if (this.templateValues.sampleSlotName) {
      this.templateValues.sampleSlotSetMethod = 'set' +
        this.templateValues.sampleSlotName.substr(0, 1).toUpperCase() +
        this.templateValues.sampleSlotName.substr(1);
    }
    const artifactTypes = {
      elementaryComponents: 'Elementary Component',
      compoundComponents: 'Compound Component',
      apps: 'Application',
      utilities: 'Utilities'
    };

    for (const artifactType in this.manifest.artifacts) {
      for (let i = 0; i < this.manifest.artifacts[artifactType].length; i++) {
        const artifact = this.manifest.artifacts[artifactType][i];
        artifact.type = artifactTypes[artifactType];
        artifact.url = 'https://cubbles.world/' + this.templateValues.storeName +
          '/' + this.manifest.name + '@' + this.manifest.version + '/' + artifact.artifactId;
        this.templateValues.artifacts.push(artifact);
      }
    }

    const templatePath = path.join(__dirname, '../template/template.md');
    const dist = path.resolve(this._webpackagePath, 'README.md');

    fs.writeFileSync(
      dist,
      mustache.render(
        fs.readFileSync(templatePath, 'utf-8'),
        this.templateValues
      )
    );
  };

  /**
   * Load the manifest from this.manifestPath
   * @returns {object} - Loaded manifest
   * @private
   */
  WebpackageReadmeGenerator.prototype._loadManifest = function () {
    if (!fs.pathExistsSync(this.manifestPath)) {
      console.error(
        'WebpackageReadmeGenerator: No manifest could be found using the provided webpackage path ' +
        '(' + this._webpackagePath + '). Please provide a webpackage existing path.'
      );
      throw new Error('Webpackage manifest not found');
    }
    const manifest = fs.readFileSync(this.manifestPath, 'utf8');
    return typeof manifest === 'string' ? JSON.parse(manifest) : manifest;
  };

  module.exports = WebpackageReadmeGenerator;
}());
