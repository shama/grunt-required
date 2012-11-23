/*
 * grunt-required
 * https://github.com/shama/grunt-required
 *
 * Copyright (c) 2012 Kyle Robinson Young
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
  'use strict';

  var detective = require('detective');
  var path = require('path');
  var fs = require('fs');

  // Grunt v0.3 compat
  grunt.file.exists = grunt.file.exists || fs.existsSync || path.existsSync;

  // use npm to install given modules
  function npmInstall(requires, done) {
    var npmBin = path.join(path.dirname(process.argv[0]), 'npm');
    if (process.platform === 'win32') { npmBin += '.cmd'; }
    grunt.util.async.forEachSeries(requires, function(module, next) {
      // skip existing modules
      if (grunt.file.exists(path.join('./node_modules/' + module))) {
        grunt.log.writeln(String('Module "' + module + '" already installed, skipping.').cyan);
        return next();
      }
      grunt.log.writeln('npm install ' + module + ' --save');
      // spawn npm install
      var s = grunt.util.spawn({
        cmd: npmBin,
        args: ['install', module, '--save']
      }, next);
      // write output
      s.stdout.on('data', function(buf) { grunt.log.write(String(buf)); });
      s.stderr.on('data', function(buf) { grunt.log.write(String(buf)); });
    }, done);
  }

  grunt.registerMultiTask('required', 'A Grunt task for detecting required modules and option to automatically install with npm.', function() {
    var helpers = require('grunt-lib-contrib').init(grunt);
    var options = grunt.util._.defaults(helpers.options(this), {
      // set true to try to install found libs automatically
      install: false,
      // array of modules to ignore - default built in libs
      ignore: ['assert', 'buffer', 'child_process', 'cluster',
      'crypto', 'dgram', 'dns', 'events', 'fs', 'http', 'https', 'net',
      'os', 'path', 'punycode', 'querystring', 'readline', 'repl',
      'string_decoder', 'tls', 'tty', 'url', 'util', 'vm', 'zlib']
    });
    var done = this.async();

    // TODO: ditch this when grunt v0.4 is released
    this.files = this.files || helpers.normalizeMultiTaskFiles(this.data, this.target);

    this.files.forEach(function(fileObj) {
      var files = grunt.file.expand({nonull: true}, fileObj.src);
      var src = files.map(function(filepath) {
        // find required libs
        var requires = detective(grunt.file.read(filepath));

        // filter out ignored libs
        requires = grunt.util._.chain(requires)
          .filter(function(module) {
            // filter local libs
            if (module.slice(0, 2) === './') { return false; }
            // filter ignored libs
            return grunt.util._.indexOf(options.ignore, module) === -1;
          }).map(function(module) {
            // get actual module name
            if (module.indexOf('/') !== -1) {
              module = module.slice(0, module.indexOf('/'));
            }
            return module;
          })
          .uniq()
          .value()
        ;

        grunt.log.ok('"' + requires.join('", "') + '" required in ' + filepath);

        // if auto install modules
        if (options.install) { npmInstall(requires, done); }
        else { done(); }
      });
    });
  });

};
