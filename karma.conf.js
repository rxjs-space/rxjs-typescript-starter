/*
npm install --save-dev jasmine-core @types/jasmine karma karma-jasmine karma-webpack karma-chrome-launcher karma-sourcemap-loader
*/

module.exports = function(config) {

  config.set({

    frameworks: ['jasmine'],
    browsers: ['Chrome'],
    files: ['bundle.spec.js'],

    preprocessors: {
      'bundle.spec.js': ['webpack', 'sourcemap']
    },

    webpack: {
      resolve: {
        extensions: ['', '.ts', '.js']
      },
      devtool: 'inline-source-map',
      module: {
        loaders: [
          { test: /\.ts$/, loader: 'awesome-typescript-loader'}
        ]
      }
    }

  });

};