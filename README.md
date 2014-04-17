# grunt-required

> A Grunt task for detecting required modules and option to automatically install with npm.

## Getting Started
_If you haven't used [grunt][] before, be sure to check out the [Getting Started][] guide._

From the same directory as your project's [Gruntfile][Getting Started] and [package.json][], install this plugin with the following command:

```bash
npm install grunt-required --save-dev
```

Once that's done, add this line to your project's Gruntfile:

```js
grunt.loadNpmTasks('grunt-required');
```

If the plugin has been installed correctly, running `grunt --help` at the command line should list the newly-installed plugin's task or tasks. In addition, the plugin should be listed in package.json as a `devDependency`, which ensures that it will be installed whenever the `npm install` command is run.

[grunt]: http://gruntjs.com/
[Getting Started]: https://github.com/gruntjs/grunt/blob/devel/docs/getting_started.md
[package.json]: https://npmjs.org/doc/json.html

## The "required" task

### Overview
In your project's Gruntfile, add a section named `required` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  required: {
    libs: {
      options: {
        // npm install missing modules
        install: true
      },
      // Search for require() in all js files in the src folder
      src: ['src/*.js']
    }
  }
});
```

### Options

#### options.install
Type: `Boolean`
Default value: `false`

Set to true to have `npm` install missing required modules.

#### options.ignore
Type: `Array`
Default value: `[ /* list of Node.js core libs */ ]`

Specify modules to ignore. By default it will ignore a list of core Node.js modules.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Lint and test your code using [grunt][].

## Release History

* 0.1.2 - Fix for multiple files (@N9VijayIyer)
* 0.1.1 - Grunt v0.4 support.
* 0.1.0 - Initial release.
