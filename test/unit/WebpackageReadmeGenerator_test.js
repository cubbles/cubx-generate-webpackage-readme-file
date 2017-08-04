/* globals sinon, describe, beforeEach, afterEach, it, expect */
(function () {
  'use strict';
  describe('WebpackageReadmeGenerator', function () {
    var WebpackageReadmeGenerator;
    var wpReadmeGenerator;
    var fs;
    var sampleWpPath;
    var path;
    var newVersion = '0.1.0';
    beforeEach(function () {
      fs = require('fs-extra');
      path = require('path');

      sampleWpPath = path.resolve(__dirname, '../resources/sample-wp');

      WebpackageReadmeGenerator = require('../../lib/cubx-generate-webpackage-readme-file');
      wpReadmeGenerator = new WebpackageReadmeGenerator(sampleWpPath, newVersion);
    });
    describe('#_loadManifest', function () {
      var expectedManifest;
      it('should load the manifest properly', function () {
        expectedManifest = JSON.parse(fs.readFileSync(path.join(sampleWpPath, 'manifest.webpackage'), 'utf8'));
        expect(wpReadmeGenerator._loadManifest()).to.deep.equal(expectedManifest);
      });
      it('should throw Error since webpackagePath is wrong and no manifest is found', function () {
        expect(function () {
          wpReadmeGenerator = new WebpackageReadmeGenerator('/wrong/wrong', '1.0');
          wpReadmeGenerator._loadManifest();
        }).to.throw(/Webpackage manifest not found/);
      });
    });
    describe('#generateReadmeFile', function () {
      var expectedReadme;
      it('it should generate the README file with a sample component and demonstrating how to init', function () {
        expectedReadme = fs.readFileSync(path.join(sampleWpPath, 'README_Sample_Init.md'), 'utf8');
        wpReadmeGenerator.templateValues.storeName = 'sandbox';
        wpReadmeGenerator.templateValues.includeSample = true;
        wpReadmeGenerator.templateValues.includeInit = true;
        wpReadmeGenerator.templateValues.sampleArtifactId = 'my-artifact';
        wpReadmeGenerator.templateValues.sampleSlotName = 'name';
        wpReadmeGenerator.templateValues.sampleSlotValue = '"John Doe"';
        wpReadmeGenerator.generateReadmeFile();
        expect(fs.readFileSync(path.join(sampleWpPath, 'README.md'), 'utf8')).to.equal(expectedReadme);
      });
      it('it should generate the README file with a sample component and without demonstrating how to init', function () {
        expectedReadme = fs.readFileSync(path.join(sampleWpPath, 'README_Sample_NoInit.md'), 'utf8');
        wpReadmeGenerator.templateValues.storeName = 'sandbox';
        wpReadmeGenerator.templateValues.includeSample = true;
        wpReadmeGenerator.templateValues.sampleArtifactId = 'my-artifact';
        wpReadmeGenerator.generateReadmeFile();
        expect(fs.readFileSync(path.join(sampleWpPath, 'README.md'), 'utf8')).to.equal(expectedReadme);
      });
      it('it should generate the README file without a sample component and without demonstrating how to init', function () {
        expectedReadme = fs.readFileSync(path.join(sampleWpPath, 'README_NoSample_NoInit.md'), 'utf8');
        wpReadmeGenerator.templateValues.storeName = 'sandbox';
        wpReadmeGenerator.templateValues.includeSample = false;
        wpReadmeGenerator.generateReadmeFile();
        expect(fs.readFileSync(path.join(sampleWpPath, 'README.md'), 'utf8')).to.equal(expectedReadme);
      });
    });
    describe('#setOptions', function () {
      var options;
      it('it should set the given options', function () {
        options = {
          storeName: 'sandbox',
          includeSample: true,
          includeInit: true,
          sampleArtifactId: 'my-artifact',
          sampleSlotName: 'name',
          sampleSlotValue: '"John Doe"'
        };
        wpReadmeGenerator.setTemplateValues(options);
        expect(wpReadmeGenerator.templateValues).to.equal(options);
      });
      it('it should throw an exception since \'storeName\' is not provided', function () {
        options = {
          includeSample: true,
          includeInit: true,
          sampleArtifactId: 'my-artifact',
          sampleSlotName: 'name',
          sampleSlotValue: '"John Doe"'
        };
        expect(function () {
          wpReadmeGenerator.setTemplateValues(options);
        }).to.throw(/Missed storeName option/);
      });
      it('it should throw an exception since \'storeName\' is not a string', function () {
        options = {
          storeName: 1,
          includeSample: true,
          includeInit: true,
          sampleArtifactId: 'my-artifact',
          sampleSlotName: 'name',
          sampleSlotValue: '"John Doe"'
        };
        expect(function () {
          wpReadmeGenerator.setTemplateValues(options);
        }).to.throw(/Invalid storeName value/);
      });
      it('it should throw an exception since \'sampleArtifactId\' is not a provided, though \'includeSample\' is true', function () {
        options = {
          storeName: 'sandbox',
          includeSample: true,
          includeInit: true,
          sampleSlotName: 'name',
          sampleSlotValue: '"John Doe"'
        };
        expect(function () {
          wpReadmeGenerator.setTemplateValues(options);
        }).to.throw(/Missed sampleArtifactId option/);
      });
      it('it should throw an exception since \'sampleSlotName\' is not a provided, though \'includeInit\' is true', function () {
        options = {
          storeName: 'sandbox',
          includeSample: true,
          includeInit: true,
          sampleArtifactId: 'my-artifact',
          sampleSlotValue: '"John Doe"'
        };
        expect(function () {
          wpReadmeGenerator.setTemplateValues(options);
        }).to.throw(/Missed sampleSlotName option/);
      });
      it('it should throw an exception since \'sampleSlotValue\' is not a provided, though \'includeInit\' is true', function () {
        options = {
          storeName: 'sandbox',
          includeSample: true,
          includeInit: true,
          sampleArtifactId: 'my-artifact',
          sampleSlotName: 'name'
        };
        expect(function () {
          wpReadmeGenerator.setTemplateValues(options);
        }).to.throw(/Missed sampleSlotValue option/);
      });
    });
    describe('#_logAndThrowError', function () {
      var errorName = 'Test Error';
      var errorMessage = 'Test error message';
      var spyConsole;
      beforeEach(function () {
        spyConsole = sinon.spy(console, 'error');
      });
      afterEach(function () {
        console.error.restore();
      });
      it('it should log an error message and throw an error', function () {
        expect(function () {
          wpReadmeGenerator._logAndThrowError(errorName, errorMessage);
        }).to.throw(errorName);
        expect(spyConsole).to.be.calledWith('WebpackageReadmeGenerator: ' + errorMessage);
      });
      it('it should log an error message but not throw an error', function () {
        expect(function () {
          wpReadmeGenerator._logAndThrowError('', errorMessage);
        }).to.not.throw();
        expect(spyConsole).to.be.calledWith('WebpackageReadmeGenerator: ' + errorMessage);
      });
      it('it should throw an error but not log an error message', function () {
        expect(function () {
          wpReadmeGenerator._logAndThrowError(errorName, '');
        }).to.throw(errorName);
        expect(spyConsole).not.to.be.called;
      });
    });
  });
})();
