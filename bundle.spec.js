/*
https://webpack.github.io/docs/context.html#context-module-api
*/


var testsContext = require.context("./src/", true, /\.spec\.ts$/);
testsContext.keys().forEach(testsContext);
