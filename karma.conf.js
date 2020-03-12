// Karma configuration
// Generated on Sun Sep 29 2019 19:17:50 GMT-0700 (Pacific Daylight Time)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: './',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai'],


    // list of files / patterns to load in the browser
    files: [
        { pattern: 'src/js/core/def.mjs', type: 'module' },
        { pattern: 'src/js/core/choicelist.mjs', type: 'module' },
        { pattern: 'src/js/core/framelist.mjs', type: 'module' },
        { pattern: 'src/js/core/mate.mjs', type: 'module' },
        { pattern: 'src/js/core/position.mjs', type: 'module' },
        { pattern: 'src/js/core/scenelist.mjs', type: 'module' },
        { pattern: 'src/js/core/easing.mjs', type: 'module' },
        { pattern: 'src/js/core/standardize_choices.mjs', type: 'module' },
        { pattern: 'src/js/core/base64_to_blob.mjs', type: 'module' },
        { pattern: 'src/js/core/assets.mjs', type: 'module' },
        { pattern: 'src/js/core/animations.mjs', type: 'module' },
        { pattern: 'src/js/core.mjs', type: 'module' },
        { pattern: 'src/js/middleware/universe.browser.mjs', type: 'module' },
	    { pattern: 'test/*.js', type: 'module' },
    ],


    // list of files / patterns to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['dots'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_WARN,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Other'],
    customLaunchers: {
      Other: {
        base: 'ChromiumHeadless',
        flags: ['--no-sandbox']
      }
    },


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    captureConsole: true
  })
}
